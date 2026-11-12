"""
Assemble the data for the firm's CPV report template from what is actually on record:
Gemini-scanned documents (identity, salary, Form 16, bank statement), the field agent's
questionnaire and site photos, and the CA's own inputs (UDIN, overall status).

Nothing is inferred to fill a gap: a fact that is not on record is left blank, and the
narrative states what is still pending rather than asserting a verification outcome.
"""
import json
import os
import re
from datetime import date, datetime
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.document import CaseDocument, DocumentType
from app.models.loan_case import LoanCase, VisitRecord
from app.models.user import User
from app.services.pdf_separator import _name_score, assign_relationships, reconcile_case_documents

SITE_PHOTO_TYPES = {
    DocumentType.PROPERTY_EXTERIOR, DocumentType.PROPERTY_INTERIOR, DocumentType.ELECTRICITY_METER,
    DocumentType.SOCIETY_BOARD, DocumentType.NEIGHBOR_VERIFICATION,
}
OFFICE_PHOTO_TYPES = {
    DocumentType.OFFICE_FACADE, DocumentType.OFFICE_NAMEBOARD, DocumentType.OFFICE_INTERIOR,
    DocumentType.OFFICE_SELFIE, DocumentType.WORK_OFFICE,
}
CO_APPLICANT_DOC_TYPES = {"FORM_16", "PAN_CARD", "AADHAAR_CARD", "SALARY_SLIP", "BANK_STATEMENT", "EMPLOYEE_ID_CARD"}


def _resolve_slot_photos(docs: List[CaseDocument], max_slots: int = 4) -> List[CaseDocument]:
    """
    One photo per mandatory slot (1-4), newest upload wins if a slot was retaken - mirrors the
    PDF generator's own slot resolution (_apply_report_selection) so the DOCX report shows the
    same, deduplicated 4-photo set instead of every retake/extra photo ever uploaded for this
    folder. A doc with no slot_number at all (older case, tagged before this field existed)
    fills any slots still empty, up to max_slots total - never silently prints every match.
    """
    slot_map: Dict[int, CaseDocument] = {}
    unslotted: List[CaseDocument] = []
    for d in sorted(docs, key=lambda x: x.created_at):
        od = d.ocr_data if isinstance(d.ocr_data, dict) else {}
        sn = od.get("slot_number")
        try:
            sn = int(sn) if sn else None
        except (TypeError, ValueError):
            sn = None
        if sn and 1 <= sn <= max_slots:
            slot_map[sn] = d  # later upload for the same slot overwrites the earlier one
        else:
            unslotted.append(d)
    ordered = [slot_map[s] for s in range(1, max_slots + 1) if s in slot_map]
    for d in unslotted:
        if len(ordered) >= max_slots:
            break
        ordered.append(d)
    return ordered


def _inr(amount: Optional[str]) -> Optional[str]:
    """'438828' -> '4,38,828' (Indian digit grouping)."""
    if not amount:
        return None
    try:
        value = float(amount)
    except ValueError:
        return amount
    neg, value = value < 0, abs(value)
    rupees = int(value)
    paise = round((value - rupees) * 100)
    s = str(rupees)
    if len(s) > 3:
        head, tail = s[:-3], s[-3:]
        head = re.sub(r"(\d)(?=(\d{2})+$)", r"\1,", head)
        s = f"{head},{tail}"
    if paise:
        s += f".{paise:02d}"
    return ("-" if neg else "") + s


def _short_ay(ay: Optional[str]) -> Optional[str]:
    if not ay:
        return None
    m = re.search(r"\b(?:20)?(\d{2})\s*[-–/]\s*(?:20)?(\d{2})\b", str(ay))
    if m:
        y1, y2 = int(m.group(1)), int(m.group(2))
        if 15 <= y1 <= 40 and y2 == (y1 + 1) % 100:
            return f"20{y1:02d}-{y2:02d}"
    return ay


def _ay_of(page: Dict[str, Any]) -> Optional[str]:
    """Assessment year of a Form 16 / ITR / Computation page; Part B often states only the financial year (AY = FY + 1)."""
    for candidate in (page.get("assessment_year"), page.get("document_period"), page.get("document_title"), page.get("forensic_summary")):
        if not candidate:
            continue
        m_ay = re.search(r"A\.?\s*Y\.?[^0-9]*(?:20)?(\d{2})\s*[-–/]\s*(?:20)?(\d{2})", str(candidate), re.I)
        if m_ay:
            y1, y2 = int(m_ay.group(1)), int(m_ay.group(2))
            return f"20{y1:02d}-{y2:02d}"
    if page.get("assessment_year"):
        return _short_ay(page["assessment_year"])
    text = " ".join(filter(None, [page.get("document_period"), page.get("document_title"), page.get("forensic_summary")]))
    m = re.search(r"F\.?\s*Y\.?[^0-9]*(?:20)?(\d{2})\s*[-–/]\s*(?:20)?(\d{2})", text, re.I)
    if m:
        return f"20{int(m.group(1)) + 1:02d}-{int(m.group(2)) + 1:02d}"
    return _short_ay(page.get("document_period")) or _short_ay(page.get("document_title"))


def _age(dob: Optional[str], on: date) -> Optional[str]:
    if not dob:
        return None
    for fmt in ("%d/%m/%Y", "%d-%m-%Y", "%Y-%m-%d"):
        try:
            d = datetime.strptime(dob.strip(), fmt).date()
            years = on.year - d.year - ((on.month, on.day) < (d.month, d.day))
            return f"{years} Years"
        except ValueError:
            continue
    return None


def _years_since(dmy: Optional[str], on: date) -> Optional[str]:
    if not dmy:
        return None
    try:
        d = datetime.strptime(dmy, "%d/%m/%Y").date()
    except ValueError:
        return None
    years = on.year - d.year - ((on.month, on.day) < (d.month, d.day))
    return f"{years} Years (since {dmy})"


def _strip_regional_suffix(val: Optional[str]) -> Optional[str]:
    # The PWA's Marital Status dropdown stores a bilingual value, e.g. "Married (પરિણિત)" -
    # fonts used for the report have no Gujarati glyphs, so that suffix prints as black boxes.
    return re.sub(r"\s*\([^)]*\)\s*$", "", val).strip() if val else val


def _title(name: Optional[str]) -> Optional[str]:
    if not name:
        return None
    return " ".join(w.capitalize() for w in name.split())


def _salutation(gender: Optional[str], marital: Optional[str]) -> str:
    g = (gender or "").upper()
    if g == "MALE":
        return "Mr."
    if g == "FEMALE":
        return "Mrs." if "married" in (marital or "").lower() and "un" not in (marital or "").lower() else "Ms."
    return ""


def _first(pages: List[Dict[str, Any]], field: str, types: Optional[set] = None) -> Optional[Any]:
    for p in pages:
        if p.get(field) and (types is None or p.get("doc_type") in types):
            return p[field]
    return None


def _pick_best_pan_verification_page(pages: List[Dict[str, Any]]) -> List[str]:
    """
    From a person's PAN_CARD / PAN_VERIFICATION_REPORT pages, select ONLY the single best
    PAN Verification Report image (Know Your PAN / NSDL / Income Tax e-filing verification page),
    falling back to the PAN card image only if no verification report page exists.
    Never returns both the physical PAN card and the verification report for the same person.
    """
    cands = [
        p for p in pages
        if p.get("doc_type") in ("PAN_CARD", "PAN_VERIFICATION_REPORT")
        and (p.get("local_path") or p.get("image_url"))
    ]
    if not cands:
        return []

    def _score(p: Dict[str, Any]) -> int:
        s = 0
        dt = (p.get("doc_type") or "").upper()
        sub = (p.get("doc_sub_type") or "").upper()
        meta_text = f"{p.get('document_title') or ''} {p.get('forensic_summary') or ''} {p.get('original_filename') or ''}".upper()
        if dt == "PAN_VERIFICATION_REPORT":
            s += 100
        if sub == "BACK":
            s += 80
        elif sub == "FRONT":
            s -= 20
        if any(k in meta_text for k in ("VERIF", "KNOW YOUR", "NSDL", "E-FILING", "EFILING", "PORTAL", "JAO", "JURISDICTION", "ACTIVE")):
            s += 60
        local_p = _resolve_local_image_path(p.get("local_path") or p.get("image_url"))
        if local_p and os.path.exists(local_p):
            try:
                from PIL import Image as _PilImg
                with _PilImg.open(local_p) as im:
                    w, h = im.size
                # Full-page PAN Verification Report printouts are portrait (h > w), whereas cropped PAN cards are landscape
                if h > w * 1.05:
                    s += 35
            except Exception:
                pass
        return s

    best = max(cands, key=_score)
    best_path = best.get("local_path") or best.get("image_url")
    return [best_path] if best_path else []


def _person(pages: List[Dict[str, Any]], all_pages: List[Dict[str, Any]], on: date,
            contact: Optional[str] = None, marital: Optional[str] = None,
            community: Optional[str] = None, qualification: Optional[str] = None,
            office_form: Optional[Dict[str, Any]] = None, fallback_name: Optional[str] = None,
            itr_ack_no: Optional[str] = None, itr_filing_date: Optional[str] = None) -> Dict[str, Any]:
    office_form = office_form or {}
    ident = {"AADHAAR_CARD", "PAN_CARD"}
    name = _first(pages, "holder_name", ident) or _first(pages, "holder_name") or fallback_name
    gender = _first(pages, "gender", {"AADHAAR_CARD", "PAN_CARD"}) or _first(pages, "gender")
    dob = _first(pages, "date_of_birth", {"AADHAAR_CARD", "PAN_CARD", "EMPLOYEE_ID_CARD"}) or _first(pages, "date_of_birth")
    designation = _first(pages, "designation", {"EMPLOYEE_ID_CARD"}) or _first(pages, "designation")
    employer = _first(pages, "employer_name")
    workplace = next((p.get("extracted_address") for p in pages if p.get("address_type") == "WORKPLACE" and p.get("extracted_address")), None)
    doj = _first(pages, "date_of_joining", {"EMPLOYEE_ID_CARD"}) or _first(pages, "date_of_joining")
    has_salary = any(p.get("doc_type") in ("SALARY_SLIP", "FORM_16") for p in pages)

    # The field agent's own office_details/office_details_co submission is a physical,
    # on-site verification - it takes priority over whatever a scanned document happened
    # to say, for every field the questionnaire actually asks. OCR only fills in what the
    # form doesn't collect (employee code, years of experience from date of joining).
    form_firm_name = office_form.get("firm_name") or None
    form_address = office_form.get("address") or None
    form_position = office_form.get("position") or office_form.get("designation") or None
    form_occupation = office_form.get("occupation") or None

    # A salaried applicant's income proof is FORM_16; a self-employed/business applicant has
    # none - their equivalent is ITR_ACKNOWLEDGEMENT (ack no / filing date),
    # COMPUTATION_OF_INCOME (Return Assessment Statement / Computation of Total Income), and/or
    # PROFIT_LOSS_BALANCE_SHEET, scanned as their own doc types.
    ITR_INCOME_DOC_TYPES = {"FORM_16", "ITR_ACKNOWLEDGEMENT", "COMPUTATION_OF_INCOME", "PROFIT_LOSS_BALANCE_SHEET"}
    itr: Dict[str, Dict[str, Any]] = {}
    itr_pages = sorted(
        (p for p in pages if p.get("doc_type") in ITR_INCOME_DOC_TYPES),
        key=lambda p: p.get("page_number") if isinstance(p.get("page_number"), int) else 0,
    )
    known_ays = [_ay_of(p) for p in itr_pages if _ay_of(p)]
    default_ay = known_ays[0] if len(set(known_ays)) == 1 else None
    for p in itr_pages:
        ay = _ay_of(p) or default_ay
        inc_val = _inr(p.get("annual_taxable_income") or p.get("annual_gross_salary"))
        ack_val = p.get("itr_acknowledgement_number")
        dt_val = p.get("document_date")
        if not ay and not inc_val and not ack_val:
            # Continuation/schedule page with no A.Y., no total income, and no ack number
            continue
        ay = ay or "Verified"
        row = itr.setdefault(ay, {"ay": ay, "ack_no": None, "filed_on": None, "total_income": None,
                                  "status": "Income Tax Return / Form 16 / Assessment Statement Verified"})
        row["total_income"] = row["total_income"] or inc_val
        row["ack_no"] = row["ack_no"] or ack_val or itr_ack_no
        row["filed_on"] = row["filed_on"] or dt_val or itr_filing_date
        if row["total_income"]:
            row["status"] = "Income Tax Return / Computation of Income Verified"

    # If an income/assessment document was scanned on record (itr_pages is non-empty) yet every
    # page lacked a parsed A.Y./income/ack_no, still emit a verified row from the first page so
    # Annexure C reflects the uploaded document rather than claiming no document is on record.
    if not itr and itr_pages:
        first_p = itr_pages[0]
        ay_fallback = _ay_of(first_p) or "Verified"
        itr[ay_fallback] = {
            "ay": ay_fallback,
            "ack_no": first_p.get("itr_acknowledgement_number") or itr_ack_no or "Verified on Record",
            "filed_on": first_p.get("document_date") or itr_filing_date or "Verified",
            "total_income": _inr(first_p.get("annual_taxable_income") or first_p.get("annual_gross_salary")),
            "status": "Income Tax Return / Form 16 / Assessment Statement Verified",
        }

    # No Form 16 / ITR Acknowledgement / Computation of Income document was scanned for this
    # person, but the field agent recorded an acknowledgement no. / filing date on-site (e.g.
    # the applicant showed the e-filing portal/SMS rather than a printed copy) - that
    # verification must still appear here rather than the report showing no ITR row at all.
    if not itr and (itr_ack_no or itr_filing_date):
        itr["NA"] = {
            "ay": "NA", "ack_no": itr_ack_no, "filed_on": itr_filing_date, "total_income": None,
            "status": "Income Tax Return filed - acknowledgement recorded on-site by the field agent (supporting document not scanned)",
        }

    # Premises Owner Name is now suggested to the agent in the same "(Name) Relation" format as
    # the residence Owner Name field (e.g. "( Rajesh Patel ) Landlord") - the DOCX template has a
    # separate "Relation with Applicant" cell for the office premises owner that stayed NA even
    # when a relation was typed, because nothing parsed it out of the combined string.
    premises_owner_raw = office_form.get("premises_owner") or ""
    _premises_owner_match = re.match(r"^\s*\(([^)]+)\)\s*(.*)$", premises_owner_raw)
    if _premises_owner_match:
        office_premises_owner = _premises_owner_match.group(1).strip() or None
        office_owner_relation = _premises_owner_match.group(2).strip() or None
    else:
        office_premises_owner = premises_owner_raw.strip() or None
        office_owner_relation = None
    # Same reasoning as residence's Owner Name: this person owning their own business premises
    # has no natural "(Self)" to type - detect the name match instead of leaving NA.
    if office_premises_owner and not office_owner_relation and name and (_name_score(office_premises_owner, name) or 0) >= 85:
        office_owner_relation = "Self"

    # Office "Who did you meet" is plain free text in the PWA (no relation dropdown like
    # residence's) - still parse an optional "Name - Phone (Relation)" in case an agent typed
    # one, then fall back to self-detection: a self-employed/proprietor applicant met at their
    # own shop is routinely themselves, with no natural way to type "(Self)" after their own name.
    office_met_raw = office_form.get("who_meet") or ""
    _office_met_match = re.match(r"^\s*([^-()]+?)\s*(?:-\s*([\d\s+]{7,15}))?\s*(?:\(([^)]+)\))?\s*$", office_met_raw)
    if _office_met_match:
        office_met_name = _office_met_match.group(1).strip() or None
        office_met_contact = (_office_met_match.group(2) or "").strip() or None
        office_met_relation = (_office_met_match.group(3) or "").strip() or None
    else:
        office_met_name = office_met_raw.strip() or None
        office_met_contact = None
        office_met_relation = None
    if office_met_name and not office_met_relation and name and (_name_score(office_met_name, name) or 0) >= 85:
        office_met_relation = "Self"
    # Same reasoning as residence: no need to make the agent write down a phone number that's
    # already on file as this person's own contact.
    if office_met_relation == "Self" and not office_met_contact:
        office_met_contact = contact

    sal = _salutation(gender, marital)
    display = f"{sal} {_title(name)}".strip() if name else ""
    return {
        "name": _title(name),
        "display_name": display,
        "contact": contact,
        "dob": dob.replace("/", "-") if dob else None,
        "age": _age(dob, on),
        "gender": gender.capitalize() if gender else None,
        "marital_status": _strip_regional_suffix(marital),
        "community": community,
        "pan": _first(pages, "extracted_pan", {"PAN_CARD"}) or _first(pages, "extracted_pan"),
        "aadhaar": _first(pages, "extracted_aadhaar", {"AADHAAR_CARD"}),
        "father_name": _first(pages, "father_or_spouse_name", ident),
        "qualification": qualification,
        "occupation": form_occupation or ((f"Service — {_title(designation)}" if designation else "Service") if has_salary else None),
        "itr": sorted(itr.values(), key=lambda r: r["ay"], reverse=True)[:3],
        "office": {
            "firm_name": form_firm_name or (_title(workplace.split(",")[0]) if workplace else _title(employer)),
            "address": form_address or workplace,
            "landmark": office_form.get("landmark") or None,
            "firm_type": office_form.get("firm_type") or None,
            "premises_ownership": office_form.get("premises_ownership") or None,
            "premises_owner": office_premises_owner,
            "owner_relation": office_owner_relation,
            "employees": office_form.get("employees") or None,
            "nameboard": office_form.get("nameboard") or None,
            "infrastructure": office_form.get("infrastructure") or None,
            # pdf_generator.py reads this straight off the field-visit form's own free-text
            # "experience"/"period_of_stay" answer (there's no separate date-of-joining field
            # captured for a self-employed/business applicant) - computing it from doj here
            # instead meant it was almost always None for exactly the applicants who reach this
            # section (is_working with no salaried employment), printing a blank "...for ." in
            # the Working Details narrative even though the PDF shows the real answer.
            "area": office_form.get("area") or None,
            "period_of_stay": office_form.get("period_of_stay") or office_form.get("established_since") or None,
            "experience": _years_since(doj, on) or office_form.get("experience") or office_form.get("period_of_stay") or None,
            "established_since": office_form.get("established_since") or None,
            "location": office_form.get("location") or None,
            "assets": office_form.get("assets") or None,
            "references": [
                tuple((r.split(" - ", 1) + [""])[:2]) if " - " in r else (r, "")
                for r in [office_form.get("reference_1") or office_form.get("reference"), office_form.get("reference_2")]
                if r
            ],
            "who_meet": office_form.get("who_meet") or None,
            # cpv_report_builder.py's _fill_office() reads a nested met.name/contact/relation
            # (same shape as residence's "met"), not the flat "who_meet" string above - without
            # this, the real who-we-met answer (already showing correctly in the PDF, which reads
            # office.get("who_meet") directly) printed as NA in the DOCX even when captured.
            "met": {"name": office_met_name, "contact": office_met_contact, "relation": office_met_relation},
            "assessment": office_form.get("assessment") or "POSITIVE",
            # The ID card carries the official employee code; payslips often print box numbers.
            # Falls back to the field visit form's manually-typed Reg No. / UDYAM / GST number
            # when nothing was OCR'd (e.g. a self-employed applicant with no ID card to scan).
            "reg_or_emp_no": _first(pages, "employee_code", {"EMPLOYEE_ID_CARD"}) or office_form.get("reg_no") or None,
            "position": _title(form_position) if form_position else _title(designation),
        },
        "_has_pan_card": any(p.get("doc_type") in ("PAN_CARD", "PAN_VERIFICATION_REPORT") for p in pages),
        "_has_aadhaar": any(p.get("doc_type") == "AADHAAR_CARD" for p in pages),
        "_employer": _title(employer),
        "_workplace": workplace,
        "_doj": doj,
        "_designation": _title(designation),
        "_pan_pages": _pick_best_pan_verification_page(pages),
    }


def _bank(all_pages: List[Dict[str, Any]], summary_bank: Optional[Dict[str, Any]], account_status: Optional[str] = None, account_type: Optional[str] = None) -> Dict[str, Any]:
    # A manually-entered account_status (from the field visit form) must still show up even
    # when no bank statement was ever OCR'd - returning {} here discarded it entirely, which
    # is exactly the gap that left the co-applicant's bank status permanently "Not Captured"
    # no matter what the field agent typed, since no co-applicant bank summary exists at all.
    if not summary_bank and not account_status:
        return {}
    summary_bank = summary_bank or {}
    bank_pages = [p for p in all_pages if p.get("doc_type") == "BANK_STATEMENT"]
    branch = next((p.get("extracted_address") for p in bank_pages if p.get("address_type") == "BRANCH" and p.get("extracted_address")), None)
    has_account = bool(summary_bank.get("account_number") or summary_bank.get("bank_name"))
    return {
        "bank_name": _title(summary_bank.get("bank_name")) if summary_bank else None,
        "account_number": summary_bank.get("account_number") if summary_bank else None,
        "branch": (branch or (f"IFSC {summary_bank['ifsc_code']}" if summary_bank.get("ifsc_code") else None)) if summary_bank else None,
        "account_status": account_status,
        "account_type": account_type or ("Savings / Operative Account" if has_account else None),
    }


def _form(loan_case: LoanCase) -> Dict[str, Any]:
    try:
        data = json.loads(loan_case.field_form_data or "{}")
        return data if isinstance(data, dict) else {}
    except (TypeError, ValueError):
        return {}


def _resolve_local_image_path(p: Optional[str]) -> Optional[str]:
    if not p:
        return None
    if os.path.exists(p):
        return p
    norm = p.replace("\\", "/")
    if norm.startswith("/storage/"):
        candidate = os.path.join("storage_uploads", norm[len("/storage/"):])
        if os.path.exists(candidate):
            return candidate
    if norm.startswith("/static/"):
        candidate = os.path.join("app", "static", norm[len("/static/"):])
        if os.path.exists(candidate):
            return candidate
    if norm.startswith("/"):
        candidate = norm[1:]
        if os.path.exists(candidate):
            return candidate
    return None


async def assemble_cpv_report_data(
    db: AsyncSession,
    loan_case: LoanCase,
    pages: List[Dict[str, Any]],
    *,
    udin: Optional[str] = None,
    overall_status: Optional[str] = None,
    file_allotted_by: Optional[str] = None,
    verifier_names: Optional[List[str]] = None,
    include_co_applicant: Optional[bool] = None,
    report_date: Optional[date] = None,
) -> Dict[str, Any]:
    on = report_date or date.today()
    pages = [dict(p) for p in pages if p.get("scan_status") != "FAILED"]
    applicant_name = assign_relationships(pages, loan_case.applicant_name, loan_case.co_applicant_name) or loan_case.applicant_name
    summary = reconcile_case_documents(pages, loan_case.applicant_name, loan_case.co_applicant_name)
    # The dashboard saves this literal placeholder when a case is created without typing a real
    # address (awaiting a later AI/manual correction) - it must never be treated as an actual,
    # verified address in a bank-facing report.
    target_address = loan_case.target_address if loan_case.target_address != "Pending AI Extraction" else None
    from app.services.field_form_pdf_ingest import enrich_field_form_defaults
    form = enrich_field_form_defaults(
        _form(loan_case),
        applicant_name=applicant_name,
        target_address=target_address,
    )

    # The PWA submits "occupation" at both the top level of the form AND nested inside
    # office_details - but older/incomplete submissions only ever had the top-level one (no
    # office_details object at all, e.g. a case where the agent never opened the Office Details
    # module). Without this fallback, _person() read occupation from office_details alone, so
    # those cases always resolved to occupation=None, which cpv_report_builder.py's is_working
    # check then misread as "Housewife / Homemaker" - printing that false claim, and leaving the
    # entire Office Verification Annexure blank, for applicants with a perfectly real stated
    # occupation such as "Business".
    applicant_office_form = dict(form.get("office_details") or {})
    applicant_office_form.setdefault("occupation", form.get("occupation"))

    own = [p for p in pages if p.get("relationship_to_applicant") == "SELF"]
    applicant = _person(own, pages, on, contact=loan_case.applicant_phone or form.get("contact_number") or None,
                        marital=form.get("marital_status") or None,
                        community=form.get("community") or None, qualification=form.get("qualification") or None,
                        office_form=applicant_office_form,
                        itr_ack_no=form.get("itr_acknowledgement_no") or None, itr_filing_date=form.get("itr_filing_date") or None)
    applicant["bank"] = _bank(pages, (summary.get("applicant") or {}).get("bank_account"), form.get("bank_account_status") or None)
    if not applicant["name"]:
        applicant["name"] = _title(applicant_name)
        applicant["display_name"] = applicant["name"]

    # Co-applicant. The CA's own explicit designation on the case record (set via the New Case
    # Intake / Edit Case applicant-count stepper) is the ONLY thing that may turn this on - never
    # AI document classification alone. "Other person" documents in the scanned bundle (co_pages
    # below) are real and useful for filling in a CONFIRMED co-applicant's details, but using
    # their mere presence to invent a co-applicant section was a confirmed false positive in
    # production: a single-applicant case (co_applicant_name never set) printed "The co-applicant,
    # Vikramkumar Himmatlal Shah, has submitted the KYC documents" because one of the applicant's
    # OWN business documents was garbled by OCR into a near-identical variant of his own name
    # ("Himmatmal Jain" vs "Himmatlal Shah") and misclassified as a different person. That kind of
    # signal belongs in the cross-check "other persons" warning shown to the CA for review, not
    # asserted as fact in a certified report. The CA can still force this off via
    # include_co_applicant=False even when co_applicant_name is set.
    co = None
    others = [p for p in pages if p.get("relationship_to_applicant") == "DIFFERENT_PERSON"]
    groups: List[Tuple[str, List[Dict[str, Any]]]] = []
    for p in others:
        g = next((g for g in groups if (_name_score(p.get("holder_name"), g[0]) or 0) >= 80), None)
        if g is None:
            groups.append((p.get("holder_name") or "", [p]))
        else:
            g[1].append(p)
    candidates = [g for g in groups if any(p.get("doc_type") in CO_APPLICANT_DOC_TYPES for p in g[1])]
    co_pages: List[Dict[str, Any]] = []
    if candidates:
        best = max(candidates, key=lambda g: len(g[1]))
        co_pages = best[1]
    if include_co_applicant is not False and loan_case.co_applicant_name:
        co = _person(co_pages, pages, on, contact=loan_case.co_applicant_phone,
                    office_form=form.get("office_details_co"), fallback_name=loan_case.co_applicant_name)
        co["bank"] = _bank(co_pages, None, form.get("bank_account_status_co") or None)
        if not co["pan"]:
            co["pan"] = _first(co_pages, "extracted_pan")

    # Visit / field facts (only once the agent has actually visited)
    visit = (await db.execute(
        select(VisitRecord).where(VisitRecord.case_id == loan_case.id).order_by(VisitRecord.check_in_time.desc())
    )).scalars().first()
    visited = bool(visit) or bool(form)
    visit_date = visit.check_in_time.strftime("%d/%m/%Y") if visit else None
    agent = None
    if loan_case.assigned_agent_id:
        agent = (await db.execute(select(User).where(User.id == loan_case.assigned_agent_id))).scalar_one_or_none()

    refs = [
        (tuple(p.strip() for p in r.split(" - ", 1)) if " - " in str(r) else (str(r).strip(), "Neighbour"))
        for r in (form.get("neighbour_1"), form.get("neighbour_2"))
        if r and str(r).strip()
    ]
    # The PWA's Owner Name field is a single string in the form "(Name) Relation" (e.g.
    # "(Ranjanba Vaghela) Mother in law") - there's no separate relation input. pdf_generator.py
    # already parses this out into owner_name/owner_relation; this used to just hardcode
    # owner_relation to None and pass the raw "(Name) Relation" string through as owner_name
    # unparsed, printing "Relation with Applicant: NA" even when the relation was right there.
    owner_raw = form.get("owner_name") or ""
    _owner_match = re.match(r"^\s*\(([^)]+)\)\s*(.*)$", owner_raw)
    if _owner_match:
        res_owner_name = _owner_match.group(1).strip() or None
        res_owner_relation = _owner_match.group(2).strip() or None
    else:
        res_owner_name = owner_raw.strip() or None
        res_owner_relation = None
    # When the applicant owns the property themselves, there's no natural way to type a
    # "(Self)" relation suffix in the Owner Name box - the owner name IS the applicant's own
    # name. Detect that match instead of leaving a confusing NA next to the applicant's own name.
    if res_owner_name and not res_owner_relation and applicant_name and (_name_score(res_owner_name, applicant_name) or 0) >= 85:
        res_owner_relation = "Self"

    # Family Members is filled in separately (Module 2) and is already a reliable source of
    # name -> relation - built here, ahead of "Who did you meet" below, so that field can fall
    # back to it instead of requiring the agent to type the same relation twice.
    family = []
    fm = form.get("family_members")
    if isinstance(fm, list):
        for m in fm:
            if isinstance(m, dict):
                family.append({k: m.get(k) for k in ("name", "relation", "age", "earning")})

    # "Who did you meet" is suggested to the field agent as "Name - Phone (Relation)" (e.g.
    # "Rajesh Patel - 9876543210 (Husband)") but was only ever stored/shown as one raw string -
    # the DOCX template has separate Name/Contact/Relation cells for this (_fill_residence's
    # met.name/contact/relation) that stayed blank even when the agent typed a relation, because
    # nothing ever parsed it out. Same regex approach as Owner Name above.
    met_raw_str = form.get("person_met") or ""
    _met_match = re.match(r"^\s*([^-()]+?)\s*(?:-\s*([\d\s+]{7,15}))?\s*(?:\(([^)]+)\))?\s*$", met_raw_str)
    if _met_match:
        met_name = _met_match.group(1).strip() or None
        met_contact = (_met_match.group(2) or "").strip() or None
        met_relation = (_met_match.group(3) or "").strip() or None
    else:
        met_name = met_raw_str.strip() or None
        met_contact = None
        met_relation = None
    # No relation typed (just a bare name, e.g. "Amitaben Jain") - the Family Members list
    # already has this person's relation on file if they're a family member, so use it instead
    # of leaving a confusing NA when the relation is genuinely already known.
    if met_name and not met_relation:
        fam_match = next((m for m in family if m.get("name") and (_name_score(met_name, m["name"]) or 0) >= 80), None)
        if fam_match and fam_match.get("relation"):
            met_relation = fam_match["relation"]
    # Same reasoning as Owner Name above: the applicant themselves answering their own door has
    # no natural "(Self)" to type either.
    if met_name and not met_relation and applicant_name and (_name_score(met_name, applicant_name) or 0) >= 85:
        met_relation = "Self"
    # The agent didn't need to write down a phone number for someone whose contact is already
    # on file as the applicant's own - fall back to it instead of showing NA next to "Self".
    if met_relation == "Self" and not met_contact:
        met_contact = loan_case.applicant_phone or form.get("contact_number") or None

    residence = {
        "verified_address": target_address if visited else None,
        "aadhaar_address": (summary.get("applicant") or {}).get("residential_address"),
        "landmark": form.get("landmark") or None,
        "references": [(n, r) for n, r in refs if n],
        "building_type": form.get("building_type") or None,
        "floor": form.get("floor") or None,
        "stay_period": form.get("period_of_stay") or None,
        "ownership": form.get("ownership") or None,
        "owner_name": res_owner_name,
        "owner_relation": res_owner_relation,
        "nameboard": form.get("nameboard_visible") or None,
        # Nature of Building / General Appearance / Locality / Surroundings / Evidence supporting
        # proof are now real fields in the PWA field-visit form (added per CA office request so
        # every field in the report has an actual capture source instead of always being NA).
        "nature": form.get("building_nature") or None,
        "appearance": form.get("general_appearance") or None,
        "locality": form.get("locality") or None,
        "surroundings": form.get("surroundings") or None,
        "evidence": form.get("residence_evidence_obtained") or None,
        "assets": form.get("assets_observed") or None,
        # A holistic CA judgment, not a raw observed fact with its own PWA field - the PDF
        # generator has always hardcoded this to POSITIVE (absent any specific flag raised
        # elsewhere in the report) rather than leaving it NA; match that here instead of this
        # being the one remaining field where the two reports visibly disagreed.
        "assessment": "POSITIVE",
        "met": {"name": met_name, "contact": met_contact, "relation": met_relation},
    }

    # Narrative (summary page) — facts on record only
    a_name = applicant["display_name"] or applicant["name"] or "the applicant"
    if visited:
        res = [
            f"A residence verification was conducted for the applicant, {a_name}, at the following address Viz: {target_address or 'address pending confirmation'}"
            + (f", on {visit_date}." if visit_date else "."),
        ]
        if residence["met"]["name"] or residence["stay_period"]:
            res.append(" ".join(filter(None, [
                f"The verification was carried out through interaction with {residence['met']['name']}." if residence["met"]["name"] else None,
                f"Period of stay at the said address as informed: {residence['stay_period']}." if residence["stay_period"] else None,
            ])))
        if residence["building_type"] or residence["ownership"]:
            res.append(" ".join(filter(None, [
                f"The property is a {residence['building_type']}." if residence["building_type"] else None,
                f"Residence is {residence['ownership']}." if residence["ownership"] else None,
            ])))
    else:
        res = [f"A residence verification visit for the applicant, {a_name}, at {target_address or 'the address on file'} is pending."]

    work = []
    if applicant["office"].get("firm_name") or applicant["office"].get("address") or applicant["_employer"] or applicant["_workplace"]:
        work.append(
            f"The applicant, {a_name}, is employed"
            + (f" as {applicant['office'].get('position') or applicant['_designation']}" if (applicant["office"].get("position") or applicant["_designation"]) else "")
            + (f" with {applicant['office']['firm_name']}" if applicant["office"].get("firm_name") else "")
            + (f" ({applicant['_employer']})" if applicant["_employer"] and applicant["_employer"] != applicant["office"].get("firm_name") else "")
            + (f", since {applicant['_doj']}" if applicant["_doj"] else "")
            + "."
        )
        if applicant["office"].get("address"):
            work.append("Physical verification of the employer premises was conducted.")
        else:
            work.append("Physical verification of the employer premises is pending.")
    if co and (co["office"].get("firm_name") or co["office"].get("address")):
        co_name = co.get("display_name") or co.get("name") or "the co-applicant"
        work.append(
            f"The co-applicant, {co_name}, is employed"
            + (f" as {co['office'].get('position')}" if co["office"].get("position") else "")
            + (f" with {co['office']['firm_name']}" if co["office"].get("firm_name") else "")
            + "."
        )
        work.append("Physical verification of the co-applicant's employer premises was conducted." if co["office"].get("address") else "Physical verification of the co-applicant's employer premises is pending.")

    itr_lines = ["No Income Tax Return acknowledgements were included in the documents provided."]
    f16 = []
    for label, person in (("the applicant", applicant), ("the co-applicant", co)):
        if person and person["itr"]:
            f16.append(f"for {label}, {person['name']}, for A.Y. " + ", ".join(r["ay"] for r in person["itr"]))
    if f16:
        itr_lines.append("Form No. 16 was provided for our verification " + "; and ".join(f16) + ".")

    def _kyc(label: str, person: Dict[str, Any]) -> str:
        docs = []
        if person.get("_has_pan_card") and person.get("pan"):
            docs.append(f"PAN Card ({person['pan']})")
        if person.get("_has_aadhaar") and person.get("aadhaar"):
            docs.append(f"Aadhaar Card ({person['aadhaar']})")
        if docs:
            return f"The {label}, {person['display_name'] or person['name']}, has submitted the KYC documents: {', '.join(docs)}."
        tail = f" PAN {person['pan']} appears on the Form No. 16 provided." if person.get("pan") else ""
        return f"KYC documents of the {label}, {person['display_name'] or person['name']}, are not included in the documents provided.{tail}"

    kyc = [_kyc("applicant", applicant)] + ([_kyc("co-applicant", co)] if co else [])

    site_docs = (await db.execute(
        select(CaseDocument).where(CaseDocument.case_id == loan_case.id, CaseDocument.doc_type.in_(SITE_PHOTO_TYPES))
        .order_by(CaseDocument.created_at)
    )).scalars().all()
    residence_photos = []
    for d in _resolve_slot_photos(site_docs):
        resolved = _resolve_local_image_path(d.watermarked_url or d.storage_url)
        if resolved and resolved not in residence_photos:
            residence_photos.append(resolved)

    # NEVER fall back to another case's extracted-photos folder here - a bank-certified report
    # must show only this applicant's own evidence or honestly show none, never a different
    # real applicant's photos picked up from an unrelated case's directory.
    case_extracted_photos = os.path.join("app", "static", "extracted_pages", str(loan_case.id), "field_photos")

    if not residence_photos and os.path.exists(case_extracted_photos):
        residence_photos = [
            os.path.join(case_extracted_photos, f) for f in sorted(os.listdir(case_extracted_photos))
            if f.startswith("page_9_img_") and f.endswith((".jpeg", ".jpg", ".png")) and os.path.getsize(os.path.join(case_extracted_photos, f)) > 10000
        ]

    # Was only ever looking for a literal "page_10_img_*" file in one specific case's old
    # PDF-burst output folder - a leftover from one original demo case's own file layout, not a
    # real lookup for THIS case's actual office evidence. Every real case's office photos are
    # CaseDocument rows (OFFICE_FACADE/OFFICE_NAMEBOARD/OFFICE_INTERIOR/OFFICE_SELFIE/WORK_OFFICE,
    # same as the field PWA's Office Evidence folder uploads), exactly like residence_photos
    # above already queries for the residence equivalent - this silently printed zero office
    # photos in the DOCX for every single real case, even when they were right there in the DB
    # and the PDF report (a separate code path) showed them correctly.
    office_site_docs = (await db.execute(
        select(CaseDocument).where(CaseDocument.case_id == loan_case.id, CaseDocument.doc_type.in_(OFFICE_PHOTO_TYPES))
        .order_by(CaseDocument.created_at)
    )).scalars().all()
    office_photos = []
    for d in _resolve_slot_photos(office_site_docs):
        resolved = _resolve_local_image_path(d.watermarked_url or d.storage_url)
        if resolved and resolved not in office_photos:
            office_photos.append(resolved)

    # Always prefer an explicitly uploaded PAN_VERIFICATION_REPORT row if present on the case
    pan_verif_rows = (await db.execute(
        select(CaseDocument).where(
            CaseDocument.case_id == loan_case.id,
            CaseDocument.doc_type == DocumentType.PAN_VERIFICATION_REPORT,
        ).order_by(CaseDocument.created_at.desc())
    )).scalars().all()
    pan_photos = []
    for d in pan_verif_rows:
        res_p = _resolve_local_image_path(d.watermarked_url or d.storage_url)
        if res_p and res_p not in pan_photos:
            pan_photos.append(res_p)
            break
    if not pan_photos:
        for p in applicant["_pan_pages"] + ((co or {}).get("_pan_pages") or []):
            res_p = _resolve_local_image_path(p)
            if res_p and res_p not in pan_photos:
                pan_photos.append(res_p)
    if not pan_photos:
        pan_doc_rows = (await db.execute(
            select(CaseDocument).where(
                CaseDocument.case_id == loan_case.id,
                CaseDocument.doc_type == DocumentType.PAN_CARD,
            ).order_by(CaseDocument.created_at.desc())
        )).scalars().all()
        if pan_doc_rows:
            cand_dicts = []
            for d in pan_doc_rows:
                od = d.ocr_data if isinstance(d.ocr_data, dict) else {}
                cand_dicts.append({
                    "doc_type": "PAN_CARD",
                    "doc_sub_type": od.get("doc_sub_type"),
                    "document_title": od.get("document_title"),
                    "forensic_summary": od.get("forensic_summary"),
                    "original_filename": od.get("original_filename"),
                    "local_path": d.watermarked_url or d.storage_url,
                })
            for p in _pick_best_pan_verification_page(cand_dicts):
                res_p = _resolve_local_image_path(p)
                if res_p and res_p not in pan_photos:
                    pan_photos.append(res_p)
    if not pan_photos and os.path.exists(case_extracted_photos):
        p8 = os.path.join(case_extracted_photos, "page_8_img_2.jpeg")
        if os.path.exists(p8):
            pan_photos.append(p8)

    # The signature block is left blank on purpose so the CA signs the printed report by hand -
    # auto-pasting a scanned signature image into every generated report was a demo/specimen
    # leftover, not something that should go out on a real bank-facing certified document. This
    # used to still auto-paste whenever CA_SIGNATURE_IMAGE_PATH happened to be set in the
    # environment (it was, on production) - per explicit CA office instruction, never insert an
    # image here at all, full stop; matches the PDF, which has never pasted one either.
    sig_path = None

    from app.services.field_form_pdf_ingest import resolve_effective_loan_amount
    effective_loan_amount = resolve_effective_loan_amount(loan_case.loan_amount, form)
    loan_type = loan_case.loan_type
    if effective_loan_amount:
        loan_type = f"{loan_type} – Rs. {_inr(str(int(round(effective_loan_amount))))}/-"

    raw_exec = (agent.full_name if agent else None) or form.get("executive") or form.get("executive_name")
    resolved_verifiers: List[str] = []
    if verifier_names:
        resolved_verifiers = [str(n).strip() for n in verifier_names if str(n).strip()]
    elif raw_exec:
        parts = [p.strip() for p in re.split(r"\s*(?:&|/|,|\band\b)\s*", str(raw_exec), flags=re.IGNORECASE) if p.strip()]
        resolved_verifiers = [_title(p) or p for p in parts]

    resolved_allotted_by = (
        file_allotted_by
        or form.get("file_allotted_by")
        or form.get("allotted_by")
        or (f"{loan_case.bank_name}, {loan_case.branch}" if loan_case.branch else loan_case.bank_name)
    )

    return {
        "loan_type": loan_type,
        "bank_branch": f"{loan_case.bank_name}, {loan_case.branch}" if loan_case.branch else loan_case.bank_name,
        "report_date": on.strftime("%d.%m.%Y"),
        "certificate_date": on.strftime("%d/%m/%Y"),
        "applicant": applicant,
        "co_applicant": co,
        "verifier_names": resolved_verifiers,
        "file_allotted_by": resolved_allotted_by,
        "overall_status": overall_status or "POSITIVE",
        "family": family,
        "residence": residence,
        "narrative": {"res": res, "work": work, "itr": itr_lines, "kyc": kyc},
        "photos": {"pan": pan_photos, "residence": residence_photos, "office": office_photos},
        "udin": udin,
        "place": "Ahmedabad",
        "signature_path": sig_path,
        "cross_check": summary,
    }
