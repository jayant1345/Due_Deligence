import os
import uuid
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user, get_current_user_optional
from app.api.v1.cases import ALL_FIELD_VISIT_DOC_TYPES, _has_meaningful_field_form_answers
from app.core.database import get_db
from app.models.document import CaseDocument, DocumentType, VerificationStatus
from app.models.loan_case import CaseStatus, LoanCase, VisitRecord
from app.models.report import AuditLog
from app.models.user import User, UserRole
from app.schemas.document import DocumentUploadResponse
from app.schemas.loan_case import (
    ApplicantLocationRequest,
    FieldFormDataRequest,
    VisitCheckInRequest,
    VisitCheckOutRequest,
    VisitResponse,
)
from app.services.geocoder import is_placeholder
from app.services.geofence import haversine_distance
from app.services.location_link import parse_shared_location
from app.services.storage import storage_service
from app.workers.celery_tasks import process_uploaded_media_task

router = APIRouter(prefix="/visits", tags=["Field Agent Visits & Zero-Lag Uploads"])


async def _resolve_agent_or_default(db: AsyncSession, user: Optional[User], fallback_case: Optional[LoanCase] = None) -> User:
    if user:
        return user
    if fallback_case and fallback_case.assigned_agent_id:
        res = await db.execute(select(User).where(User.id == fallback_case.assigned_agent_id))
        agent = res.scalar_one_or_none()
        if agent:
            return agent
    res = await db.execute(select(User).where(User.role == UserRole.FIELD_AGENT))
    agent = res.scalars().first()
    if agent:
        return agent
    res_any = await db.execute(select(User))
    return res_any.scalars().first()


@router.post("/check-in", response_model=VisitResponse, status_code=status.HTTP_201_CREATED)
async def check_in_site(
    req: VisitCheckInRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Field Agent check-in at target site.
    Records agent device coordinates, check-in timestamp in IST, and advances case status.
    """
    case_query = select(LoanCase).where(LoanCase.id == req.case_id)
    case_res = await db.execute(case_query)
    loan_case = case_res.scalar_one_or_none()

    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan case not found")

    acting_user = await _resolve_agent_or_default(db, current_user, loan_case)

    visit = VisitRecord(
        case_id=req.case_id,
        agent_id=acting_user.id,
        check_in_time=datetime.now(timezone.utc),
        start_lat=req.current_lat,
        start_lon=req.current_lon,
        notes=req.notes,
    )
    db.add(visit)

    # Transition case to IN_PROGRESS - but never downgrade a case that has already moved past
    # this stage (PENDING_CA_REVIEW, APPROVED, CERTIFIED, FLAGGED, REJECTED). Without this guard,
    # a field agent checking in again on an already-certified case (a retake, a late correction,
    # or just re-testing) silently reverted its status, undoing the certification even though no
    # one actually un-certified it.
    if loan_case.status in (CaseStatus.DRAFT, CaseStatus.ASSIGNED):
        photo_check = await db.execute(
            select(CaseDocument.id)
            .where(
                CaseDocument.case_id == loan_case.id,
                CaseDocument.doc_type.in_(ALL_FIELD_VISIT_DOC_TYPES),
            )
            .limit(1)
        )
        if photo_check.scalar_one_or_none() is not None:
            loan_case.status = CaseStatus.IN_PROGRESS

    audit = AuditLog(
        case_id=loan_case.id,
        user_id=acting_user.id,
        action="AGENT_CHECK_IN",
        extra_metadata={
            "lat": req.current_lat,
            "lon": req.current_lon,
            "agent_name": acting_user.full_name,
        },
    )
    db.add(audit)
    await db.commit()
    await db.refresh(visit)
    return visit


@router.post("/cases/{case_id}/field-form")
async def submit_field_visit_form(
    case_id: uuid.UUID,
    req: FieldFormDataRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Submits structured digital Due Diligence Field Visit Form data
    (replaces the manual Google Form previously filled by field agents).
    Persists family table, neighbor references, stay duration, property assets,
    and business verification details into the case dossier.
    """
    case_query = select(LoanCase).where(LoanCase.id == case_id)
    result = await db.execute(case_query)
    loan_case = result.scalar_one_or_none()
    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan case not found")

    acting_user = await _resolve_agent_or_default(db, current_user, loan_case)

    import json
    from app.api.v1.cases import ALL_FIELD_VISIT_DOC_TYPES, _has_meaningful_field_form_answers
    from app.services.field_form_pdf_ingest import enrich_field_form_defaults

    try:
        existing_ff = json.loads(loan_case.field_form_data or "{}")
        if not isinstance(existing_ff, dict):
            existing_ff = {}
    except Exception:
        existing_ff = {}

    incoming_ff = dict(req.form_data or {})

    # Ignore untouched background PWA auto-drafts (e.g. triggered on pagehide/visibilitychange when
    # an agent merely viewed a case without filling any visit details) so they never pollute
    # field_form_data with default dropdowns ('Owned', '3 BHK Flat') or flip status to IN_PROGRESS.
    if not _has_meaningful_field_form_answers(incoming_ff) and not _has_meaningful_field_form_answers(existing_ff):
        return {"status": "SKIPPED_EMPTY_DRAFT", "message": "Ignored untouched auto-draft"}

    # Preserve server-side & multi-applicant keys (pdf_ingest, extra_co_applicants, applicant_3..5,
    # CA-entered ITR/bank status, field_form_locked, etc.) so saving the mobile PWA form never wipes them out.
    PRESERVED_KEYS = (
        "pdf_ingest",
        "extra_co_applicants",
        "applicant_3_name",
        "applicant_3_phone",
        "applicant_4_name",
        "applicant_4_phone",
        "applicant_5_name",
        "applicant_5_phone",
        "co_applicant_name",
        "co_applicant_contact",
        "co_applicant_age",
        "co_applicant_marital_status",
        "co_applicant_qualification",
        "co_applicant_occupation",
        "field_form_locked",
        "_forms_merged_count",
        "form_applicant_type",
        "form_person_name",
    )
    merged_ff = dict(existing_ff)
    merged_ff.update(incoming_ff)
    for pk in PRESERVED_KEYS:
        if existing_ff.get(pk) not in (None, "", [], {}) and not incoming_ff.get(pk):
            merged_ff[pk] = existing_ff[pk]

    # Preserve CA-entered ITR / Bank account status when the PWA sends empty strings (since Module 5 is hidden on mobile)
    for ca_k in ("itr_acknowledgement_no", "itr_filing_date", "bank_account_status", "bank_account_status_co"):
        if existing_ff.get(ca_k) and not incoming_ff.get(ca_k):
            merged_ff[ca_k] = existing_ff[ca_k]
            if isinstance(merged_ff.get("restore"), dict) and isinstance(existing_ff.get("restore"), dict):
                if existing_ff["restore"].get(ca_k) and not merged_ff["restore"].get(ca_k):
                    merged_ff["restore"][ca_k] = existing_ff["restore"][ca_k]

    # Sync Co-Applicant personal particulars from office_details_co into top-level co_applicant_* keys
    off_co = merged_ff.get("office_details_co")
    if isinstance(off_co, dict):
        if off_co.get("marital_status"):
            merged_ff["co_applicant_marital_status"] = off_co["marital_status"]
        if off_co.get("qualification"):
            merged_ff["co_applicant_qualification"] = off_co["qualification"]
        if off_co.get("occupation"):
            merged_ff["co_applicant_occupation"] = off_co["occupation"]
        if loan_case.co_applicant_name and not off_co.get("name"):
            off_co["name"] = loan_case.co_applicant_name
        if loan_case.co_applicant_phone and not off_co.get("contact_number"):
            off_co["contact_number"] = loan_case.co_applicant_phone

    # Enrich defaults (landmarks, owner relation, references, etc.) so report generation has zero blanks
    # Preserve the raw UI 'restore' object submitted by the PWA so re-opening or switching back to
    # this case in the PWA restores the exact dropdown/chip/family values the agent entered.
    raw_incoming_restore = (
        dict(incoming_ff["restore"])
        if isinstance(incoming_ff.get("restore"), dict)
        else None
    )
    try:
        merged_ff = enrich_field_form_defaults(
            merged_ff,
            applicant_name=loan_case.applicant_name,
            target_address=loan_case.target_address,
            office_address=loan_case.office_address,
        )
    except Exception:
        pass
    if raw_incoming_restore is not None:
        if not isinstance(merged_ff.get("restore"), dict):
            merged_ff["restore"] = {}
        for rk, rv in raw_incoming_restore.items():
            if rv not in (None, "", []):
                merged_ff["restore"][rk] = rv

    # Sync co_applicant_name, extra_co_applicants (3..5), and office addresses onto the case record if captured on site
    if not (loan_case.co_applicant_name or "").strip() and (merged_ff.get("co_applicant_name") or "").strip():
        loan_case.co_applicant_name = str(merged_ff["co_applicant_name"]).strip()
    if not (loan_case.co_applicant_phone or "").strip() and (merged_ff.get("co_applicant_contact") or "").strip():
        loan_case.co_applicant_phone = str(merged_ff["co_applicant_contact"]).strip()
    extra_cos = merged_ff.get("extra_co_applicants")
    if isinstance(extra_cos, list):
        for idx_ec, ec_item in enumerate(extra_cos[:3], start=3):
            if isinstance(ec_item, dict):
                ec_name = str(ec_item.get("name") or "").strip()
                ec_phone = str(ec_item.get("contact_number") or "").strip()
                if ec_name:
                    merged_ff[f"applicant_{idx_ec}_name"] = ec_name
                    if not (getattr(loan_case, f"applicant_{idx_ec}_name", None) or "").strip():
                        setattr(loan_case, f"applicant_{idx_ec}_name", ec_name)
                if ec_phone:
                    merged_ff[f"applicant_{idx_ec}_phone"] = ec_phone
                    if not (getattr(loan_case, f"applicant_{idx_ec}_phone", None) or "").strip():
                        setattr(loan_case, f"applicant_{idx_ec}_phone", ec_phone)

    loan_case.field_form_data = json.dumps(merged_ff)

    off_main = merged_ff.get("office_details")
    if isinstance(off_main, dict) and (off_main.get("address") or "").strip():
        if not (loan_case.office_address or "").strip():
            loan_case.office_address = off_main["address"].strip()
    if isinstance(off_co, dict) and (off_co.get("address") or "").strip():
        if not (loan_case.co_applicant_office_address or "").strip():
            loan_case.co_applicant_office_address = off_co["address"].strip()

    if loan_case.status in (CaseStatus.DRAFT, CaseStatus.ASSIGNED):
        photo_check = await db.execute(
            select(CaseDocument.id)
            .where(
                CaseDocument.case_id == loan_case.id,
                CaseDocument.doc_type.in_(ALL_FIELD_VISIT_DOC_TYPES),
            )
            .limit(1)
        )
        if photo_check.scalar_one_or_none() is not None:
            loan_case.status = CaseStatus.IN_PROGRESS

    audit = AuditLog(
        case_id=loan_case.id,
        user_id=acting_user.id,
        action="FIELD_FORM_SUBMITTED",
        extra_metadata={"agent_name": acting_user.full_name},
    )
    db.add(audit)
    await db.commit()
    return {"status": "SUCCESS", "message": "Field visit due diligence form saved successfully"}


# An applicant-shared pin further than this from the benchmark is flagged for CA scrutiny.
APPLICANT_LOCATION_FLAG_M = 2000


def _applicant_location_view(loan_case: LoanCase, meta: dict) -> dict:
    """Shared-location record plus its distance from the case's current benchmark."""
    lat, lon = meta["lat"], meta["lon"]
    distance_m = None
    if not is_placeholder(loan_case.target_lat, loan_case.target_lon):
        distance_m = round(haversine_distance(loan_case.target_lat, loan_case.target_lon, lat, lon))
    return {
        "lat": lat,
        "lon": lon,
        "shared_at": meta.get("shared_at"),
        "recorded_by": meta.get("recorded_by"),
        "distance_from_benchmark_m": distance_m,
        "flagged": distance_m is not None and distance_m > APPLICANT_LOCATION_FLAG_M,
    }


@router.post("/cases/{case_id}/applicant-location")
async def save_applicant_location(
    case_id: uuid.UUID,
    req: ApplicantLocationRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Record the location the applicant shared on WhatsApp (link or "lat, long" text).
    It is self-declared, so it is stored beside the benchmark - never as the benchmark.
    """
    result = await db.execute(select(LoanCase).where(LoanCase.id == case_id))
    loan_case = result.scalar_one_or_none()
    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan case not found")

    coords = await parse_shared_location(req.text)
    if not coords:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No location found in this text. In WhatsApp open the applicant's location, tap it to open "
                   "Google Maps, then Share → Copy link and paste it here.",
        )

    acting_user = await _resolve_agent_or_default(db, current_user, loan_case)
    meta = {
        "lat": round(coords[0], 6),
        "lon": round(coords[1], 6),
        "shared_at": datetime.now(timezone.utc).isoformat(),
        "recorded_by": acting_user.full_name,
        "source_text": req.text.strip()[:300],
    }
    db.add(AuditLog(
        case_id=loan_case.id,
        user_id=acting_user.id,
        action="APPLICANT_LOCATION_SHARED",
        extra_metadata=meta,
    ))
    await db.commit()
    return _applicant_location_view(loan_case, meta)


@router.get("/cases/{case_id}/applicant-location")
async def get_applicant_location(
    case_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Latest applicant-shared location for the case, or null when none was recorded."""
    result = await db.execute(select(LoanCase).where(LoanCase.id == case_id))
    loan_case = result.scalar_one_or_none()
    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan case not found")
    logs = await db.execute(
        select(AuditLog)
        .where(AuditLog.case_id == loan_case.id, AuditLog.action == "APPLICANT_LOCATION_SHARED")
        .order_by(desc(AuditLog.timestamp))
        .limit(1)
    )
    log = logs.scalar_one_or_none()
    if not log or not log.extra_metadata:
        return None
    return _applicant_location_view(loan_case, log.extra_metadata)


@router.post("/cases/{case_id}/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_202_ACCEPTED)
async def zero_lag_upload_document(
    case_id: str,
    doc_type: str = Form(...),
    slot_number: Optional[int] = Form(None),
    folder: Optional[str] = Form(None),
    visit_id: Optional[uuid.UUID] = Form(None),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    NON-NEGOTIABLE ZERO-LAG FILE INGESTION POLICY (< 150ms):
    1. Stream file bytes directly to storage (S3/R2 or persistent volume).
    2. Compute geofence distance and validation status synchronously.
    3. Persist metadata to PostgreSQL via asyncpg.
    4. Auto-stamp hard watermark if image.
    5. Return instant 202 Accepted with task ID.
    """
    # Safe resolution of doc_type
    try:
        resolved_doc_type = DocumentType(doc_type)
    except ValueError:
        resolved_doc_type = DocumentType.OTHER

    # Determine folder: 'work' vs 'residence' vs 'kyc'. A KYC/financial document (Aadhaar, PAN,
    # utility bill, payslip, title deed...) is neither site evidence nor office evidence, so it
    # must never default into "residence" — that would let it silently fill a residence-photo
    # slot on the CA dashboard. Only genuine site/office evidence types default to a folder.
    norm_folder = (folder or "").strip().lower()
    doc_type_str = str(doc_type).upper()
    if not norm_folder:
        if any(w in doc_type_str for w in ["OFFICE", "WORK", "FACADE", "NAMEBOARD", "DESK"]):
            norm_folder = "work"
        elif doc_type_str in ("AADHAAR_CARD", "PAN_CARD", "UTILITY_BILL", "SALARY_SLIP", "PROPERTY_TITLE_DEED", "FORM_16", "OTHER"):
            norm_folder = "kyc"
        else:
            norm_folder = "residence"

    # Quick check for case existence by UUID or case_no
    loan_case = None
    try:
        u_id = uuid.UUID(case_id)
        case_res = await db.execute(select(LoanCase).where(LoanCase.id == u_id))
        loan_case = case_res.scalar_one_or_none()
    except ValueError:
        clean_case_no = case_id.replace("-pargi", "").upper()
        case_res = await db.execute(
            select(LoanCase).where(
                (LoanCase.case_no == case_id) | 
                (LoanCase.case_no.ilike(f"%{clean_case_no}%"))
            )
        )
        loan_case = case_res.scalar_one_or_none()

    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan case not found")

    acting_user = await _resolve_agent_or_default(db, current_user, loan_case)

    # Read bytes and stream to storage
    file_bytes = await file.read()
    storage_url = await storage_service.save_upload_file(
        file_content=file_bytes,
        filename=file.filename or "upload.jpg",
        subfolder=f"case_{loan_case.id.hex}",
    )

    # Compute Geofence proximity
    is_geofence_valid = True
    dist_m = None
    if latitude is not None and longitude is not None and loan_case.target_lat and loan_case.target_lon:
        dist_m = haversine_distance(loan_case.target_lat, loan_case.target_lon, latitude, longitude)
        is_geofence_valid = (dist_m <= 150.0)

    # Apply fast indelibly-burned watermark banner if local file
    watermarked_url = None
    if os.path.exists(storage_url) and any(storage_url.lower().endswith(ext) for ext in [".jpg", ".jpeg", ".png", ".webp"]):
        try:
            from app.services.image_watermark import stamp_hard_watermark
            dir_name = os.path.dirname(storage_url)
            base_name = os.path.basename(storage_url)
            watermarked_path = os.path.join(dir_name, f"wm_{base_name}")

            # Extract Office Address from field form data if workplace photo. A co-applicant's
            # office is frequently a different premises, so it has its own office_details_co
            # block rather than sharing the primary applicant's office_details.
            is_co_work = (norm_folder == "co_work") or "CO_OFFICE" in doc_type_str
            office_address = None
            if loan_case.field_form_data:
                try:
                    import json
                    ffd = json.loads(loan_case.field_form_data)
                    office_key = "office_details_co" if is_co_work else "office_details"
                    office_address = ffd.get(office_key, {}).get("address")
                except Exception:
                    pass

            is_work = is_co_work or (norm_folder == "work") or any(w in doc_type_str for w in ["OFFICE", "WORK", "FACADE", "NAMEBOARD", "DESK"])
            # A co-applicant who lives at a different address from the primary applicant gets
            # their own residence folder/visit, exactly as co_work already does for a different
            # workplace - without this, their residence photos were watermarked with the
            # applicant's own address even when the two live apart.
            is_co_residence = (norm_folder == "co_residence")
            # Applicants 3-5 (home-visit-only slots, folders "home_3"/"home_4"/"home_5") - use
            # that applicant's own separate address when the CA office captured one (they are
            # not sharing another applicant's home visit); otherwise falls back to the main
            # property address, same as the primary applicant's own residence folder.
            home_slot_match = norm_folder in ("home_3", "home_4", "home_5")
            if is_work:
                visit_type = "CO-APPLICANT WORKPLACE / OFFICE" if is_co_work else "WORKPLACE / OFFICE"
                fallback_case_off = (
                    (loan_case.co_applicant_office_address or loan_case.office_address)
                    if is_co_work
                    else (loan_case.office_address or loan_case.co_applicant_office_address)
                )
                active_address = office_address or fallback_case_off or loan_case.target_address or "Office Address Verified at Site"
                applicant_label = loan_case.co_applicant_name if (is_co_work and loan_case.co_applicant_name) else loan_case.applicant_name
            elif is_co_residence:
                visit_type = "CO-APPLICANT RESIDENCE / HOME"
                active_address = loan_case.co_applicant_address or loan_case.target_address
                applicant_label = loan_case.co_applicant_name or loan_case.applicant_name
            elif home_slot_match:
                slot_num = norm_folder.split("_")[1]
                visit_type = f"APPLICANT {slot_num} RESIDENCE / HOME"
                active_address = getattr(loan_case, f"applicant_{slot_num}_address", None) or loan_case.target_address
                applicant_label = getattr(loan_case, f"applicant_{slot_num}_name", None) or loan_case.applicant_name
            else:
                visit_type = "RESIDENCE / HOME"
                active_address = loan_case.target_address
                applicant_label = loan_case.applicant_name

            from starlette.concurrency import run_in_threadpool
            await run_in_threadpool(
                stamp_hard_watermark,
                input_image_path=storage_url,
                output_image_path=watermarked_path,
                case_no=loan_case.case_no,
                agent_name=acting_user.full_name,
                agent_id=str(acting_user.id)[:8].upper(),
                lat=latitude or loan_case.target_lat,
                lon=longitude or loan_case.target_lon,
                geofence_status="COMPLIANT" if is_geofence_valid else "BREACH",
                applicant_name=applicant_label,
                address=active_address,
                visit_type=visit_type,
            )
            watermarked_url = watermarked_path
        except Exception:
            watermarked_url = storage_url

    clean_orig_name = os.path.basename((file.filename or "upload.jpg").replace("\\", "/"))
    ocr_meta = {
        "folder": norm_folder,
        "original_filename": clean_orig_name,
    }
    if slot_number is not None:
        ocr_meta["slot_number"] = slot_number

    # When a specific photo slot (slot_number >= 1) in a non-KYC folder is retaken/re-uploaded,
    # remove any earlier superseded CaseDocument rows for that exact same (case_id, folder, slot_number)
    # so the database, CA Dashboard, and Mobile PWA always stay 100% in sync with 1 photo per slot.
    if slot_number is not None and norm_folder != "kyc" and resolved_doc_type != DocumentType.AGENT_SELFIE:
        try:
            existing_docs_res = await db.execute(
                select(CaseDocument).where(CaseDocument.case_id == loan_case.id)
            )
            for ex_doc in existing_docs_res.scalars().all():
                ex_ocr = ex_doc.ocr_data if isinstance(ex_doc.ocr_data, dict) else {}
                if ex_ocr.get("source") == "pdf_ingest":
                    continue
                ex_slot = ex_ocr.get("slot_number")
                try:
                    ex_slot_int = int(ex_slot) if ex_slot is not None else None
                except (TypeError, ValueError):
                    ex_slot_int = None
                if ex_slot_int != int(slot_number):
                    continue
                ex_folder = str(ex_ocr.get("folder") or "").strip().lower()
                if not ex_folder:
                    ex_dt = (ex_doc.doc_type.value if hasattr(ex_doc.doc_type, "value") else str(ex_doc.doc_type)).upper()
                    ex_folder = "work" if any(w in ex_dt for w in ["OFFICE", "WORK", "FACADE", "NAMEBOARD", "DESK"]) else "residence"
                if ex_folder == norm_folder:
                    await db.delete(ex_doc)
        except Exception:
            pass

    # Persist document record
    doc = CaseDocument(
        case_id=loan_case.id,
        visit_id=visit_id,
        doc_type=resolved_doc_type,
        storage_url=storage_url,
        watermarked_url=watermarked_url or storage_url,
        latitude=latitude,
        longitude=longitude,
        distance_from_target=dist_m,
        is_geofence_valid=is_geofence_valid,
        captured_at=datetime.now(timezone.utc),
        verification_status=VerificationStatus.VERIFIED if is_geofence_valid else VerificationStatus.DISCREPANCY_FLAGGED,
        ocr_data=ocr_meta,
    )
    db.add(doc)

    # Advance case status to IN_PROGRESS only for genuine field visit photo / selfie uploads
    # (never for manual KYC uploads in norm_folder == 'kyc', and never downgrading an already-certified case).
    if norm_folder != "kyc" and resolved_doc_type in ALL_FIELD_VISIT_DOC_TYPES and loan_case.status in (CaseStatus.DRAFT, CaseStatus.ASSIGNED):
        loan_case.status = CaseStatus.IN_PROGRESS

    audit = AuditLog(
        case_id=loan_case.id,
        user_id=acting_user.id,
        action="DOCUMENT_UPLOADED",
        extra_metadata={
            "filename": file.filename,
            "lat": latitude,
            "lon": longitude,
            "geofence_valid": is_geofence_valid,
            "distance_m": dist_m,
        },
    )
    db.add(audit)
    await db.commit()
    await db.refresh(doc)

    # Watermarking and metadata persistence are already completed above via threadpool;
    # do not call Celery .delay() synchronously because when Redis is not provisioned
    # (e.g. single-service Railway deployment), kombu blocks for 4-6s per photo retrying localhost:6379.
    task_id = f"sync-watermarked-{uuid.uuid4().hex[:8]}"

    return DocumentUploadResponse(
        document_id=doc.id,
        task_id=task_id,
        case_id=loan_case.id,
        doc_type=doc_type,
        status="ACCEPTED",
        message="File ingested and watermarked immediately.",
    )


@router.post("/check-out", response_model=VisitResponse)
async def check_out_site(
    req: VisitCheckOutRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Complete site visit and advance case to PENDING_CA_REVIEW."""
    visit = None
    loan_case = None

    if req.visit_id:
        res = await db.execute(select(VisitRecord).where(VisitRecord.id == req.visit_id))
        visit = res.scalar_one_or_none()
        if visit:
            c_res = await db.execute(select(LoanCase).where(LoanCase.id == visit.case_id))
            loan_case = c_res.scalar_one_or_none()

    if not visit and req.case_id:
        c_res = await db.execute(select(LoanCase).where(LoanCase.id == req.case_id))
        loan_case = c_res.scalar_one_or_none()
        if loan_case:
            v_res = await db.execute(
                select(VisitRecord)
                .where(VisitRecord.case_id == loan_case.id)
                .order_by(desc(VisitRecord.check_in_time))
                .limit(1)
            )
            visit = v_res.scalar_one_or_none()

    if not visit and not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Visit or loan case not found")

    acting_user = await _resolve_agent_or_default(db, current_user, loan_case)
    now_utc = datetime.now(timezone.utc)

    if not visit and loan_case:
        visit = VisitRecord(
            case_id=loan_case.id,
            agent_id=acting_user.id,
            check_in_time=now_utc,
            check_out_time=now_utc,
            start_lat=req.latitude if req.latitude is not None else (loan_case.target_lat or 23.0225),
            start_lon=req.longitude if req.longitude is not None else (loan_case.target_lon or 72.5714),
            notes=req.notes,
        )
        db.add(visit)
    else:
        visit.check_out_time = now_utc
        if req.notes:
            visit.notes = f"{visit.notes or ''} | Check-out: {req.notes}".strip(" | ")

    # Update case status to PENDING_CA_REVIEW - same guard: a check-out on a case that's
    # already been certified (or approved/flagged/rejected by the CA) must not silently
    # regress it back to an earlier review stage.
    if loan_case and loan_case.status in (CaseStatus.DRAFT, CaseStatus.ASSIGNED, CaseStatus.IN_PROGRESS):
        loan_case.status = CaseStatus.PENDING_CA_REVIEW

    audit = AuditLog(
        case_id=visit.case_id,
        user_id=acting_user.id,
        action="AGENT_CHECK_OUT",
        extra_metadata={"visit_id": str(visit.id), "agent_name": acting_user.full_name},
    )
    db.add(audit)
    await db.commit()
    await db.refresh(visit)
    return visit
