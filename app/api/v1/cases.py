import asyncio
import os
import shutil
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from starlette.concurrency import run_in_threadpool
from app.services.pdf_separator import (
    PAGE_SCAN_WORKERS,
    PLACEHOLDER_APPLICANT_NAMES,
    PdfPasswordRequired,
    PdfWrongPassword,
    _apply_rotation_if_needed,
    assign_relationships,
    burst_and_separate_pdf_with_llm,
    classify_and_store_single_image,
    detect_document_rotation_with_llm,
    map_llm_doc_type_to_document_type,
    reconcile_case_documents,
    tag_applicant_slots,
)
from sqlalchemy import asc, desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user, get_current_ca_user, get_optional_current_user, require_role
from app.api.v1.auth import login_aliases
from app.core.config import settings
from app.core.database import get_db
from app.core.timezone import format_ist
from app.models.document import CaseDocument, DocumentType, VerificationStatus
from app.models.loan_case import CaseStatus, LoanCase
from app.models.report import AuditLog
from app.models.user import User, UserRole
from app.schemas.loan_case import CaseAssignRequest, CaseCreate, CaseResponse, CaseUpdate, ReassignDocumentsRequest
from app.services.geocoder import PRECISION_INFO, geocode_address, is_placeholder

router = APIRouter(prefix="/cases", tags=["Case Management & Allocation"])


async def resolve_loan_case(db: AsyncSession, case_id: str) -> Optional[LoanCase]:
    """Flexible lookup: accepts a real case UUID or a human-readable case_no (fuzzy match)."""
    try:
        target_uuid = uuid.UUID(case_id)
        result = await db.execute(select(LoanCase).where(LoanCase.id == target_uuid))
        return result.scalar_one_or_none()
    except ValueError:
        clean_case_no = case_id.replace("-pargi", "").upper()
        result = await db.execute(
            select(LoanCase).where(
                (LoanCase.case_no == case_id) |
                (LoanCase.case_no.ilike(f"%{clean_case_no}%"))
            )
        )
        return result.scalar_one_or_none()


@router.get("", response_model=List[CaseResponse])
async def list_cases(
    status_filter: Optional[CaseStatus] = Query(None, alias="status"),
    exclude_status: Optional[CaseStatus] = Query(None),
    bank_name: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_ca_user),
):
    """
    List loan verification cases.
    - FIELD_AGENT sees only cases assigned to them.
    - CA_VERIFIER and SUPER_ADMIN see all cases.
    - exclude_status: lets the Management Portal's default "Active Cases" view fetch
      everything except CERTIFIED in one request, instead of loading every case (including
      ones that are already finished and archived) on every page load/poll.
    """
    query = select(LoanCase).order_by(desc(LoanCase.created_at))

    if current_user.role == UserRole.FIELD_AGENT:
        query = query.where(LoanCase.assigned_agent_id == current_user.id)

    if status_filter:
        query = query.where(LoanCase.status == status_filter)

    if exclude_status:
        query = query.where(LoanCase.status != exclude_status)

    if bank_name:
        query = query.where(LoanCase.bank_name.ilike(f"%{bank_name}%"))

    result = await db.execute(query)
    cases = result.scalars().all()

    # The Management view's "Visit Telemetry" column used to fall back to a hardcoded "32m
    # (COMPLIANT)" placeholder whenever a case's benchmark-distance wasn't already computed
    # client-side (which only ever happened for whichever ONE case the CA had last opened in
    # Scrutiny) - every other case in the list silently showed fake, always-compliant telemetry.
    # Attach each case's real distance here instead, from its most recent geotagged photo (the
    # exact same distance_from_target already computed and stored at upload time), in one
    # extra query rather than per-case, so a CA-office test upload shows its real (likely
    # breach) distance instead of looking compliant.
    case_ids = [c.id for c in cases]
    if case_ids:
        docs_result = await db.execute(
            select(CaseDocument)
            .where(
                CaseDocument.case_id.in_(case_ids),
                CaseDocument.latitude.isnot(None),
                CaseDocument.longitude.isnot(None),
            )
            .order_by(CaseDocument.captured_at.desc())
        )
        latest_by_case: Dict[uuid.UUID, CaseDocument] = {}
        for d in docs_result.scalars().all():
            if d.case_id not in latest_by_case:
                latest_by_case[d.case_id] = d
        for c in cases:
            d = latest_by_case.get(c.id)
            c.capture_lat = d.latitude if d else None
            c.capture_lon = d.longitude if d else None
            c.distance_m = d.distance_from_target if d else None

    # Auto-heal any case whose loan_amount was stored with a stripped Lakh decimal (e.g. 2035 from "20.35 LAC")
    # or whose neighbour_1 combined two neighbour names (e.g. "BABU RAO - RAJU BHAI")
    import json as _json_heal
    from app.services.field_form_pdf_ingest import (
        resolve_effective_loan_amount,
        _expand_and_normalize_references,
    )
    healed_any = False
    for c in cases:
        ff_dict = {}
        if c.field_form_data:
            try:
                parsed_ff = _json_heal.loads(c.field_form_data)
                if isinstance(parsed_ff, dict):
                    ff_dict = parsed_ff
            except Exception:
                ff_dict = {}
        if c.loan_amount is None or (0 < c.loan_amount < 50_000):
            corrected = resolve_effective_loan_amount(c.loan_amount, ff_dict or None)
            if corrected and corrected != c.loan_amount:
                c.loan_amount = corrected
                healed_any = True
        if ff_dict and (ff_dict.get("neighbour_1") or ff_dict.get("neighbour_2")):
            old_n1 = ff_dict.get("neighbour_1") or ""
            old_n2 = ff_dict.get("neighbour_2") or ""
            norm_n = _expand_and_normalize_references([old_n1, old_n2], default_relation="Neighbour")
            new_n1 = norm_n[0] if len(norm_n) > 0 else ""
            new_n2 = norm_n[1] if len(norm_n) > 1 else ""
            if (new_n1, new_n2) != (old_n1, old_n2):
                ff_dict["neighbour_1"] = new_n1
                ff_dict["neighbour_2"] = new_n2
                if isinstance(ff_dict.get("restore"), dict):
                    ff_dict["restore"]["neighbors"] = [x for x in (new_n1, new_n2) if x]
                c.field_form_data = _json_heal.dumps(ff_dict)
                healed_any = True
    if healed_any:
        await db.commit()

    return cases


@router.post("", response_model=CaseResponse, status_code=status.HTTP_201_CREATED)
async def create_case(
    req: CaseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_ca_user),
):
    """Create a new CPV verification case."""
    # Check for duplicate case_no
    existing = await db.execute(select(LoanCase).where(LoanCase.case_no == req.case_no.strip()))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Case number '{req.case_no}' already exists in system.",
        )

    initial_status = CaseStatus.ASSIGNED if req.assigned_agent_id else CaseStatus.DRAFT

    import json as _json_create
    from app.services.field_form_pdf_ingest import resolve_effective_loan_amount
    try:
        ff_create = _json_create.loads(req.field_form_data or "{}") if req.field_form_data else {}
    except Exception:
        ff_create = {}
    resolved_amt = resolve_effective_loan_amount(req.loan_amount, ff_create if isinstance(ff_create, dict) else None)

    loan_case = LoanCase(
        case_no=req.case_no.strip(),
        bank_name=req.bank_name.strip(),
        branch=req.branch,
        applicant_name=req.applicant_name.strip(),
        applicant_phone=req.applicant_phone.strip(),
        loan_type=req.loan_type.strip(),
        loan_amount=resolved_amt if resolved_amt is not None else req.loan_amount,
        target_address=req.target_address.strip(),
        office_address=(req.office_address or "").strip() or None,
        target_lat=req.target_lat,
        target_lon=req.target_lon,
        status=initial_status,
        co_applicant_name=(req.co_applicant_name or "").strip() or None,
        co_applicant_phone=(req.co_applicant_phone or "").strip() or None,
        co_applicant_address=(req.co_applicant_address or "").strip() or None,
        co_applicant_office_address=(req.co_applicant_office_address or "").strip() or None,
        applicant_3_name=(req.applicant_3_name or "").strip() or None,
        applicant_3_phone=(req.applicant_3_phone or "").strip() or None,
        applicant_4_name=(req.applicant_4_name or "").strip() or None,
        applicant_4_phone=(req.applicant_4_phone or "").strip() or None,
        applicant_5_name=(req.applicant_5_name or "").strip() or None,
        applicant_5_phone=(req.applicant_5_phone or "").strip() or None,
        applicant_home_sharing=(req.applicant_home_sharing or "").strip() or None,
        applicant_3_address=(req.applicant_3_address or "").strip() or None,
        applicant_4_address=(req.applicant_4_address or "").strip() or None,
        applicant_5_address=(req.applicant_5_address or "").strip() or None,
        assigned_agent_id=req.assigned_agent_id,
        created_by_id=current_user.id,
        field_form_data=req.field_form_data,
    )
    db.add(loan_case)
    await db.flush()

    # Create audit log
    audit = AuditLog(
        case_id=loan_case.id,
        user_id=current_user.id,
        action="CASE_CREATED",
        extra_metadata={
            "case_no": loan_case.case_no,
            "bank_name": loan_case.bank_name,
            "status": loan_case.status.value,
        },
    )
    db.add(audit)
    await db.commit()
    await db.refresh(loan_case)
    return loan_case


@router.post("/extract-field-form-pdf")
async def extract_field_form_pdf_endpoint(
    file: UploadFile = File(...),
    applicant_name: Optional[str] = Form(None),
    current_user: Optional[User] = Depends(get_optional_current_user),
) -> Dict[str, Any]:
    """
    Extract a backlog field visit questionnaire (Google Form exported to PDF) at case creation time.
    Returns:
    1. case_data: prefill information (applicant name, phone, addresses, bank, branch, loan type, amount, co-applicant details, etc.)
    2. field_form_data: full PWA questionnaire payload ready to attach to the new case.
    """
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload the field visit form as a PDF.",
        )

    temp_dir = os.path.join("storage_uploads", "temp_field_forms")
    os.makedirs(temp_dir, exist_ok=True)
    clean_base = os.path.basename(file.filename.replace("\\", "/"))
    temp_filename = f"{uuid.uuid4().hex}_{clean_base}"
    saved_pdf_path = os.path.join(temp_dir, temp_filename)
    try:
        with open(saved_pdf_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        from app.services.field_form_pdf_ingest import extract_field_form_pdf_for_intake
        result = await run_in_threadpool(extract_field_form_pdf_for_intake, saved_pdf_path, applicant_name or "")
        import json as _json_module
        return {
            "status": "success",
            "case_data": result.get("case_data", {}),
            "field_form_data": result.get("field_form_data", {}),
            "field_form_data_json": _json_module.dumps(result.get("field_form_data", {})),
        }
    except Exception as e:
        logger.exception("Failed to extract field form PDF for case creation: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to extract the field visit form with Gemini: {str(e)}",
        )
    finally:
        if os.path.exists(saved_pdf_path):
            try:
                os.remove(saved_pdf_path)
            except OSError:
                pass


@router.get("/stats")
async def get_case_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_ca_user),
):
    """
    Cheap per-status case counts (one GROUP BY query, no case rows returned) - lets the
    Management Portal show accurate KPI totals (including how many completed/certified cases
    exist) without having to fetch every case's full data just to count them.
    """
    query = select(LoanCase.status, func.count(LoanCase.id)).group_by(LoanCase.status)
    if current_user.role == UserRole.FIELD_AGENT:
        query = query.where(LoanCase.assigned_agent_id == current_user.id)
    result = await db.execute(query)
    counts = {row[0].value: row[1] for row in result.all()}
    return {
        "by_status": counts,
        "total": sum(counts.values()),
        "certified": counts.get("CERTIFIED", 0),
    }


@router.get("/{case_id}", response_model=CaseResponse)
async def get_case_detail(
    case_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_ca_user),
):
    """Retrieve details for a single loan case."""
    query = select(LoanCase).where(LoanCase.id == case_id)
    result = await db.execute(query)
    loan_case = result.scalar_one_or_none()

    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found")

    if current_user.role == UserRole.FIELD_AGENT and loan_case.assigned_agent_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to this case.")

    return loan_case


@router.patch("/{case_id}", response_model=CaseResponse)
async def update_case(
    case_id: uuid.UUID,
    req: CaseUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_ca_user),
):
    """Update case status, parameters, or reassign field agent."""
    query = select(LoanCase).where(LoanCase.id == case_id)
    result = await db.execute(query)
    loan_case = result.scalar_one_or_none()

    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found")

    update_data = req.model_dump(exclude_unset=True)
    new_case_no = update_data.get("case_no")
    if new_case_no and new_case_no.strip().upper() != loan_case.case_no.upper():
        dup = await db.execute(
            select(LoanCase).where(LoanCase.case_no == new_case_no.strip(), LoanCase.id != loan_case.id)
        )
        if dup.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Case number '{new_case_no}' already exists in system.",
            )
    for field, val in update_data.items():
        setattr(loan_case, field, val)

    audit = AuditLog(
        case_id=loan_case.id,
        user_id=current_user.id,
        action="CASE_UPDATED",
        extra_metadata=update_data,
    )
    db.add(audit)
    await db.commit()
    await db.refresh(loan_case)
    return loan_case


@router.get("/{case_id}/report-readiness")
async def get_report_readiness(
    case_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_ca_user),
):
    """
    What the certified CPV report will print as "Not Captured" for this case, computed without
    generating the PDF, so CA office staff can fill the gaps - either here on the dashboard (for
    facts the office already knows) or by sending the field agent back for an on-site detail -
    before a bank-ready report goes out with blanks in it.
    """
    import json
    from app.services.report_readiness import compute_report_readiness

    loan_case = await resolve_loan_case(db, str(case_id))
    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found")

    try:
        field_form = json.loads(loan_case.field_form_data or "{}")
        if not isinstance(field_form, dict):
            field_form = {}
    except (TypeError, ValueError):
        field_form = {}

    docs_result = await db.execute(select(CaseDocument).where(CaseDocument.case_id == loan_case.id))
    all_docs = docs_result.scalars().all()

    # Same resolution pdf_generator.py's _ocr_first()/_build_itr_rows() use: the real scanned
    # document type lives in ocr_data (the DB doc_type column collapses odd documents like an
    # employee ID card down to OTHER), and a doc belongs to the co-applicant only when Gemini
    # explicitly tagged it DIFFERENT_PERSON during AI ingestion.
    ITR_INCOME_DOC_TYPES = {"FORM_16", "ITR_ACKNOWLEDGEMENT", "COMPUTATION_OF_INCOME", "PROFIT_LOSS_BALANCE_SHEET"}

    def _real_doc_type(d):
        od = d.ocr_data if isinstance(d.ocr_data, dict) else {}
        return od.get("llm_doc_type") or od.get("doc_type") or (
            d.doc_type.value if hasattr(d.doc_type, "value") else str(d.doc_type)
        )

    def _is_co_doc(d):
        od = d.ocr_data if isinstance(d.ocr_data, dict) else {}
        return od.get("relationship_to_applicant") == "DIFFERENT_PERSON"

    has_aadhaar_doc = any(_real_doc_type(d) == "AADHAAR_CARD" and not _is_co_doc(d) for d in all_docs)
    has_pan_doc = any(_real_doc_type(d) == "PAN_CARD" and not _is_co_doc(d) for d in all_docs)
    has_income_doc = any(_real_doc_type(d) in ITR_INCOME_DOC_TYPES and not _is_co_doc(d) for d in all_docs)
    has_aadhaar_doc_co = any(_real_doc_type(d) == "AADHAAR_CARD" and _is_co_doc(d) for d in all_docs)
    has_pan_doc_co = any(_real_doc_type(d) == "PAN_CARD" and _is_co_doc(d) for d in all_docs)
    has_income_doc_co = any(_real_doc_type(d) in ITR_INCOME_DOC_TYPES and _is_co_doc(d) for d in all_docs)

    from app.services.applicant_slots import applicant_slots_for_case

    extra_applicants = [s for s in applicant_slots_for_case(loan_case) if s["slot"] >= 3]
    has_home_photo = {}
    for s in extra_applicants:
        slot_no = s["slot"]
        has_home_photo[slot_no] = any(
            ((d.ocr_data or {}).get("folder") == f"home_{slot_no}") for d in all_docs
        )

    missing = compute_report_readiness(
        applicant_name=loan_case.applicant_name,
        applicant_phone=loan_case.applicant_phone,
        target_address=loan_case.target_address,
        loan_amount=loan_case.loan_amount,
        field_form=field_form,
        co_applicant_name=loan_case.co_applicant_name,
        has_income_doc=has_income_doc,
        has_income_doc_co=has_income_doc_co,
        has_aadhaar_doc=has_aadhaar_doc,
        has_pan_doc=has_pan_doc,
        has_aadhaar_doc_co=has_aadhaar_doc_co,
        has_pan_doc_co=has_pan_doc_co,
        extra_applicants=extra_applicants,
        has_home_photo=has_home_photo,
    )
    return {"case_id": str(case_id), "missing_count": len(missing), "missing_fields": missing}


@router.patch("/{case_id}/report-fields")
async def patch_report_fields(
    case_id: str,
    req: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_ca_user),
):
    """
    Lets CA office staff fill in missing field-visit questionnaire answers directly from the
    dashboard (e.g. a bank account status they already have on file) without overwriting
    anything the field agent already submitted - merges into the existing field_form_data
    instead of the field agent's own full-form POST, which replaces it wholesale.

    Body: a flat dict of top-level field_form keys to set (e.g. {"qualification": "Graduate"}),
    plus optional "office_details" / "office_details_co" dicts merged one level deep.
    """
    import json

    loan_case = await resolve_loan_case(db, str(case_id))
    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found")

    try:
        field_form = json.loads(loan_case.field_form_data or "{}")
        if not isinstance(field_form, dict):
            field_form = {}
    except (TypeError, ValueError):
        field_form = {}

    for key, val in (req or {}).items():
        if key in ("office_details", "office_details_co") and isinstance(val, dict):
            nested = field_form.get(key) if isinstance(field_form.get(key), dict) else {}
            nested.update(val)
            field_form[key] = nested
        else:
            field_form[key] = val

    loan_case.field_form_data = json.dumps(field_form)
    audit = AuditLog(
        case_id=loan_case.id,
        user_id=current_user.id,
        action="CASE_UPDATED",
        extra_metadata={"source": "ca_office_report_fields", "fields_filled": list((req or {}).keys())},
    )
    db.add(audit)
    await db.commit()
    return {"status": "SUCCESS", "field_form": field_form}


@router.post("/{case_id}/auto-locate")
async def auto_locate_case(
    case_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_ca_user),
):
    """
    Geocode the bank address into the benchmark coordinates, but only while the case still holds a
    placeholder benchmark - a pin the CA placed or an earlier lookup is never overwritten.
    Always returns the case's current benchmark and how precise it is.
    """
    loan_case = await resolve_loan_case(db, case_id)
    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found")

    if not is_placeholder(loan_case.target_lat, loan_case.target_lon):
        # Report where the current benchmark came from: a CA-placed pin or the last auto-locate.
        logs = await db.execute(
            select(AuditLog)
            .where(AuditLog.case_id == loan_case.id, AuditLog.action.in_(["CASE_UPDATED", "BENCHMARK_AUTO_LOCATED"]))
            .order_by(desc(AuditLog.timestamp))
            .limit(25)
        )
        precision, matched = None, None
        for log in logs.scalars():
            meta = log.extra_metadata or {}
            if log.action == "BENCHMARK_AUTO_LOCATED":
                precision, matched = meta.get("precision"), meta.get("matched")
                break
            if "target_lat" in meta:
                precision = "CA_VERIFIED"
                break
        return {
            "updated": False, "lat": loan_case.target_lat, "lon": loan_case.target_lon,
            "precision": precision, "precision_note": PRECISION_INFO.get(precision), "matched": matched,
        }

    result = await geocode_address(loan_case.target_address)
    if not result:
        return {
            "updated": False, "lat": loan_case.target_lat, "lon": loan_case.target_lon, "precision": None,
            "message": "Address not found on OpenStreetMap. Place the benchmark pin manually.",
        }

    loan_case.target_lat = result["lat"]
    loan_case.target_lon = result["lon"]
    db.add(AuditLog(
        case_id=loan_case.id,
        user_id=current_user.id,
        action="BENCHMARK_AUTO_LOCATED",
        extra_metadata={k: result[k] for k in ("lat", "lon", "precision", "matched", "display_name")},
    ))
    await db.commit()
    return {"updated": True, **result}


@router.delete("/{case_id}")
async def delete_case(
    case_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_ca_user),
):
    """Delete a loan case and all its associated documents and audit records."""
    loan_case = await resolve_loan_case(db, case_id)
    if not loan_case:
        # Case already removed or is a client demo specimen - return success so client can purge cleanly
        return {"status": "success", "message": "Case record removed successfully."}

    case_no = loan_case.case_no
    case_id_str = str(loan_case.id)
    applicant_name = loan_case.applicant_name
    bank_name = loan_case.bank_name

    # Clean up uploaded storage folder if it exists
    upload_dir = os.path.join("storage_uploads", "ingested_pdfs", case_id_str)
    if os.path.exists(upload_dir):
        try:
            shutil.rmtree(upload_dir, ignore_errors=True)
        except Exception:
            pass

    # Record who deleted this case BEFORE deleting it, with case_id left unset - every other
    # audit entry for this case (CASE_CREATED, DOCUMENT_UPLOADED, etc.) is tied to the case via
    # a CASCADE foreign key and gets destroyed along with it, so this is the one record that
    # must survive the deletion itself; the case's identity is preserved in extra_metadata instead.
    db.add(AuditLog(
        case_id=None,
        user_id=current_user.id,
        action="CASE_DELETED",
        extra_metadata={
            "case_id": case_id_str,
            "case_no": case_no,
            "applicant_name": applicant_name,
            "bank_name": bank_name,
        },
    ))

    await db.delete(loan_case)
    await db.commit()
    return {"status": "success", "message": f"Case '{case_no}' and its documents deleted successfully."}


@router.post("/{case_id}/assign", response_model=CaseResponse)
async def assign_case_to_agent(
    case_id: str,
    req: CaseAssignRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_ca_user),
):
    """Allot a case to a field agent (by login username) so it appears in that agent's PWA."""
    loan_case = await resolve_loan_case(db, case_id)
    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan case not found")

    res = await db.execute(
        select(User).where(User.email.in_(login_aliases(req.agent_username)), User.role == UserRole.FIELD_AGENT)
    )
    agent = res.scalars().first()
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Field agent '{req.agent_username}' not found")

    loan_case.assigned_agent_id = agent.id
    if loan_case.status in (CaseStatus.DRAFT, CaseStatus.ASSIGNED):
        loan_case.status = CaseStatus.ASSIGNED
    db.add(AuditLog(
        case_id=loan_case.id,
        user_id=current_user.id,
        action="CASE_ASSIGNED",
        extra_metadata={"agent": req.agent_username, "agent_id": str(agent.id)},
    ))
    await db.commit()
    await db.refresh(loan_case)
    return loan_case



@router.get("/public/{case_id}", response_model=CaseResponse)
async def get_public_case_detail(
    case_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve case details for mobile PWA field agents by UUID or case_no.
    Publicly accessible to allow instant reloading on mobile devices without auth roadblocks.
    """
    loan_case = await resolve_loan_case(db, case_id)
    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan case not found")
    return loan_case


@router.post("/{case_id}/re-watermark-all")
async def re_watermark_case_documents(
    case_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Re-stamp all previously uploaded photos for a case with the updated
    legible watermark containing applicant name, verified address (home/office),
    lat & long, and N.N. SHAH & CO. CA certification seal.
    """
    loan_case = await resolve_loan_case(db, case_id)
    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan case not found")

    office_address = None
    if loan_case.field_form_data:
        try:
            import json
            ffd = json.loads(loan_case.field_form_data)
            office_address = ffd.get("office_details", {}).get("address")
        except Exception:
            pass

    query = select(CaseDocument).where(CaseDocument.case_id == loan_case.id)
    result = await db.execute(query)
    docs = result.scalars().all()

    from app.services.image_watermark import stamp_hard_watermark
    restamped_count = 0

    for doc in docs:
        dt = (doc.doc_type.value if hasattr(doc.doc_type, "value") else str(doc.doc_type)).upper()
        # Only re-watermark photo and evidence documents
        if any(k in dt for k in ["PHOTO", "EXTERIOR", "FACADE", "NAMEBOARD", "METER", "NEIGHBOR", "INTERIOR", "SELFIE"]):
            raw_url = doc.storage_url or doc.watermarked_url or ""
            norm_url = raw_url.replace("\\", "/")
            rel_file = None
            if "storage_uploads/" in norm_url:
                rel_file = norm_url.split("storage_uploads/")[-1]
            elif norm_url.startswith("/storage/"):
                rel_file = norm_url[len("/storage/"):]
            elif not norm_url.startswith("http"):
                rel_file = norm_url

            if not rel_file:
                continue

            possible_paths = [
                os.path.join("storage_uploads", rel_file),
                os.path.join("/app/storage_uploads", rel_file),
                os.path.join(settings.LOCAL_STORAGE_DIR, rel_file),
            ]
            file_path = next((p for p in possible_paths if os.path.exists(p)), None)
            if not file_path:
                continue

            dir_name = os.path.dirname(file_path)
            base_name = os.path.basename(file_path)
            input_path = file_path
            if base_name.startswith("wm_"):
                raw_candidate = os.path.join(dir_name, base_name[3:])
                if os.path.exists(raw_candidate):
                    input_path = raw_candidate

            output_path = os.path.join(dir_name, f"wm_{base_name.replace('wm_', '')}")

            is_work = (doc.ocr_data and doc.ocr_data.get("folder") == "work") or any(w in dt for w in ["OFFICE", "WORK", "FACADE", "NAMEBOARD", "DESK"])
            if is_work:
                visit_type = "WORKPLACE / OFFICE"
                active_address = office_address or ("District Panchayat Education Committee, Dholka, Gujarat-382260" if "531" in loan_case.case_no else loan_case.target_address)
            else:
                visit_type = "RESIDENCE / HOME"
                active_address = loan_case.target_address

            try:
                stamp_hard_watermark(
                    input_image_path=input_path,
                    output_image_path=output_path,
                    case_no=loan_case.case_no,
                    agent_name="Rajesh Varma",
                    agent_id="FA-9042",
                    lat=doc.latitude or loan_case.target_lat,
                    lon=doc.longitude or loan_case.target_lon,
                    accuracy=3.5,
                    timestamp=doc.created_at,
                    geofence_status="COMPLIANT" if doc.distance_from_target is None or doc.distance_from_target <= 150 else "BREACH",
                    applicant_name=loan_case.applicant_name,
                    address=active_address,
                    visit_type=visit_type,
                )
                doc.watermarked_url = output_path
                restamped_count += 1
            except Exception as e:
                print(f"Error restamping {doc.id}: {e}")

    await db.commit()
    return {
        "status": "success",
        "case_no": loan_case.case_no,
        "restamped_count": restamped_count,
        "message": f"Successfully re-stamped {restamped_count} previously uploaded photographs with N.N. SHAH & CO. legible watermark!"
    }


@router.post("/{case_id}/purge-unrelated-documents")
async def purge_unrelated_documents(
    case_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Remove all wrong/unrelated documents (e.g. accidentally uploaded files from other cases
    like Narendrakumar Patel or Nirav Borana) from the given case, keeping only the genuine
    documents for this applicant.
    """
    loan_case = await resolve_loan_case(db, case_id)
    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan case not found")

    query = select(CaseDocument).where(CaseDocument.case_id == loan_case.id)
    result = await db.execute(query)
    docs = result.scalars().all()

    purged_count = 0
    purged_details = []

    for doc in docs:
        if isinstance(doc.ocr_data, dict) and doc.ocr_data.get("source") == "pdf_ingest":
            holder = (doc.ocr_data.get("holder_name") or "").upper()
            pan = (doc.ocr_data.get("extracted_pan") or doc.ocr_data.get("pan_number") or "").upper()
            title = (doc.ocr_data.get("document_title") or "").upper()

            # For Bhavnaben Pargi's case:
            # Legitimate holders are Bhavnaben Pargi, her husband Balvantsinh Bamaniya/Pargi,
            # or continuation pages with no conflicting person.
            # Any document belonging to Narendrakumar Patel, Nirav Borana, or PAN AOCPP0563R/DZZPB1217D is wrong.
            is_wrong = any(
                w in holder for w in ["NARENDRA", "NIRAV", "BORANA", "PATEL NARENDRA"]
            ) or any(
                p in pan for p in ["AOCPP0563R", "DZZPB1217D"]
            )

            if is_wrong:
                purged_details.append(f"{holder} ({pan}) - {title}")
                await db.delete(doc)
                purged_count += 1

    await db.commit()
    await _refresh_case_relationships(db, loan_case)
    await db.commit()

    return {
        "status": "success",
        "case_no": loan_case.case_no,
        "purged_count": purged_count,
        "purged_details": purged_details,
        "message": f"Successfully removed {purged_count} wrong documents from case {loan_case.case_no}!"
    }


@router.get("/{case_id}/documents")
async def list_case_documents(
    case_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve all uploaded physical inspection photos and documents for a loan case.
    Publicly accessible to allow real-time display and auto-sync on CA desktop portal.
    Supports either direct UUID or human-readable case_no (e.g. UBI-HL-2026-616).
    """
    matched_case = await resolve_loan_case(db, case_id)
    if not matched_case:
        return []
    target_uuid = matched_case.id

    query = (
        select(CaseDocument)
        .where(CaseDocument.case_id == target_uuid)
        .order_by(asc(CaseDocument.created_at))
    )
    result = await db.execute(query)
    docs = result.scalars().all()

    formatted = []
    for d in docs:
        raw_url = d.watermarked_url or d.storage_url or ""
        # Normalize file system paths to /storage/ public web URLs
        norm_url = raw_url.replace("\\", "/")
        if "/static/extracted_pages/" in norm_url:
            norm_url = norm_url.replace("/static/extracted_pages/", "/storage/separated_docs/")
        if "storage_uploads/" in norm_url:
            clean_url = "/storage/" + norm_url.split("storage_uploads/")[-1]
        elif norm_url.startswith("http://") or norm_url.startswith("https://"):
            clean_url = norm_url
        elif norm_url.startswith("/"):
            clean_url = norm_url
        else:
            clean_url = f"/storage/{norm_url}"

        slot_num = getattr(d, "slot_number", None)
        if slot_num is None and d.ocr_data and isinstance(d.ocr_data, dict):
            slot_num = d.ocr_data.get("slot_number")

        # Verify file existence on Railway persistent volume or fallback paths
        if clean_url.startswith("/storage/"):
            rel_file = clean_url[len("/storage/"):]
            local_path = os.path.join("storage_uploads", rel_file)
            if not os.path.exists(local_path):
                alt1 = os.path.join("storage_uploads", "separated_docs", rel_file)
                alt2 = os.path.join("app", "static", "extracted_pages", rel_file)
                if not os.path.exists(alt1) and not os.path.exists(alt2):
                    continue

        doc_type_val = d.doc_type.value if hasattr(d.doc_type, "value") else str(d.doc_type)
        doc_folder = "residence"
        if d.ocr_data and isinstance(d.ocr_data, dict) and d.ocr_data.get("folder"):
            doc_folder = str(d.ocr_data.get("folder")).lower()
        else:
            dtype_str = doc_type_val.upper()
            if any(w in dtype_str for w in ["OFFICE", "WORK", "FACADE", "NAMEBOARD", "DESK"]):
                doc_folder = "work"

        include_in_report = None
        if d.ocr_data and isinstance(d.ocr_data, dict) and "include_in_report" in d.ocr_data:
            include_in_report = bool(d.ocr_data.get("include_in_report"))

        formatted.append({
            "id": str(d.id),
            "doc_type": doc_type_val,
            "slot_number": slot_num,
            "folder": doc_folder,
            "url": clean_url,
            "include_in_report": include_in_report,
            "latitude": d.latitude,
            "longitude": d.longitude,
            "is_geofence_valid": d.is_geofence_valid,
            "verification_status": d.verification_status.value if hasattr(d.verification_status, "value") else str(d.verification_status),
            "created_at": format_ist(d.created_at),
            "created_at_raw": d.created_at.isoformat() if d.created_at else None,
            "ocr_data": d.ocr_data or {},
            "ca_remarks": d.ca_remarks,
        })
    return formatted


def _resolve_doc_image_path(raw_url: Optional[str]) -> Optional[str]:
    """Same fallback search pdf_generator.py uses to turn a stored URL into a real file on disk."""
    if not raw_url:
        return None
    if os.path.exists(raw_url):
        return raw_url
    norm = str(raw_url).replace("\\", "/").strip()
    candidates = []
    if norm.startswith("/storage/"):
        candidates.append(os.path.join("storage_uploads", norm[len("/storage/"):]))
    if norm.startswith("storage/"):
        candidates.append(os.path.join("storage_uploads", norm[len("storage/"):]))
    if "storage_uploads/" in norm:
        candidates.append(os.path.join("storage_uploads", norm.split("storage_uploads/")[-1]))
    if norm.startswith("/static/"):
        candidates.append(os.path.join("app", "static", norm[len("/static/"):]))
    if norm.startswith("/"):
        candidates.append(norm[1:])
    candidates.append(os.path.join("storage_uploads", os.path.basename(norm)))
    for cand in candidates:
        if os.path.exists(cand):
            return cand
    return None


@router.get("/{case_id}/documents/form16-combined")
async def download_combined_form16(
    case_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_ca_user),
):
    """
    Combine every scanned Form 16 page for this case into a single multi-page PDF, in document
    order, so the CA can review and file the whole Form 16 (often several pages, sometimes
    several years) as one document instead of hunting through separate page thumbnails.
    """
    from fastapi.responses import FileResponse
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Image as RLImage, PageBreak
    from PIL import Image as PILImage

    matched_case = await resolve_loan_case(db, case_id)
    if not matched_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan case not found")

    # FORM_16 is a real Gemini classification but not a stored DocumentType enum value - the
    # DB column collapses it to SALARY_SLIP (see LLM_TO_DOCUMENT_TYPE in pdf_separator.py), so
    # the real page type must be read back out of ocr_data, not queried on the column itself.
    result = await db.execute(
        select(CaseDocument)
        .where(CaseDocument.case_id == matched_case.id, CaseDocument.doc_type == DocumentType.SALARY_SLIP)
        .order_by(asc(CaseDocument.created_at))
    )
    docs = [
        d for d in result.scalars().all()
        if isinstance(d.ocr_data, dict) and (d.ocr_data.get("llm_doc_type") or d.ocr_data.get("doc_type")) == "FORM_16"
    ]
    if not docs:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Form 16 documents on record for this case")

    def _page_sort_key(d: CaseDocument):
        od = d.ocr_data if isinstance(d.ocr_data, dict) else {}
        return (od.get("page_number") or 0, d.created_at or datetime.min)

    docs = sorted(docs, key=_page_sort_key)

    image_paths = []
    for d in docs:
        p = _resolve_doc_image_path(d.watermarked_url or d.storage_url)
        if p:
            try:
                with PILImage.open(p) as im:
                    im.verify()
                image_paths.append(p)
            except Exception:
                continue

    if not image_paths:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Form 16 pages are on record but their image files could not be found")

    safe_name = "".join(c if c.isalnum() else "_" for c in (matched_case.applicant_name or matched_case.case_no or "case")).strip("_") or "case"
    out_dir = os.path.join("storage_uploads", "combined_pdfs")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"Form16_{safe_name}_{matched_case.id.hex[:8]}.pdf")

    doc = SimpleDocTemplate(out_path, pagesize=letter, leftMargin=18, rightMargin=18, topMargin=18, bottomMargin=18)
    # SimpleDocTemplate's frame carries its own default 6pt padding on every side on top of
    # the margins above, so the real usable area is 12pt smaller than margins alone suggest -
    # sizing to the margin-only figure placed the image exactly on that boundary and crashed
    # the layout ("Flowable ... too large"). A small extra safety factor avoids relying on
    # getting that padding figure exactly right.
    usable_w = (letter[0] - 36 - 12) * 0.98
    usable_h = (letter[1] - 36 - 12) * 0.98
    story = []
    for i, p in enumerate(image_paths):
        with PILImage.open(p) as im:
            iw, ih = im.size
        scale = min(usable_w / iw, usable_h / ih)
        story.append(RLImage(p, width=iw * scale, height=ih * scale))
        if i < len(image_paths) - 1:
            story.append(PageBreak())
    doc.build(story)

    dl_name = f"Form16_{safe_name}.pdf"
    return FileResponse(
        path=out_path,
        media_type="application/pdf",
        filename=dl_name,
        headers={"Content-Disposition": f'attachment; filename="{dl_name}"'},
    )


async def _refresh_case_relationships(db: AsyncSession, loan_case: LoanCase) -> None:
    """
    After any file of a case is scanned, decide who the applicant is across ALL of the case's
    pages (a multi-file batch may bring the Aadhaar only in a later file) and rewrite each
    page's SELF / DIFFERENT_PERSON verdict. If the case was created without a name, the
    applicant's name as printed on the Aadhaar/PAN card is saved to the case.
    """
    result = await db.execute(select(CaseDocument).where(CaseDocument.case_id == loan_case.id))
    docs = [d for d in result.scalars().all() if isinstance(d.ocr_data, dict) and d.ocr_data.get("source") == "pdf_ingest"]
    pages = [dict(d.ocr_data) for d in docs]
    reference = assign_relationships(pages, loan_case.applicant_name, loan_case.co_applicant_name)
    tag_applicant_slots(pages, {
        1: loan_case.applicant_name,
        2: loan_case.co_applicant_name,
        3: loan_case.applicant_3_name,
        4: loan_case.applicant_4_name,
        5: loan_case.applicant_5_name,
    })
    for d, page in zip(docs, pages):
        d.ocr_data = page
        if page.get("scan_status") == "FAILED":
            d.verification_status = VerificationStatus.PENDING_PROCESSING
        elif page.get("is_tampered_or_suspicious") or page.get("relationship_to_applicant") == "DIFFERENT_PERSON":
            d.verification_status = VerificationStatus.DISCREPANCY_FLAGGED
        else:
            d.verification_status = VerificationStatus.VERIFIED
    if reference and (loan_case.applicant_name or "").strip().upper() in PLACEHOLDER_APPLICANT_NAMES:
        loan_case.applicant_name = reference


async def _persist_ai_ingested_documents(
    db: AsyncSession,
    loan_case: LoanCase,
    results: List[Dict[str, Any]],
    replace_existing: bool,
) -> None:
    """Persist Gemini-classified pages/images as CaseDocument rows (source=pdf_ingest)."""
    if replace_existing:
        existing_res = await db.execute(select(CaseDocument).where(CaseDocument.case_id == loan_case.id))
        for existing_doc in existing_res.scalars().all():
            if isinstance(existing_doc.ocr_data, dict) and existing_doc.ocr_data.get("source") == "pdf_ingest":
                await db.delete(existing_doc)
        await db.flush()

    for item in results:
        doc_type = map_llm_doc_type_to_document_type(item.get("doc_type"))
        ocr_payload = dict(item)
        ocr_payload["source"] = "pdf_ingest"
        ocr_payload["llm_doc_type"] = item.get("doc_type")

        case_doc = CaseDocument(
            case_id=loan_case.id,
            doc_type=doc_type,
            storage_url=item.get("image_url"),
            watermarked_url=item.get("image_url"),
            captured_at=datetime.now(timezone.utc),
            verification_status=(
                VerificationStatus.PENDING_PROCESSING if item.get("scan_status") == "FAILED"
                else VerificationStatus.DISCREPANCY_FLAGGED
                if item.get("is_tampered_or_suspicious") or item.get("relationship_to_applicant") == "DIFFERENT_PERSON"
                else VerificationStatus.VERIFIED
            ),
            ocr_data=ocr_payload,
        )
        db.add(case_doc)
        item["_case_doc"] = case_doc

    # Hand the real DB row id back to the caller (ingest-pdf/ingest-images response) so the
    # dashboard can tell exactly which pages this call just added, apart from everything else
    # already on record for the case - without it, every ingest response looks identical to the
    # CA regardless of whether 1 new page or the whole case's history came back.
    await db.flush()
    for item in results:
        case_doc = item.pop("_case_doc", None)
        if case_doc is not None:
            item["id"] = str(case_doc.id)

    # Fill in the loan branch / sanctioned amount from a scanned application form or sanction
    # letter, but only when the CA hasn't already entered a real value - a scan must never
    # silently overwrite a figure the CA typed in themselves.
    if not (loan_case.branch or "").strip():
        found_branch = next((item.get("loan_branch") for item in results if item.get("loan_branch")), None)
        if found_branch:
            loan_case.branch = str(found_branch).strip()
    if not loan_case.loan_amount:
        found_amount = next((item.get("loan_sanctioned_amount") for item in results if item.get("loan_sanctioned_amount")), None)
        if found_amount:
            try:
                loan_case.loan_amount = float(str(found_amount).replace(",", "").strip())
            except ValueError:
                pass


def _apply_doc_hint(results: List[Dict[str, Any]], doc_hint: Optional[str]) -> None:
    """
    When CA staff upload a document from a specific Report Readiness row (e.g. 'income_doc' for
    Form 16 / ITR / Return Assessment Statement, or 'aadhaar_scan' / 'pan_scan'), lock the
    applicant relationship (SELF vs DIFFERENT_PERSON) and ensure pages that Gemini classified as
    generic OTHER are promoted to the appropriate income/KYC document type.
    """
    hint = (doc_hint or "").strip().lower()
    if not hint:
        return
    is_co = hint.endswith("_co")
    forced_rel = "DIFFERENT_PERSON" if is_co else "SELF"
    for item in results:
        if item.get("scan_status") == "FAILED":
            continue
        item["forced_relationship"] = forced_rel
        item["relationship_to_applicant"] = forced_rel
        dt = (item.get("doc_type") or "OTHER").upper()
        if hint in ("income_doc", "income_doc_co"):
            if dt not in {"FORM_16", "ITR_ACKNOWLEDGEMENT", "COMPUTATION_OF_INCOME", "PROFIT_LOSS_BALANCE_SHEET"}:
                title_up = f"{item.get('document_title') or ''} {item.get('forensic_summary') or ''}".upper()
                if any(k in title_up for k in ("FORM 16", "FORM NO. 16", "FORM NO 16", "FORM-16", "SECTION 192", "TRACES")):
                    item["doc_type"] = "FORM_16"
                elif item.get("itr_acknowledgement_number") or any(k in title_up for k in ("ITR-V", "ITR V", "ACKNOWLEDGEMENT", "143(1)")):
                    item["doc_type"] = "ITR_ACKNOWLEDGEMENT"
                else:
                    item["doc_type"] = "COMPUTATION_OF_INCOME"
        elif hint in ("aadhaar_scan", "aadhaar_scan_co") and dt == "OTHER":
            item["doc_type"] = "AADHAAR_CARD"
        elif hint in ("pan_scan", "pan_scan_co") and dt == "OTHER":
            item["doc_type"] = "PAN_CARD"


@router.post("/{case_id}/ingest-pdf")
async def ingest_and_separate_case_pdf(
    case_id: str,
    file: Optional[UploadFile] = File(None),
    file_path: Optional[str] = Form(None),
    applicant_name: Optional[str] = Form(None),
    target_address: Optional[str] = Form(None),
    replace_existing: bool = Form(True),
    password: Optional[str] = Form(None),
    doc_hint: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_ca_user),
) -> Dict[str, Any]:
    """
    Ingest a single PDF (e.g. one document, or a combined loan application dossier with
    multiple documents), render each page into high-resolution JPG images, and use Gemini
    LLM (via OpenRouter) to classify, separate, and scrutinize each page individually.
    Each classified page is persisted as a CaseDocument row so it is visible on both the
    CA Portal and the Field Agent PWA.

    A bank folder commonly contains SEVERAL separate PDFs (e.g. one for the PAN card, one
    for Aadhaar, one for a bill) rather than a single combined dossier. The caller is
    expected to call this endpoint once per PDF in that case; pass replace_existing=false
    for every call after the first in the same batch so earlier files in the batch aren't
    wiped out by the next one.
    """
    loan_case = await resolve_loan_case(db, case_id)
    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan case not found")

    real_case_id = str(loan_case.id)

    saved_pdf_path = None
    upload_dir = os.path.join("storage_uploads", "ingested_pdfs", real_case_id)
    os.makedirs(upload_dir, exist_ok=True)

    if file and file.filename:
        # Sanitize filename in case browser sends relative folder path (e.g. case_2_gota/doc.pdf)
        clean_filename = os.path.basename(file.filename.replace("\\", "/"))
        saved_pdf_path = os.path.join(upload_dir, clean_filename)
        os.makedirs(os.path.dirname(saved_pdf_path), exist_ok=True)
        with open(saved_pdf_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    elif file_path and os.path.exists(file_path):
        saved_pdf_path = file_path
    else:
        # Deliberately no fallback "specimen" PDF: scanning a stored copy of another
        # applicant's documents into this case would cross-contaminate KYC records.
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Select the case PDF to scan — no file was uploaded.",
        )

    try:
        # Scanning a multi-page PDF takes minutes of blocking HTTP calls to Gemini; run it off
        # the event loop so the worker keeps serving requests and isn't killed mid-scan.
        results = await run_in_threadpool(
            burst_and_separate_pdf_with_llm,
            pdf_path=saved_pdf_path,
            case_id=real_case_id,
            applicant_name=applicant_name or loan_case.applicant_name,
            target_address=target_address or loan_case.target_address,
            password=password,
        )
    except PdfPasswordRequired:
        # A distinct, structured status (not a generic 500) so the dashboard can prompt for
        # this ONE file's password and retry it, instead of treating it as a failed scan -
        # every other file in the same folder/batch keeps processing regardless.
        raise HTTPException(
            status_code=422,
            detail={"code": "PASSWORD_REQUIRED", "filename": os.path.basename(saved_pdf_path)},
        )
    except PdfWrongPassword:
        raise HTTPException(
            status_code=422,
            detail={"code": "WRONG_PASSWORD", "filename": os.path.basename(saved_pdf_path)},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to burst and analyze PDF with Gemini LLM: {str(e)}",
        )

    # Replace any previously ingested pages for this case (idempotent re-ingestion), unless
    # this call is part of a multi-file batch where earlier files must be kept.
    _apply_doc_hint(results, doc_hint)
    try:
        await _persist_ai_ingested_documents(db, loan_case, results, replace_existing=replace_existing)
        await db.flush()
    except Exception as e:
        # Gemini finished scanning fine (no exception above) but saving the results to the
        # database failed - without this, the error bypassed our own exception handling
        # entirely (it's raised after the try/except around the Gemini scan, not inside it),
        # so FastAPI's default handler returned a bare 500 with no JSON "detail" at all, and
        # the dashboard's error alert fell back to a generic, unhelpful "Could not process
        # PDF" with no indication anything had actually been scanned correctly. A real
        # example that hit exactly this: a stale DB column width rejected one page's
        # classification, failing the whole batch's save. Roll back so this session isn't
        # left in a broken transaction state for the rest of the request.
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Scanned {len(results)} page(s) successfully but failed to save them: {str(e)}",
        )
    await _refresh_case_relationships(db, loan_case)

    audit = AuditLog(
        case_id=loan_case.id,
        user_id=current_user.id,
        action="PDF_INGESTED_AND_SEPARATED",
        extra_metadata={
            "scanned_pdf": os.path.basename(saved_pdf_path),
            "total_pages": len(results),
        },
    )
    db.add(audit)
    await db.commit()

    all_pages = await _ai_ingested_pages(db, loan_case)
    return {
        "status": "success",
        "case_id": real_case_id,
        "case_no": loan_case.case_no,
        "total_pages_separated": len(results),
        "pages_failed": [r.get("page_number") for r in results if r.get("scan_status") == "FAILED"],
        "scanned_pdf": os.path.basename(saved_pdf_path),
        "documents": results,
        "case_summary": reconcile_case_documents(all_pages, loan_case.applicant_name, loan_case.co_applicant_name),
    }


@router.post("/{case_id}/ingest-field-form-pdf")
async def ingest_field_form_pdf(
    case_id: str,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_ca_user),
) -> Dict[str, Any]:
    """
    For a backlog case whose field visit is already complete - captured on the CA office's old
    Google Form (exported to PDF) before this system had its own PWA questionnaire, photos
    handled separately - extract that PDF with Gemini and save it as this case's
    field_form_data, in exactly the shape the PWA's own form submission already produces. Skips
    the need to manually retype a visit that already happened; does not touch KYC documents or
    photos, which already have their own working ingestion paths.
    """
    loan_case = await resolve_loan_case(db, case_id)
    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan case not found")

    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Please upload the field visit form as a PDF.")

    real_case_id = str(loan_case.id)
    upload_dir = os.path.join("storage_uploads", "field_form_pdfs", real_case_id)
    os.makedirs(upload_dir, exist_ok=True)
    clean_filename = os.path.basename(file.filename.replace("\\", "/"))
    saved_pdf_path = os.path.join(upload_dir, clean_filename)
    with open(saved_pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    from app.services.field_form_pdf_ingest import (
        ingest_field_form_pdf as run_extraction,
        resolve_effective_loan_amount,
    )

    try:
        field_form_payload = await run_in_threadpool(run_extraction, saved_pdf_path, loan_case.applicant_name)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to extract the field visit form with Gemini: {str(e)}",
        )

    import json as _json
    loan_case.field_form_data = _json.dumps(field_form_payload)
    resolved_amt = resolve_effective_loan_amount(loan_case.loan_amount, field_form_payload)
    if resolved_amt and (not loan_case.loan_amount or loan_case.loan_amount < 50_000):
        loan_case.loan_amount = resolved_amt

    audit = AuditLog(
        case_id=loan_case.id,
        user_id=current_user.id,
        action="FIELD_FORM_PDF_INGESTED",
        extra_metadata={"source_pdf": clean_filename},
    )
    db.add(audit)
    await db.commit()

    return {
        "status": "success",
        "case_id": real_case_id,
        "case_no": loan_case.case_no,
        "field_form_data": field_form_payload,
        "message": "Field visit form extracted and saved. Review the Residential/Office Details tab, then generate the report.",
    }


@router.post("/{case_id}/pan-verification")
async def upload_pan_verification_report(
    case_id: str,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_ca_user),
) -> Dict[str, Any]:
    """
    Upload the NSDL / Income Tax e-filing "Know Your PAN" verification report - a distinct
    document from the physical PAN card scan (PAN_CARD), so the dashboard's PAN card flip
    view can show both, and the certified report can print both in the PAN verification
    annexure. Deliberately a small, isolated endpoint rather than reusing the shared
    zero-lag field-upload endpoint, so this one-off CA-desk action can never affect the
    high-traffic PWA photo-capture upload path.
    """
    loan_case = await resolve_loan_case(db, case_id)
    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan case not found")

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty.")
    filename = file.filename or "pan_verification.pdf"
    is_pdf = filename.lower().endswith(".pdf")

    upload_dir = os.path.join("storage_uploads", f"case_{loan_case.id.hex}")
    os.makedirs(upload_dir, exist_ok=True)

    if is_pdf:
        # The report builder can only place raster images, not raw PDF pages - render just the
        # first page (the verification result itself) to a JPG, same 300 DPI quality already
        # used for every other scanned document in this app.
        import fitz
        tmp_pdf_path = os.path.join(upload_dir, f"pan_verification_src_{uuid.uuid4().hex[:8]}.pdf")
        with open(tmp_pdf_path, "wb") as f:
            f.write(file_bytes)
        try:
            doc = fitz.open(tmp_pdf_path)
            if doc.page_count == 0:
                doc.close()
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The uploaded PDF has no pages.")
            pix = doc.load_page(0).get_pixmap(dpi=300)
            img_name = f"pan_verification_{uuid.uuid4().hex[:8]}.jpg"
            img_path = os.path.join(upload_dir, img_name)
            pix.save(img_path, jpg_quality=95)
            doc.close()
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Could not read the uploaded PDF: {str(e)}",
            )
        storage_url = f"/storage/case_{loan_case.id.hex}/{img_name}"
    else:
        img_name = f"pan_verification_{uuid.uuid4().hex[:8]}_{os.path.basename(filename)}"
        disk_path = os.path.join(upload_dir, img_name)
        with open(disk_path, "wb") as f:
            f.write(file_bytes)
        storage_url = f"/storage/case_{loan_case.id.hex}/{img_name}"

    doc_row = CaseDocument(
        case_id=loan_case.id,
        doc_type=DocumentType.PAN_VERIFICATION_REPORT,
        storage_url=storage_url,
        watermarked_url=storage_url,
        captured_at=datetime.now(timezone.utc),
        verification_status=VerificationStatus.VERIFIED,
        ocr_data={"source": "ca_manual_upload", "original_filename": filename},
    )
    db.add(doc_row)

    audit = AuditLog(
        case_id=loan_case.id,
        user_id=current_user.id,
        action="PAN_VERIFICATION_REPORT_UPLOADED",
        extra_metadata={"filename": filename},
    )
    db.add(audit)
    await db.commit()
    await db.refresh(doc_row)

    return {
        "status": "SUCCESS",
        "document_id": str(doc_row.id),
        "storage_url": storage_url,
        "web_url": storage_url,
    }


@router.post("/{case_id}/ingest-images")
async def ingest_and_classify_case_images(
    case_id: str,
    files: List[UploadFile] = File(...),
    applicant_name: Optional[str] = Form(None),
    target_address: Optional[str] = Form(None),
    doc_hint: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_ca_user),
) -> Dict[str, Any]:
    """
    Ingest one or more standalone document photos (e.g. pre-split Aadhaar/PAN/utility-bill
    images from a bank folder, as opposed to one combined PDF). Every image is classified
    by Gemini Vision via OpenRouter — the identical AI pipeline used for PDF pages. No
    filename-based guessing is used for the actual document type or extracted data.
    """
    loan_case = await resolve_loan_case(db, case_id)
    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan case not found")

    real_case_id = str(loan_case.id)
    upload_dir = os.path.join("storage_uploads", "ingested_images", real_case_id)
    os.makedirs(upload_dir, exist_ok=True)

    results: List[Dict[str, Any]] = []
    failures: List[str] = []

    # Each image's Gemini classification used to run one at a time, fully sequentially - a
    # folder with a dozen standalone KYC photos (as opposed to one combined PDF) took as long as
    # twelve back-to-back AI calls. Classify them concurrently instead, capped at the same
    # PAGE_SCAN_WORKERS limit the PDF-bursting pipeline already uses for consistency.
    semaphore = asyncio.Semaphore(PAGE_SCAN_WORKERS)

    async def _classify_one(f: UploadFile):
        if not f.filename:
            return None, None
        clean_filename = os.path.basename(f.filename.replace("\\", "/"))
        tmp_path = os.path.join(upload_dir, clean_filename)
        os.makedirs(os.path.dirname(tmp_path), exist_ok=True)
        with open(tmp_path, "wb") as buffer:
            shutil.copyfileobj(f.file, buffer)
        async with semaphore:
            try:
                item = await run_in_threadpool(
                    classify_and_store_single_image,
                    image_path=tmp_path,
                    case_id=real_case_id,
                    applicant_name=applicant_name or loan_case.applicant_name,
                    target_address=target_address or loan_case.target_address,
                )
                return item, None
            except Exception as e:
                return None, f"{f.filename}: {str(e)}"

    for item, err in await asyncio.gather(*[_classify_one(f) for f in files]):
        if item is not None:
            results.append(item)
        if err is not None:
            failures.append(err)

    if not results:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to classify any image with Gemini LLM. Errors: {failures}",
        )

    # Loose images are additive (a case may already have PDF-ingested pages), never clobber existing ones
    _apply_doc_hint(results, doc_hint)
    await _persist_ai_ingested_documents(db, loan_case, results, replace_existing=False)
    await db.flush()
    await _refresh_case_relationships(db, loan_case)

    audit = AuditLog(
        case_id=loan_case.id,
        user_id=current_user.id,
        action="IMAGES_INGESTED_AND_CLASSIFIED",
        extra_metadata={"total_images": len(results), "failures": failures},
    )
    db.add(audit)
    await db.commit()

    return {
        "status": "success",
        "case_id": real_case_id,
        "case_no": loan_case.case_no,
        "total_images_classified": len(results),
        "failures": failures,
        "documents": results,
    }


@router.get("/{case_id}/separated-documents")
async def get_separated_case_documents(
    case_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_ca_user),
) -> Dict[str, Any]:
    """Retrieve all AI-separated document pages, plus the cross-document case summary."""
    loan_case = await resolve_loan_case(db, case_id)
    if not loan_case:
        return {"case_id": case_id, "documents": [], "case_summary": None}

    docs = await _ai_ingested_pages(db, loan_case)
    return {
        "case_id": str(loan_case.id),
        "documents": docs,
        "case_summary": reconcile_case_documents(docs, loan_case.applicant_name, loan_case.co_applicant_name) if docs else None,
    }


async def _ai_ingested_pages(db: AsyncSession, loan_case: LoanCase) -> List[Dict[str, Any]]:
    result = await db.execute(
        select(CaseDocument)
        .where(CaseDocument.case_id == loan_case.id)
        .order_by(asc(CaseDocument.created_at))
    )
    docs = []
    for d in result.scalars().all():
        if isinstance(d.ocr_data, dict) and d.ocr_data.get("source") == "pdf_ingest":
            page = dict(d.ocr_data)
            raw_url = d.watermarked_url or d.storage_url or page.get("image_url") or ""
            # Canonicalize all separated page URLs to persistent volume /storage/separated_docs/
            if "/static/extracted_pages/" in raw_url:
                raw_url = raw_url.replace("/static/extracted_pages/", "/storage/separated_docs/")
            page["image_url"] = raw_url
            page["doc_type"] = page.get("llm_doc_type", page.get("doc_type"))
            page["id"] = str(d.id)  # the actual CaseDocument row id, needed to delete this one page
            # Needed so the frontend can decide "AI scan vs. a later manual re-upload of the same
            # document type — whichever is newer wins" instead of always trusting the AI scan.
            page["created_at_raw"] = d.created_at.isoformat() if d.created_at else None
            pn = page.get("page_number")
            if not isinstance(pn, int):
                page["page_number"] = int(pn) if isinstance(pn, str) and pn.isdigit() else None
            docs.append(page)
    docs.sort(key=lambda p: p.get("page_number") or 0)
    return docs


@router.delete("/{case_id}/documents/{document_id}")
async def delete_case_document(
    case_id: str,
    document_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_ca_user),
):
    """
    Remove a single AI-ingested scanned page (a stray, duplicate, or irrelevant page the
    Gemini folder/PDF scan swept up — e.g. someone else's document, a blurry re-scan, a
    generic site photo that doesn't belong in the KYC bundle) from a case.

    Restricted to pdf_ingest-sourced pages, PLUS unslotted doc_type=OTHER uploads: field-staff
    EVIDENCE photos (PROPERTY_EXTERIOR, AGENT_SELFIE, OFFICE_*, anything with a slot_number...)
    are compliance evidence with their own retake-based lifecycle and must never be removable
    through this "tidy up" action. An unslotted OTHER document, by contrast, is never real
    classified evidence - it's always a misfiled/duplicate manual upload (e.g. a page meant for
    the Manual Upload tab that a client-side bug sent into the residence evidence folder
    instead with an invalid doc_type the server couldn't classify) and is always safe to clear.
    """
    loan_case = await resolve_loan_case(db, case_id)
    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan case not found")

    result = await db.execute(
        select(CaseDocument).where(CaseDocument.id == document_id, CaseDocument.case_id == loan_case.id)
    )
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found on this case")
    is_pdf_ingest = isinstance(doc.ocr_data, dict) and doc.ocr_data.get("source") == "pdf_ingest"
    doc_type_str = doc.doc_type.value if hasattr(doc.doc_type, "value") else str(doc.doc_type)
    is_unslotted_other = doc_type_str == "OTHER" and not getattr(doc, "slot_number", None)
    if not (is_pdf_ingest or is_unslotted_other):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only AI-ingested scan pages and misfiled/unclassified uploads can be removed this way — not field evidence photos or the selfie.",
        )

    removed_title = doc.ocr_data.get("document_title") or doc.ocr_data.get("doc_type")
    removed_type = doc.doc_type.value if hasattr(doc.doc_type, "value") else str(doc.doc_type)

    # Best-effort cleanup of the stored file(s) on disk — never block the delete on this.
    for path in {doc.storage_url, doc.watermarked_url}:
        if path and not path.startswith("http") and os.path.exists(path):
            try:
                os.remove(path)
            except OSError:
                pass

    db.add(AuditLog(
        case_id=loan_case.id,
        user_id=current_user.id,
        action="DOCUMENT_DELETED",
        extra_metadata={"document_id": str(document_id), "doc_type": removed_type, "title": removed_title},
    ))
    await db.delete(doc)
    await db.commit()
    await _refresh_case_relationships(db, loan_case)
    await db.commit()

    return {"status": "success", "document_id": str(document_id), "message": f"Removed '{removed_title or removed_type}' from the case."}


@router.post("/{case_id}/reassign-documents")
async def reassign_documents_to_case(
    case_id: str,
    req: ReassignDocumentsRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.CA_VERIFIER, UserRole.SUPER_ADMIN)),
):
    """
    Data-repair tool: moves specific documents onto this case record. For the rare case where
    documents ended up attached to the wrong case - e.g. a case_no collision at creation
    silently merged a brand new applicant's uploads into an unrelated, pre-existing case id,
    mixing two different people's documents under one case.
    """
    loan_case = await resolve_loan_case(db, case_id)
    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target case not found")

    result = await db.execute(select(CaseDocument).where(CaseDocument.id.in_(req.document_ids)))
    docs = result.scalars().all()
    found_ids = {d.id for d in docs}
    missing = [str(i) for i in req.document_ids if i not in found_ids]

    source_case_ids = {d.case_id for d in docs if d.case_id != loan_case.id}
    moved_ids = []
    for d in docs:
        if d.case_id != loan_case.id:
            d.case_id = loan_case.id
            moved_ids.append(str(d.id))

    db.add(AuditLog(
        case_id=loan_case.id,
        user_id=current_user.id,
        action="DOCUMENTS_REASSIGNED",
        extra_metadata={"document_ids": moved_ids, "missing_ids": missing},
    ))
    await db.commit()
    await _refresh_case_relationships(db, loan_case)
    for source_id in source_case_ids:
        source_case = await db.get(LoanCase, source_id)
        if source_case:
            await _refresh_case_relationships(db, source_case)
    await db.commit()

    return {"status": "success", "moved_count": len(moved_ids), "missing_ids": missing}


@router.post("/{case_id}/documents/rotate")
async def rotate_case_document_image(
    case_id: str,
    req: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_ca_user),
):
    """
    Permanently rotate a document image on disk (storage_uploads + app/static/extracted_pages)
    by 90, 180, or 270 degrees clockwise, or "auto" (uses Gemini Vision to detect upright
    orientation). Keeps the document permanently upright in the Document Viewer, thumbnails,
    Scrutiny Desk cards, and generated PDF/DOCX reports.
    """
    loan_case = await resolve_loan_case(db, case_id)
    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan case not found")

    doc_id_str = str((req or {}).get("document_id") or "").strip()
    image_url = str((req or {}).get("image_url") or "").strip()
    degrees_raw = (req or {}).get("degrees", "auto")

    # Strip any query-string cache buster from image_url
    clean_img_url = image_url.split("?")[0].strip()
    if clean_img_url.startswith("http://") or clean_img_url.startswith("https://"):
        from urllib.parse import urlparse
        clean_img_url = urlparse(clean_img_url).path

    target_doc: Optional[CaseDocument] = None
    if doc_id_str:
        try:
            doc_uuid = uuid.UUID(doc_id_str)
            res = await db.execute(
                select(CaseDocument).where(CaseDocument.id == doc_uuid, CaseDocument.case_id == loan_case.id)
            )
            target_doc = res.scalar_one_or_none()
        except ValueError:
            target_doc = None

    if not target_doc and clean_img_url:
        base_fname = os.path.basename(clean_img_url)
        res = await db.execute(select(CaseDocument).where(CaseDocument.case_id == loan_case.id))
        for d in res.scalars().all():
            u1 = (d.watermarked_url or "").split("?")[0]
            u2 = (d.storage_url or "").split("?")[0]
            u3 = ((d.ocr_data or {}).get("image_url") or "").split("?")[0] if isinstance(d.ocr_data, dict) else ""
            if any(base_fname and os.path.basename(u) == base_fname for u in (u1, u2, u3) if u):
                target_doc = d
                break

    # Collect all candidate file paths on disk to rotate in lockstep
    paths_to_rotate = set()
    urls_to_check = [clean_img_url]
    if target_doc:
        urls_to_check.extend([
            target_doc.watermarked_url or "",
            target_doc.storage_url or "",
            (target_doc.ocr_data or {}).get("image_url") or "" if isinstance(target_doc.ocr_data, dict) else "",
            (target_doc.ocr_data or {}).get("local_path") or "" if isinstance(target_doc.ocr_data, dict) else "",
        ])

    for u in urls_to_check:
        if not u:
            continue
        u_clean = str(u).split("?")[0].replace("\\", "/").strip()
        p = _resolve_doc_image_path(u_clean)
        if p and os.path.exists(p):
            paths_to_rotate.add(os.path.normpath(p))
        fname = os.path.basename(u_clean)
        if fname:
            for extra_cand in (
                os.path.join("storage_uploads", "separated_docs", str(loan_case.id), fname),
                os.path.join("app", "static", "extracted_pages", str(loan_case.id), fname),
                os.path.join("storage_uploads", fname),
            ):
                if os.path.exists(extra_cand):
                    paths_to_rotate.add(os.path.normpath(extra_cand))

    if not paths_to_rotate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document image file not found on server")

    primary_path = sorted(paths_to_rotate)[0]
    if str(degrees_raw).strip().lower() == "auto":
        deg = await run_in_threadpool(detect_document_rotation_with_llm, primary_path)
    else:
        try:
            deg = int(degrees_raw) % 360
        except (TypeError, ValueError):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid rotation degrees")

    if deg in (90, 180, 270):
        await run_in_threadpool(_apply_rotation_if_needed, deg, *list(paths_to_rotate))

    if target_doc:
        target_doc.captured_at = datetime.now(timezone.utc)
        if isinstance(target_doc.ocr_data, dict):
            updated_ocr = dict(target_doc.ocr_data)
            updated_ocr["rotation_needed"] = 0
            updated_ocr["header_edge"] = "TOP"
            target_doc.ocr_data = updated_ocr
        await db.commit()

    canonical_url = clean_img_url or (target_doc.watermarked_url if target_doc else "") or ""
    if "/static/extracted_pages/" in canonical_url:
        canonical_url = canonical_url.replace("/static/extracted_pages/", "/storage/separated_docs/")
    cache_busted_url = f"{canonical_url}?t={int(datetime.now(timezone.utc).timestamp() * 1000)}" if canonical_url else ""

    return {
        "status": "success",
        "rotated_degrees": deg,
        "document_id": str(target_doc.id) if target_doc else doc_id_str,
        "image_url": cache_busted_url,
        "clean_url": canonical_url,
        "message": f"Rotated {deg}° clockwise to upright position." if deg else "Document is already in upright position (0°).",
    }



