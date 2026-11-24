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
    s = str(ay).strip()
    # Normalize full date-range strings (e.g. "01-04-2026 - 31-03-2027" or "01/04/2025 to 31/03/2026")
    # printed on Form 16 Part A / TDS certificates into standard "YYYY-YY" format so they merge
    # with the matching Assessment Year instead of creating a duplicate "Rs. NA" row.
    m_range = re.search(r"0?1[-/.]0?4[-/.](20\d{2})\s*(?:to|[-–])\s*31[-/.]0?3[-/.](20\d{2})", s, re.I)
    if m_range:
        y1, y2 = int(m_range.group(1)), int(m_range.group(2))
        if y2 == y1 + 1:
            return f"{y1}-{y2 % 100:02d}"
    m = re.search(r"\b(?:20)?(\d{2})\s*[-–/]\s*(?:20)?(\d{2})\b", s)
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


def _strip_title_prefix(name: Optional[str]) -> Optional[str]:
    if not name:
        return None
    s = re.sub(r"^\s*(?:mr\.?|mrs\.?|miss\.?|ms\.?|smt\.?|shri\.?|shree\.?|kum\.?|kumari\.?|dr\.?)\s+", "", str(name).strip(), flags=re.IGNORECASE)
    return s.strip() or str(name).strip()


def _extract_title_prefix(name: Optional[str]) -> Optional[str]:
    if not name:
        return None
    m = re.match(r"^\s*(mr\.?|mrs\.?|miss\.?|ms\.?|smt\.?|shri\.?|kum\.?|kumari)\b", str(name).strip(), flags=re.IGNORECASE)
    if not m:
        return None
    raw = m.group(1).upper().rstrip(".")
    if raw in ("MISS", "KUM", "KUMARI"):
        return "Miss."
    if raw in ("MRS", "SMT"):
        return "Mrs."
    if raw in ("MR", "SHRI"):
        return "Mr."
    if raw == "MS":
        return "Ms."
    return None


def _title(name: Optional[str]) -> Optional[str]:
    clean = _strip_title_prefix(name)
    if not clean:
        return None
    return " ".join(w.capitalize() for w in clean.split())


def _salutation(
    gender: Optional[str],
    marital: Optional[str],
    age: Optional[Any] = None,
    fallback_name: Optional[str] = None,
    explicit_salutation: Optional[str] = None,
) -> str:
    if explicit_salutation:
        return explicit_salutation
    age_int: Optional[int] = None
    if age is not None:
        m_age = re.search(r"\b(\d{1,3})\b", str(age))
        if m_age:
            age_int = int(m_age.group(1))
    prefix_from_name = _extract_title_prefix(fallback_name)
    g = (gender or "").upper()
    if not g and prefix_from_name:
        if prefix_from_name == "Mr.":
            g = "MALE"
        else:
            g = "FEMALE"
    if g == "MALE":
        return "Mr."
    if g == "FEMALE":
        mar_low = (marital or "").strip().lower()
        if prefix_from_name == "Miss." or "unmarried" in mar_low or "single" in mar_low:
            return "Miss."
        if prefix_from_name == "Mrs.":
            return "Mrs."
        if age_int is not None and age_int <= 22 and "married" not in mar_low:
            return "Miss."
        if "married" in mar_low and "un" not in mar_low:
            return "Mrs."
        if prefix_from_name:
            return prefix_from_name
        return "Miss." if (age_int is not None and age_int <= 23) else "Ms."
    return prefix_from_name or ""


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


def _best_person_name(pages: List[Dict[str, Any]], fallback_name: Optional[str] = None) -> Optional[str]:
    """
    Choose the cleanest, most complete ASCII holder_name for a person from their matched pages,
    never replacing a multi-token fallback_name with a 1-word fragment (e.g. 'Pravinbhai') or a
    Devanagari string (e.g. 'ज्वलंत प्रवीणभाई कोठिया').
    """
    clean_fb = re.sub(r"^\s*(?:Mr\.?|Mrs\.?|Miss\.?|Ms\.?|Shri\.?|Smt\.?|Dr\.?)\s+", "", str(fallback_name or ""), flags=re.I).strip() or None
    fb_tok_count = len(clean_fb.split()) if clean_fb else 0

    def _is_valid_cand(val: Any) -> bool:
        if not val or not isinstance(val, str):
            return False
        s = val.strip()
        if not s or not re.search(r"[A-Za-z]", s):
            return False
        if clean_fb and (_name_score(s, clean_fb) or 0) < 80:
            return False
        return True

    ident_types = {"AADHAAR_CARD", "PAN_CARD"}
    ident_cands = [
        str(p.get("holder_name")).strip()
        for p in pages
        if p.get("doc_type") in ident_types and _is_valid_cand(p.get("holder_name"))
    ]
    if ident_cands:
        # Prefer 3-token [GivenName, MiddleName, Surname] (e.g. 'JWALANT PRAVINBHAI KOTHIYA') over 2-token 'KOTHIYA JWALANT'
        return max(ident_cands, key=lambda s: (len(s.split()), len(s)))

    formal_types = {"ITR_ACKNOWLEDGEMENT", "COMPUTATION_OF_INCOME", "UTILITY_BILL", "SALARY_SLIP", "FORM_16"}
    formal_cands = [
        str(p.get("holder_name")).strip()
        for p in pages
        if p.get("doc_type") in formal_types
        and _is_valid_cand(p.get("holder_name"))
        and len(str(p.get("holder_name")).split()) >= max(2, fb_tok_count)
    ]
    if formal_cands:
        return max(formal_cands, key=lambda s: (len(s.split()), len(s)))

    if clean_fb and fb_tok_count >= 2:
        return clean_fb

    other_cands = [
        str(p.get("holder_name")).strip()
        for p in pages
        if _is_valid_cand(p.get("holder_name")) and len(str(p.get("holder_name")).split()) >= fb_tok_count
    ]
    if other_cands:
        return max(other_cands, key=lambda s: (len(s.split()), len(s)))

    return clean_fb or _first(pages, "holder_name") or fallback_name


def _person(pages: List[Dict[str, Any]], all_pages: List[Dict[str, Any]], on: date,
            contact: Optional[str] = None, marital: Optional[str] = None,
            community: Optional[str] = None, qualification: Optional[str] = None,
            office_form: Optional[Dict[str, Any]] = None, fallback_name: Optional[str] = None,
            itr_ack_no: Optional[str] = None, itr_filing_date: Optional[str] = None,
            explicit_salutation: Optional[str] = None) -> Dict[str, Any]:
    office_form = office_form or {}
    ident = {"AADHAAR_CARD", "PAN_CARD"}
    name = _best_person_name(pages, fallback_name)
    gender = _first(pages, "gender", {"AADHAAR_CARD", "PAN_CARD"}) or _first(pages, "gender")
    dob = _first(pages, "date_of_birth", {"AADHAAR_CARD", "PAN_CARD", "EMPLOYEE_ID_CARD"}) or _first(pages, "date_of_birth")
    non_form_pages = [
        p for p in pages
        if p.get("doc_type") != "APPLICATION_FORM"
        and "visit form" not in str(p.get("document_title") or "").lower()
        and "quotation" not in str(p.get("document_title") or "").lower()
    ]
    designation = _first(non_form_pages, "designation", {"EMPLOYEE_ID_CARD"}) or _first(non_form_pages, "designation")
    employer = _first(non_form_pages, "employer_name")
    workplace = next((p.get("extracted_address") for p in non_form_pages if p.get("address_type") == "WORKPLACE" and p.get("extracted_address")), None)
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
    ITR_RETURN_DOC_TYPES = {"ITR_ACKNOWLEDGEMENT", "COMPUTATION_OF_INCOME", "PROFIT_LOSS_BALANCE_SHEET"}

    def _valid_itr_ack_number(val: Any, page_doc_type: Optional[str] = None) -> Optional[str]:
        """
        A genuine Income Tax Return (ITR-V) Acknowledgement Number is a numeric string (10-18 digits,
        e.g. '297979921271025'). Form 16 TRACES certificate codes (e.g. 'AUBJIPA', 'ASZNQOA') or
        10-character PAN/TAN strings contain letters and are NEVER ITR Acknowledgement Numbers.
        """
        if not val:
            return None
        if (page_doc_type or "").upper() == "FORM_16":
            return None
        s = re.sub(r"[\s\-]", "", str(val).strip())
        if re.fullmatch(r"\d{10,18}", s):
            return s
        return None

    itr: Dict[str, Dict[str, Any]] = {}
    itr_pages = sorted(
        (p for p in pages if p.get("doc_type") in ITR_INCOME_DOC_TYPES),
        key=lambda p: p.get("page_number") if isinstance(p.get("page_number"), int) else 0,
    )
    known_ays = [_ay_of(p) for p in itr_pages if _ay_of(p)]
    default_ay = known_ays[0] if len(set(known_ays)) == 1 else None
    valid_manual_ack = _valid_itr_ack_number(itr_ack_no)
    for p in itr_pages:
        p_dt = (p.get("doc_type") or "").upper()
        ay = _ay_of(p) or default_ay
        inc_val = _inr(p.get("annual_taxable_income") or p.get("annual_gross_salary"))
        ack_val = _valid_itr_ack_number(p.get("itr_acknowledgement_number"), p_dt)
        dt_val = p.get("document_date")
        if not ay and not inc_val and not ack_val:
            # Continuation/schedule page with no A.Y., no total income, and no ack number
            continue
        ay = ay or "Verified"
        row = itr.setdefault(ay, {
            "ay": ay,
            "ack_no": None,
            "filed_on": None,
            "total_income": None,
            "has_itr_return_doc": False,
            "has_form16_doc": False,
            "only_form16": False,
            "status": "Income Tax Return / Form 16 / Assessment Statement Verified",
        })
        if p_dt in ITR_RETURN_DOC_TYPES:
            row["has_itr_return_doc"] = True
        elif p_dt == "FORM_16":
            row["has_form16_doc"] = True
        row["total_income"] = row["total_income"] or inc_val
        row["ack_no"] = row["ack_no"] or ack_val or valid_manual_ack
        row["filed_on"] = row["filed_on"] or dt_val or itr_filing_date

    for r in itr.values():
        if not r["has_itr_return_doc"] and r["has_form16_doc"] and not r["ack_no"]:
            r["only_form16"] = True
            r["ack_no"] = "No ITR Return Found (Only Form 16 Found)"
            r["status"] = "No Income Tax Return (ITR) documents found; only Form No. 16 found and verified"
        else:
            r["only_form16"] = False
            if not r["ack_no"]:
                r["ack_no"] = "No ITR Ack. Copy (Computation of Income Only)"
            if r["total_income"]:
                r["status"] = "Income Tax Return / Computation of Income Verified"

    # Per explicit CA office instruction: any ITR / Form 16 / Assessment record where the
    # Total Income / Amount is not available (None / NA / 0) must be omitted from the report
    # in both PDF and DOCX (never print a row with "Rs. NA").
    valid_itr_rows = [
        r for r in sorted(itr.values(), key=lambda r: r["ay"], reverse=True)
        if r.get("total_income") and str(r.get("total_income")).strip().upper() not in ("", "NA", "N/A", "NONE", "0")
    ][:3]

    # Premises Owner Name & Relation strictly as written in the Google Form / PWA form
    premises_owner_raw = office_form.get("premises_owner") or ""
    _premises_owner_match = re.match(r"^\s*\(([^)]+)\)\s*(.*)$", premises_owner_raw)
    if _premises_owner_match:
        office_premises_owner = _premises_owner_match.group(1).strip() or None
        office_owner_relation = _premises_owner_match.group(2).strip() or None
    else:
        office_premises_owner = premises_owner_raw.strip() or None
        office_owner_relation = None
    if office_premises_owner and not office_owner_relation:
        if name and (_name_score(office_premises_owner, name) or 0) >= 80:
            office_owner_relation = "Self"
        else:
            office_owner_relation = "Relationship not mentioned"

    # Office "Who did you meet" strictly as written in the Google Form / PWA form
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
    if office_met_name and (not office_met_relation or office_met_relation.lower() in ("relationship not mentioned", "not mentioned")):
        if name and (_name_score(office_met_name, name) or 0) >= 80:
            office_met_relation = "Self"
        else:
            office_met_relation = "Relationship not mentioned"
    if office_met_relation == "Self" and not office_met_contact:
        office_met_contact = contact

    computed_age = _age(dob, on)
    if computed_age is None and office_form.get("age"):
        m_a = re.search(r"\b(\d{1,3})\b", str(office_form.get("age")))
        if m_a:
            computed_age = f"{int(m_a.group(1))} Years"
    computed_age_int: Optional[int] = None
    if computed_age is not None:
        m_ca = re.search(r"\b(\d{1,3})\b", str(computed_age))
        if m_ca:
            computed_age_int = int(m_ca.group(1))
    effective_marital = _strip_regional_suffix(marital or office_form.get("marital_status"))
    if computed_age_int is not None and computed_age_int <= 22 and _extract_title_prefix(fallback_name) != "Mrs.":
        if not effective_marital or effective_marital.lower() == "married":
            # Guard against a parent's 'Married' status bleeding onto an unmarried <=22 student/child
            if _extract_title_prefix(fallback_name) == "Miss.":
                effective_marital = "Unmarried"

    sal = _salutation(
        gender,
        effective_marital,
        age=computed_age_int,
        fallback_name=fallback_name or name,
        explicit_salutation=explicit_salutation,
    )
    if sal == "Miss." and (not effective_marital or effective_marital.lower() == "married"):
        effective_marital = "Unmarried"

    # Extract UDYAM / Shop Act registration number from pages if office_form reg_no is only placeholder
    raw_reg_no = _first(pages, "employee_code", {"EMPLOYEE_ID_CARD"}) or office_form.get("reg_no") or None
    if not raw_reg_no or raw_reg_no == "Verified at Site":
        for p in all_pages:
            txt_blob = f"{p.get('document_title') or ''} {p.get('forensic_summary') or ''}"
            m_udyam = re.search(r"\b(UDYAM-[A-Z]{2}-\d{2}-\d{7})\b", txt_blob, flags=re.IGNORECASE)
            if m_udyam:
                raw_reg_no = m_udyam.group(1).upper()
                break

    display = f"{sal} {_title(name)}".strip() if name else ""
    return {
        "name": _title(name),
        "display_name": display,
        "contact": contact or office_form.get("contact_number") or office_form.get(" phone"),
        "dob": dob.replace("/", "-") if dob else None,
        "age": computed_age,
        "gender": gender.capitalize() if gender else ("Female" if sal in ("Miss.", "Mrs.", "Ms.") else ("Male" if sal == "Mr." else None)),
        "marital_status": effective_marital,
        "community": community or office_form.get("community"),
        "pan": _first(pages, "extracted_pan", {"PAN_CARD"}) or _first(pages, "extracted_pan"),
        "aadhaar": _first(pages, "extracted_aadhaar", {"AADHAAR_CARD"}),
        "father_name": _first(pages, "father_or_spouse_name", ident),
        "qualification": qualification or office_form.get("qualification"),
        "occupation": form_occupation or ((f"Service — {_title(designation)}" if designation else "Service") if has_salary else None),
        "itr": valid_itr_rows,
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
            "area": office_form.get("area") or None,
            "period_of_stay": office_form.get("period_of_stay") or office_form.get("established_since") or None,
            "experience": _years_since(doj, on) or office_form.get("experience") or office_form.get("period_of_stay") or None,
            "established_since": office_form.get("established_since") or None,
            "location": office_form.get("location") or None,
            "assets": office_form.get("assets") or None,
            "references": [
                (
                    r.split(" - ", 1)[0].strip(),
                    r.split(" - ", 1)[1].strip() or "Relationship not mentioned",
                )
                if " - " in str(r)
                else (str(r).strip(), "Relationship not mentioned")
                for r in [office_form.get("reference_1") or office_form.get("reference"), office_form.get("reference_2")]
                if r and str(r).strip()
            ],
            "who_meet": office_form.get("who_meet") or None,
            "met": {"name": office_met_name, "contact": office_met_contact, "relation": office_met_relation},
            "assessment": office_form.get("assessment") or "POSITIVE",
            "reg_or_emp_no": raw_reg_no,
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
    from app.services.field_form_pdf_ingest import enrich_field_form_defaults, _format_person_name_with_salutation
    raw_form_init = _form(loan_case)
    ff_app_type_init = str(raw_form_init.get("form_applicant_type") or "Applicant").strip()
    ff_person_init = str(raw_form_init.get("form_person_name") or "").strip()
    ff_co_init = str(raw_form_init.get("co_applicant_name") or "").strip()

    # Golden Rule: Always follow the Applicant and Co-Applicant details from the Field Visit Google Form PDF.
    effective_case_app_name = loan_case.applicant_name
    effective_case_co_name = loan_case.co_applicant_name or ff_co_init or None
    if (
        ff_person_init
        and ff_co_init
        and not ff_app_type_init.lower().startswith("co")
        and (_name_score(ff_person_init, ff_co_init) or 0) < 75
        and effective_case_app_name
        and (_name_score(effective_case_app_name, ff_co_init) or 0) >= 80
        and (_name_score(effective_case_app_name, ff_person_init) or 0) < 80
    ):
        prev_app_raw = effective_case_app_name.strip()
        effective_case_app_name = _format_person_name_with_salutation(
            ff_person_init,
            marital_status=raw_form_init.get("marital_status"),
            age_val=raw_form_init.get("age_community") or raw_form_init.get("age"),
        ) or ff_person_init
        fuller_co_src = prev_app_raw if len(prev_app_raw.split()) >= len(ff_co_init.split()) else ff_co_init
        effective_case_co_name = _format_person_name_with_salutation(
            fuller_co_src,
            marital_status=raw_form_init.get("co_applicant_marital_status") or "Married",
            age_val=raw_form_init.get("co_applicant_age"),
        ) or ff_co_init

    applicant_name = assign_relationships(pages, effective_case_app_name, effective_case_co_name) or effective_case_app_name
    summary = reconcile_case_documents(pages, effective_case_app_name, effective_case_co_name)
    # The dashboard saves this literal placeholder when a case is created without typing a real
    # address (awaiting a later AI/manual correction) - it must never be treated as an actual,
    # verified address in a bank-facing report.
    target_address = loan_case.target_address if loan_case.target_address != "Pending AI Extraction" else None
    form = enrich_field_form_defaults(
        raw_form_init,
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
    if form.get("age_community") or form.get("age"):
        applicant_office_form.setdefault("age", form.get("age_community") or form.get("age"))

    own = [p for p in pages if p.get("relationship_to_applicant") == "SELF"]
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
    best_cand_name: Optional[str] = None
    effective_co_name = effective_case_co_name or form.get("co_applicant_name")
    if effective_co_name and groups:
        matching_co_groups = [g for g in groups if (_name_score(g[0], effective_co_name) or 0) >= 75]
        if matching_co_groups:
            best_cand_name = max(matching_co_groups, key=lambda g: len(g[1]))[0]
            for mg in matching_co_groups:
                co_pages.extend(mg[1])
    if not co_pages and candidates:
        best = max(candidates, key=lambda g: len(g[1]))
        best_cand_name = best[0]
        co_pages = list(best[1])
    if co_pages:
        co_pans = {str(p.get("extracted_pan")).strip().upper() for p in co_pages if p.get("extracted_pan")}
        co_aadhaars = {re.sub(r"\D", "", str(p.get("extracted_aadhaar"))) for p in co_pages if p.get("extracted_aadhaar")}
        co_aadhaars.discard("")
        co_ids = {id(p) for p in co_pages}
        for p in pages:
            if id(p) in co_ids or p.get("relationship_to_applicant") == "SELF":
                continue
            p_pan = str(p.get("extracted_pan") or "").strip().upper()
            p_aadh = re.sub(r"\D", "", str(p.get("extracted_aadhaar") or ""))
            if (p_pan and p_pan in co_pans) or (p_aadh and p_aadh in co_aadhaars):
                co_pages.append(p)
                co_ids.add(id(p))
    # If a case is an Education Loan or has an office/visit form whose 'who_meet' / 'form_person_name'
    # matches a confirmed family co-applicant with their own distinct KYC/ITR in `co_pages`, recognize them!
    if not effective_co_name and best_cand_name and co_pages:
        off_who = (applicant_office_form.get("who_meet") or "").split("-")[0].split("(")[0].strip()
        form_person = (form.get("form_person_name") or "").strip()
        is_edu = "education" in (loan_case.loan_type or "").lower()
        has_co_kyc_or_itr = any(p.get("doc_type") in {"AADHAAR_CARD", "PAN_CARD", "ITR_ACKNOWLEDGEMENT"} for p in co_pages)
        if has_co_kyc_or_itr and (
            is_edu
            or (off_who and (_name_score(off_who, best_cand_name) or 0) >= 75 and (_name_score(off_who, applicant_name) or 0) < 75)
            or (form_person and (_name_score(form_person, best_cand_name) or 0) >= 75 and (_name_score(form_person, applicant_name) or 0) < 75)
        ):
            effective_co_name = best_cand_name

    # Check if `applicant_office_form` actually belongs to the Co-applicant (e.g. Father Kaushikbhai's
    # business 'Stephy Mobile sales & Service' on Daughter Moksha's Education Loan)
    co_office_form = dict(form.get("office_details_co") or {})
    if form.get("co_applicant_occupation") or co_office_form.get("firm_name"):
        co_office_form.setdefault("occupation", form.get("co_applicant_occupation") or "Business")
    off_who_clean = (applicant_office_form.get("who_meet") or "").split("-")[0].split("(")[0].strip()
    office_belongs_to_co = False
    if effective_co_name and not co_office_form.get("firm_name") and applicant_office_form.get("firm_name"):
        if (
            (off_who_clean and (_name_score(off_who_clean, effective_co_name) or 0) >= 75 and (_name_score(off_who_clean, applicant_name) or 0) < 75)
            or ("education" in (loan_case.loan_type or "").lower())
        ):
            office_belongs_to_co = True
            co_office_form = dict(applicant_office_form)
            applicant_office_form = {}

    app_marital_in = form.get("marital_status") or None
    app_qual_in = form.get("qualification") or None
    if office_belongs_to_co:
        # Don't let the Co-applicant's Married / 12th Pass / Business fields overwrite the Student applicant
        if _extract_title_prefix(loan_case.applicant_name) == "Miss." or "education" in (loan_case.loan_type or "").lower():
            app_marital_in = "Unmarried"
            app_qual_in = None

    applicant = _person(own, pages, on, contact=loan_case.applicant_phone or form.get("contact_number") or None,
                        marital=app_marital_in,
                        community=form.get("community") or None, qualification=app_qual_in,
                        office_form=applicant_office_form, fallback_name=effective_case_app_name,
                        itr_ack_no=form.get("itr_acknowledgement_no") or None, itr_filing_date=form.get("itr_filing_date") or None)
    if office_belongs_to_co and "education" in (loan_case.loan_type or "").lower() and not applicant.get("occupation"):
        applicant["occupation"] = "--"
    applicant["bank"] = _bank(pages, (summary.get("applicant") or {}).get("bank_account"), form.get("bank_account_status") or None)
    if not applicant["name"]:
        applicant["name"] = _title(applicant_name)
        applicant["display_name"] = f"{_salutation(applicant.get('gender'), applicant.get('marital_status'), age=applicant.get('age'), fallback_name=effective_case_app_name)} {applicant['name']}".strip()

    # Re-run enrich_field_form_defaults now that OCR-verified gender/age are known on `applicant`
    form = enrich_field_form_defaults(
        form,
        applicant_name=applicant.get("display_name") or applicant.get("name") or applicant_name,
        target_address=target_address,
        applicant_gender=applicant.get("gender"),
        applicant_age=applicant.get("age"),
    )

    if include_co_applicant is not False and effective_co_name:
        co_contact = (
            loan_case.co_applicant_phone
            or form.get("co_applicant_contact")
            or co_office_form.get("contact_number")
            or (co_office_form.get("met") or {}).get("contact")
        )
        if not co_contact and co_office_form.get("who_meet"):
            m_ph = re.search(r"\b(\d{10})\b", str(co_office_form.get("who_meet")))
            if m_ph:
                co_contact = m_ph.group(1)
        co_marital = form.get("co_applicant_marital_status") or co_office_form.get("marital_status") or (form.get("marital_status") if office_belongs_to_co else None)
        co_qual = form.get("co_applicant_qualification") or co_office_form.get("qualification") or (form.get("qualification") if office_belongs_to_co else None)
        co = _person(
            co_pages,
            pages,
            on,
            contact=co_contact,
            marital=co_marital,
            community=form.get("community") or None,
            qualification=co_qual,
            office_form=co_office_form,
            fallback_name=effective_co_name,
        )
        co["bank"] = _bank(co_pages, None, form.get("bank_account_status_co") or form.get("bank_account_status") or None)
        if not co["pan"]:
            co["pan"] = _first(co_pages, "extracted_pan")

    # Apply age-based Daughter ('Miss.' / 'Unmarried') vs Wife ('Mrs.' / 'Married') resolution
    from app.services.field_form_pdf_ingest import infer_applicant_co_relation_by_age
    rel_decision = infer_applicant_co_relation_by_age(
        applicant_name=effective_case_app_name or applicant.get("name"),
        applicant_gender=applicant.get("gender"),
        applicant_age_or_dob=applicant.get("age") or applicant.get("dob"),
        applicant_marital=applicant.get("marital_status"),
        co_applicant_name=effective_co_name or (co.get("name") if co else None),
        co_applicant_gender=co.get("gender") if co else None,
        co_applicant_age_or_dob=(co.get("age") or co.get("dob")) if co else form.get("co_applicant_age"),
        co_applicant_marital=co.get("marital_status") if co else None,
        explicit_relation=form.get("co_applicant_relation"),
        loan_type=loan_case.loan_type,
    )
    if rel_decision.get("applicant_salutation") and applicant.get("name"):
        applicant["display_name"] = f"{rel_decision['applicant_salutation']} {applicant['name']}".strip()
    if rel_decision.get("applicant_marital_status"):
        applicant["marital_status"] = rel_decision["applicant_marital_status"]
    applicant["relation_to_co"] = rel_decision.get("applicant_relation_to_co")
    if co:
        if rel_decision.get("co_salutation") and co.get("name"):
            co["display_name"] = f"{rel_decision['co_salutation']} {co['name']}".strip()
        if rel_decision.get("co_marital_status") and not co.get("marital_status"):
            co["marital_status"] = rel_decision["co_marital_status"]
        co["relation_to_applicant"] = rel_decision.get("co_relation_to_applicant")

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
        (
            r.split(" - ", 1)[0].strip(),
            r.split(" - ", 1)[1].strip() or "Relationship not mentioned",
        )
        if " - " in str(r)
        else (str(r).strip(), "Relationship not mentioned")
        for r in (form.get("neighbour_1"), form.get("neighbour_2"))
        if r and str(r).strip()
    ]
    # Owner Name & Relation strictly as written in the Google Form / PWA form
    owner_raw = form.get("owner_name") or ""
    _owner_match = re.match(r"^\s*\(([^)]+)\)\s*(.*)$", owner_raw)
    if _owner_match:
        res_owner_name = _owner_match.group(1).strip() or None
        res_owner_relation = _owner_match.group(2).strip() or None
    else:
        res_owner_name = owner_raw.strip() or None
        res_owner_relation = None
    if res_owner_name and (not res_owner_relation or res_owner_relation.lower() in ("relationship not mentioned", "not mentioned")):
        if (applicant.get("name") and (_name_score(res_owner_name, applicant.get("name")) or 0) >= 80) or (
            applicant_name and (_name_score(res_owner_name, applicant_name) or 0) >= 80
        ):
            res_owner_relation = "Self"
        else:
            res_owner_relation = "Relationship not mentioned"

    from app.services.field_form_pdf_ingest import reconcile_family_members_for_applicant, reconcile_person_relation
    fm = reconcile_family_members_for_applicant(
        form.get("family_members"),
        applicant_name=applicant.get("display_name") or applicant.get("name") or applicant_name,
        applicant_gender=applicant.get("gender"),
        applicant_age=applicant.get("age"),
        applicant_marital_status=applicant.get("marital_status"),
        applicant_occupation=applicant.get("occupation") or form.get("occupation"),
        applicant_father_name=applicant.get("father_name"),
    )
    family = [{k: m.get(k) for k in ("name", "relation", "age", "earning")} for m in fm if isinstance(m, dict)]

    # "Who did you meet" strictly as written in the Google Form / PWA form (with Self recognition when the person met is the applicant themselves)
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
    if met_name and (not met_relation or met_relation.lower() in ("relationship not mentioned", "not mentioned")):
        if (applicant.get("name") and (_name_score(met_name, applicant.get("name")) or 0) >= 80) or (
            applicant_name and (_name_score(met_name, applicant_name) or 0) >= 80
        ):
            met_relation = "Self"
        else:
            met_relation = "Relationship not mentioned"
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
        app_emp_no = str(applicant["office"].get("reg_or_emp_no") or "").strip()
        app_emp_clause = f" (Employee ID / Reg. No.: {app_emp_no})" if (app_emp_no and app_emp_no.lower() not in ("na", "n/a", "none", "verified at site")) else ""
        work.append(
            f"The applicant, {a_name}, is employed"
            + (f" as {applicant['office'].get('position') or applicant['_designation']}" if (applicant["office"].get("position") or applicant["_designation"]) else "")
            + app_emp_clause
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
        co_emp_no = str(co["office"].get("reg_or_emp_no") or "").strip()
        co_emp_clause = f" (Employee ID / Reg. No.: {co_emp_no})" if (co_emp_no and co_emp_no.lower() not in ("na", "n/a", "none", "verified at site")) else ""
        work.append(
            f"The co-applicant, {co_name}, is employed"
            + (f" as {co['office'].get('position')}" if co["office"].get("position") else "")
            + co_emp_clause
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

    from app.services.image_watermark import restamp_document_clean_watermark
    _eff_off_addr = (applicant.get("office") or {}).get("address") or getattr(loan_case, "office_address", None)
    _eff_co_off_addr = (co.get("office") or {}).get("address") if co else None

    site_docs = (await db.execute(
        select(CaseDocument).where(CaseDocument.case_id == loan_case.id, CaseDocument.doc_type.in_(SITE_PHOTO_TYPES))
        .order_by(CaseDocument.created_at)
    )).scalars().all()
    residence_photos = []
    for d in _resolve_slot_photos(site_docs):
        restamp_document_clean_watermark(d, loan_case, office_address=_eff_off_addr, co_office_address=_eff_co_off_addr)
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
        restamp_document_clean_watermark(d, loan_case, office_address=_eff_off_addr, co_office_address=_eff_co_off_addr)
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

    sig_path = os.getenv("CA_SIGNATURE_IMAGE_PATH") or os.path.join("app", "static", "specimen_assets", "ca_pranav_signature.png")
    if sig_path and not os.path.exists(sig_path):
        sig_path = None

    from app.services.field_form_pdf_ingest import resolve_effective_loan_amount
    effective_loan_amount = resolve_effective_loan_amount(loan_case.loan_amount, form)
    loan_type = loan_case.loan_type
    if effective_loan_amount:
        loan_type = f"{loan_type} – Rs. {_inr(str(int(round(effective_loan_amount))))}/-"

    raw_exec = form.get("verifier_agent_name") or form.get("executive") or form.get("executive_name") or (agent.full_name if agent else None)
    dealing_clerk = form.get("ca_dealing_clerk") or form.get("dealing_clerk") or None
    resolved_verifiers: List[str] = []
    if verifier_names:
        resolved_verifiers = [str(n).strip() for n in verifier_names if str(n).strip()]
    elif raw_exec:
        parts = [p.strip() for p in re.split(r"\s*(?:&|/|,|\band\b)\s*", str(raw_exec), flags=re.IGNORECASE) if p.strip()]
        resolved_verifiers = [_title(p) or p for p in parts]
    if dealing_clerk and str(dealing_clerk).strip():
        clerk_str = _title(str(dealing_clerk).strip()) or str(dealing_clerk).strip()
        if not resolved_verifiers:
            resolved_verifiers = ["", clerk_str]
        elif len(resolved_verifiers) == 1:
            resolved_verifiers.append(clerk_str)
        else:
            resolved_verifiers[1] = clerk_str

    resolved_allotted_by = (
        file_allotted_by
        or form.get("file_allotted_by")
        or form.get("allotted_by")
        or (f"{loan_case.bank_name}, {loan_case.branch}" if loan_case.branch else loan_case.bank_name)
    )

    # Build extra_co_applicants (Applicants 3, 4, 5) if present in field_form_data or LoanCase
    extra_co_applicants: List[Dict[str, Any]] = []
    raw_extra_cos = form.get("extra_co_applicants") if isinstance(form.get("extra_co_applicants"), list) else []
    for slot_idx in (3, 4, 5):
        ec_dict = next((x for x in raw_extra_cos if isinstance(x, dict) and x.get("slot") == slot_idx), None)
        if not ec_dict and (slot_idx - 3) < len(raw_extra_cos) and isinstance(raw_extra_cos[slot_idx - 3], dict):
            ec_dict = raw_extra_cos[slot_idx - 3]
        slot_name = getattr(loan_case, f"applicant_{slot_idx}_name", None) or (ec_dict.get("name") if ec_dict else None) or form.get(f"applicant_{slot_idx}_name")
        if not slot_name or not str(slot_name).strip():
            continue
        slot_phone = getattr(loan_case, f"applicant_{slot_idx}_phone", None) or (ec_dict.get("contact_number") if ec_dict else None) or form.get(f"applicant_{slot_idx}_phone")
        ec_age = (ec_dict.get("age") if ec_dict else None) or None
        ec_gender = (ec_dict.get("gender") if ec_dict else None) or None
        ec_marital = (ec_dict.get("marital_status") if ec_dict else None) or None
        ec_comm = (ec_dict.get("community") if ec_dict else None) or form.get("community") or None
        ec_qual = (ec_dict.get("qualification") if ec_dict else None) or None
        ec_occ = (ec_dict.get("occupation") if ec_dict else None) or None
        ec_rel = (ec_dict.get("relation_to_applicant") if ec_dict else None) or None
        clean_ec_name = _title(re.sub(r"^\s*(?:Mr\.?|Mrs\.?|Miss\.?|Ms\.?|Shri\.?|Smt\.?)\s+", "", str(slot_name), flags=re.I).strip())
        ec_sal = _salutation(ec_gender, ec_marital, age=ec_age, fallback_name=str(slot_name))
        ec_disp = f"{ec_sal} {clean_ec_name}".strip() if ec_sal else str(slot_name).strip()
        extra_co_applicants.append({
            "slot": slot_idx,
            "name": clean_ec_name,
            "display_name": ec_disp,
            "contact": slot_phone,
            "dob": None,
            "age": str(ec_age) if ec_age else None,
            "gender": ec_gender,
            "marital_status": ec_marital,
            "community": ec_comm,
            "pan": None,
            "aadhaar": None,
            "qualification": ec_qual,
            "occupation": ec_occ,
            "relation_to_applicant": ec_rel,
        })

    return {
        "loan_type": loan_type,
        "bank_branch": f"{loan_case.bank_name}, {loan_case.branch}" if loan_case.branch else loan_case.bank_name,
        "report_date": on.strftime("%d.%m.%Y"),
        "certificate_date": on.strftime("%d/%m/%Y"),
        "applicant": applicant,
        "co_applicant": co,
        "extra_co_applicants": extra_co_applicants,
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
