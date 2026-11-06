"""
Extracts a completed field-visit questionnaire (originally a Google Form export PDF, used by
the CA office before this system had its own PWA form) into exactly the same field_form_data
JSON shape the PWA's own submitDueDiligenceForm() produces - so a backlog case whose field visit
is already done, just never typed into the PWA, can skip the manual re-entry entirely and go
straight to report generation.

Deliberately does NOT touch KYC documents or photos - those already have their own working
ingestion paths (AI Ingest Bank Folder/PDF, Manual Upload, the PWA's own photo capture). This is
scoped to the Residential/Office/Family/Previous-Loan questionnaire data only.
"""
import logging
import os
from typing import Any, Dict, List, Optional

import httpx

from app.core.config import settings
from app.services.pdf_separator import _parse_model_json

try:
    import pymupdf as fitz
except ImportError:
    try:
        import fitz
    except ImportError:
        fitz = None

logger = logging.getLogger(__name__)

REQUEST_TIMEOUT_SECONDS = 180.0
MAX_ATTEMPTS = 2

EXTRACTION_PROMPT = """You are reading a completed "Due Diligence Visit Form" (a Google Form
export, English with Gujarati translations in parentheses){applicant_hint}. Each
question shows its selected radio/checkbox option, or the text the field agent typed, directly
below or next to the question label - read the SELECTED/TYPED answer only, never a label or an
unselected option. The form spans several page images, in order; some sections (e.g. Office
Details, Previous Loan) may not apply and will be genuinely blank - use null, never guess.

A relation to the applicant is sometimes written inline after a name in parentheses, e.g.
"Himmatlal jain ( Father )" or "Amitaben Jain - 9426399468" (no relation given). Extract the name
and relation as SEPARATE fields wherever the schema below has both - never leave the relation
embedded in the name field, and never invent a relation that wasn't actually written.

Return ONLY a JSON object with exactly these keys:
{{
  "bank_name": "Bank name if mentioned anywhere (e.g. 'Union Bank of India', 'Bank of Baroda', 'State Bank of India', 'HDFC Bank', 'ICICI Bank', or in title like 'Due Diligence Details From - Union Bank', or question 'Bank Name'), string or null",
  "branch_name": "Branch name if mentioned in the form (e.g. 'Chandkheda', 'Gota Branch', etc.), string or null",
  "executive_name": "string or null",
  "applicant_type": "Applicant | Co-applicant | Guarantor - whichever radio is selected at the top, or null",
  "name": "applicant/co-applicant/guarantor's own name, string or null",
  "contact_number": "string or null",
  "marital_status": "Married | Unmarried | null",
  "age": "string or null (e.g. '52')",
  "community": "Hindu | Muslim | Christian | null",
  "qualification": "Post Graduate | Graduate | 12th Pass | 10th Pass | 8th Pass | null",
  "co_applicant_name": "Co-applicant full name if mentioned anywhere in the form, string or null",
  "co_applicant_contact": "Co-applicant phone number if mentioned, string or null",
  "co_applicant_address": "Co-applicant address if mentioned, string or null",
  "family_members": [
    {{"name": "string", "age": "string", "relation": "string", "earning": "Yes or No"}}
  ],
  "address_visited": "string or null",
  "residence_ownership": "Rented | Owned | Government Provided | Company Provided | null",
  "residence_references": [{{"name": "string", "relation": "string"}}],
  "residence_building_type": "Bungalow | Flat | Independent House | null",
  "residence_bhk": "e.g. '1 BHK', '2 BHK', '3 BHK' or null",
  "duration_of_stay": "string or null (e.g. '2.5 years')",
  "residence_owner_name": "string or null - name only, no relation",
  "residence_owner_relation": "string or null - e.g. 'Father', 'Self', 'Mother in law'",
  "nameboard_visibility_residence": "string or null - whatever was typed/selected, e.g. 'Yes' or 'No'",
  "residence_assets_visible": ["list of checked items, e.g. 'AC', 'FAN', 'CCTV'"],
  "who_met_residence_name": "string or null - name only",
  "who_met_residence_contact": "string or null - phone number if given",
  "who_met_residence_relation": "string or null - only if explicitly written, never guessed",
  "occupation": "Business | Job | House Wife | Retired | Pensioner | null",
  "work_from_home": "Yes | No | null",
  "firm_name": "string or null",
  "company_type": "Proprietorship | Partnership | Private Limited | LLP | Corporation | Public Limited | string (if Other, the typed value) | null",
  "office_address": "string or null",
  "office_period_of_stay": "string or null",
  "office_number_of_workers": "string or null",
  "office_nameboard_visibility": "string or null - whatever was typed/selected",
  "office_infrastructure": "Office | Shop | Factory | School | Hospital | College | Clinic | Shed | string (if Other) | null",
  "office_ownership": "Owned | Rented | NA | null",
  "office_owner_name": "string or null - name only, no relation",
  "office_owner_relation": "string or null",
  "position_or_nature_of_business": "string or null",
  "office_assets_visible": ["list of checked items"],
  "office_references": [{{"name": "string", "relation": "string"}}],
  "who_met_office_name": "string or null - name only",
  "who_met_office_contact": "string or null",
  "who_met_office_relation": "string or null - only if explicitly written",
  "loan_type": "Home | Car | Education | Personal | string (if Other) | null",
  "loan_amount": "string or null",
  "previous_loan_bank": "string or null",
  "dealership_date": "string or null (DD/MM/YYYY as printed)",
  "visit_date": "Date of field visit (DD/MM/YYYY) if mentioned or timestamped, string or null"
}}"""


def _call_gemini_extraction(image_paths: List[str], applicant_name: str) -> Dict[str, Any]:
    api_key = settings.OPENROUTER_API_KEY
    model = settings.OPENROUTER_EXTRACTION_MODEL or "google/gemini-2.5-flash"
    base_url = settings.OPENROUTER_BASE_URL or "https://openrouter.ai/api/v1"
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY is not configured on the server")

    import base64
    import mimetypes

    applicant_hint = f" for applicant {applicant_name}" if applicant_name and applicant_name.lower() != "unknown" else ""
    content = [{"type": "text", "text": EXTRACTION_PROMPT.format(applicant_hint=applicant_hint)}]
    for p in image_paths:
        mime_type, _ = mimetypes.guess_type(p)
        with open(p, "rb") as f:
            b64_img = base64.b64encode(f.read()).decode("utf-8")
        content.append({"type": "image_url", "image_url": {"url": f"data:{mime_type or 'image/jpeg'};base64,{b64_img}"}})

    payload = {
        "model": model,
        "messages": [{"role": "user", "content": content}],
        "response_format": {"type": "json_object"},
        "temperature": 0,
        "max_tokens": 16000,
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "HTTP-Referer": "https://duedeligence-production.up.railway.app",
        "X-Title": settings.PROJECT_NAME,
        "Content-Type": "application/json",
    }

    last_error = "unknown error"
    for attempt in range(1, MAX_ATTEMPTS + 1):
        try:
            with httpx.Client(timeout=REQUEST_TIMEOUT_SECONDS) as client:
                resp = client.post(f"{base_url}/chat/completions", headers=headers, json=payload)
            if resp.status_code != 200:
                last_error = f"OpenRouter HTTP {resp.status_code}: {resp.text[:200]}"
            else:
                raw_content = resp.json()["choices"][0]["message"]["content"]
                return _parse_model_json(raw_content)
        except Exception as e:
            last_error = f"{type(e).__name__}: {e}"
        logger.warning("Field-form PDF extraction attempt %d failed: %s", attempt, last_error)
    raise RuntimeError(f"Gemini extraction failed: {last_error}")


def _combine_name_relation(name: Optional[str], relation: Optional[str]) -> Optional[str]:
    """Builds the "(Name) Relation" string the PWA's own Owner Name / Premises Owner Name
    fields use, so the downstream parsing already in cpv_report_data.py/pdf_generator.py picks
    it apart correctly - same convention, not a new one."""
    name = (name or "").strip()
    relation = (relation or "").strip()
    if not name:
        return None
    if relation:
        return f"({name}) {relation}"
    return name


def _combine_met(name: Optional[str], contact: Optional[str], relation: Optional[str]) -> Optional[str]:
    """Builds the "Name - Phone (Relation)" string "Who did you meet" already parses."""
    name = (name or "").strip()
    contact = (contact or "").strip()
    relation = (relation or "").strip()
    if not name:
        return None
    out = name
    if contact:
        out += f" - {contact}"
    if relation:
        out += f" ({relation})"
    return out


def build_field_form_payload(extracted: Dict[str, Any]) -> Dict[str, Any]:
    """
    Maps the Gemini-extracted intermediate schema into exactly the field_form_data shape the
    PWA's submitDueDiligenceForm() already produces - the same keys, same conventions - so every
    existing consumer (pdf_generator.py, cpv_report_data.py, the PWA's own restore-on-reopen)
    works completely unchanged, with no special-casing for a backlog-imported case.
    """
    e = extracted or {}

    residence_owner = _combine_name_relation(e.get("residence_owner_name"), e.get("residence_owner_relation"))
    office_owner = _combine_name_relation(e.get("office_owner_name"), e.get("office_owner_relation"))
    person_met = _combine_met(e.get("who_met_residence_name"), e.get("who_met_residence_contact"), e.get("who_met_residence_relation"))
    office_who_meet = _combine_met(e.get("who_met_office_name"), e.get("who_met_office_contact"), e.get("who_met_office_relation"))

    res_refs = [r for r in (e.get("residence_references") or []) if isinstance(r, dict) and r.get("name")]
    neighbour_1 = f"{res_refs[0]['name']} - {res_refs[0].get('relation', '')}".strip(" -") if len(res_refs) > 0 else ""
    neighbour_2 = f"{res_refs[1]['name']} - {res_refs[1].get('relation', '')}".strip(" -") if len(res_refs) > 1 else ""

    off_refs = [r for r in (e.get("office_references") or []) if isinstance(r, dict) and r.get("name")]
    office_reference_1 = f"{off_refs[0]['name']} - {off_refs[0].get('relation', '')}".strip(" -") if len(off_refs) > 0 else ""
    office_reference_2 = f"{off_refs[1]['name']} - {off_refs[1].get('relation', '')}".strip(" -") if len(off_refs) > 1 else ""

    bhk = e.get("residence_bhk") or ""
    bldg_type = e.get("residence_building_type") or ""
    building_type_combined = " ".join(p for p in (bhk, bldg_type) if p).strip() or None

    assets_observed = ", ".join(e.get("residence_assets_visible") or []) or None
    office_assets = ", ".join(e.get("office_assets_visible") or []) or None

    family_members = []
    for m in (e.get("family_members") or []):
        if isinstance(m, dict) and m.get("name"):
            family_members.append({
                "name": m.get("name"), "relation": m.get("relation") or "",
                "age": m.get("age") or "", "earning": m.get("earning") or "",
            })

    office_details = {
        "occupation": e.get("occupation"),
        "designation": e.get("position_or_nature_of_business"),
        "position": e.get("position_or_nature_of_business"),
        "firm_name": e.get("firm_name"),
        "address": e.get("office_address"),
        "work_from_home": e.get("work_from_home"),
        "firm_type": e.get("company_type"),
        "employees": e.get("office_number_of_workers"),
        "nameboard": e.get("office_nameboard_visibility"),
        "infrastructure": e.get("office_infrastructure"),
        "premises_ownership": e.get("office_ownership"),
        "premises_owner": office_owner,
        "landmark": None,
        "established_since": e.get("office_period_of_stay"),
        "location": None,
        "assets": office_assets,
        "reference_1": office_reference_1 or None,
        "reference_2": office_reference_2 or None,
        "who_meet": office_who_meet,
        "reg_no": None,
        "assessment": None,
        "verification_status": "Not Applicable (Home Maker)" if (e.get("occupation") == "House Wife") else "Office Verification Conducted",
    }

    previous_loan = {
        "loan_type": e.get("loan_type") or "NA",
        "amount": e.get("loan_amount") or "NA",
        "bank": e.get("previous_loan_bank") or "NA",
        "date": e.get("dealership_date") or "NA",
    }

    payload = {
        "executive": e.get("executive_name") or "",
        "persona": "Applicant",
        "agent_selfie": None,
        "agent_selfie_captured_at": None,
        "contact_number": e.get("contact_number") or "",
        "marital_status": e.get("marital_status") or "",
        "age_community": e.get("age") or "",
        "community": e.get("community") or "",
        "qualification": e.get("qualification") or "",
        "family_members": family_members,
        "building_type": building_type_combined,
        "ownership": e.get("residence_ownership") or "",
        "period_of_stay": e.get("duration_of_stay") or "",
        "owner_name": residence_owner or "",
        "neighbour_1": neighbour_1,
        "neighbour_2": neighbour_2,
        "landmark": "",
        "person_met": person_met or "",
        "assets_observed": assets_observed or "",
        "nameboard_visible": e.get("nameboard_visibility_residence") or "",
        "building_nature": "",
        "general_appearance": "",
        "locality": "",
        "surroundings": "",
        "residence_evidence_obtained": "",
        "occupation": e.get("occupation") or "",
        "itr_acknowledgement_no": "",
        "itr_filing_date": "",
        "bank_account_status": "",
        "bank_account_status_co": "",
        "office_details": office_details,
        "previous_loan": previous_loan,
        "office_details_co": None,
        "residence_details_co": None,
        "restore": {
            "bhk": bhk or None,
            "building_type_only": bldg_type or None,
            "ownership": e.get("residence_ownership"),
            "period_of_stay": e.get("duration_of_stay"),
            "owner_name": residence_owner,
            "marital_status": e.get("marital_status"),
            "age_community": e.get("age"),
            "community": e.get("community"),
            "qualification": e.get("qualification"),
            "contact_number": e.get("contact_number"),
            "landmark": None,
            "person_met": person_met,
            "neighbors": [n for n in (neighbour_1, neighbour_2) if n],
            "family_members": family_members,
            "active_asset_ids": None,
            "itr_acknowledgement_no": None,
            "itr_filing_date": None,
            "bank_account_status": None,
            "bank_account_status_co": None,
        },
    }
    return payload


def ingest_field_form_pdf(pdf_path: str, applicant_name: str) -> Dict[str, Any]:
    """
    Renders every page of the uploaded Google Form PDF export to an image, sends them all to
    Gemini in one call (the questionnaire is one logical form spanning several pages, not
    independent documents to classify page-by-page), and maps the result into the exact
    field_form_data shape the PWA already produces.
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found at: {pdf_path}")
    if fitz is None:
        raise RuntimeError("PyMuPDF (fitz) is not installed.")

    tmp_dir = pdf_path + "_pages"
    os.makedirs(tmp_dir, exist_ok=True)
    image_paths = []
    try:
        doc = fitz.open(pdf_path)
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            pix = page.get_pixmap(dpi=200)
            img_path = os.path.join(tmp_dir, f"page_{page_num + 1}.jpg")
            pix.save(img_path, jpg_quality=90)
            image_paths.append(img_path)
        doc.close()

        extracted = _call_gemini_extraction(image_paths, applicant_name)
        return build_field_form_payload(extracted)
    finally:
        for p in image_paths:
            try:
                os.remove(p)
            except OSError:
                pass
        try:
            os.rmdir(tmp_dir)
        except OSError:
            pass


def extract_field_form_pdf_for_intake(pdf_path: str, applicant_name: str = "") -> Dict[str, Any]:
    """
    Renders the Google Form PDF export pages to images, calls Gemini to extract both:
    1. Case Intake profile fields (applicant name, phone, address, office address, bank, branch, loan type, amount, co-applicant details, executive name, visit date)
    2. Full PWA field_form_data payload
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found at: {pdf_path}")
    if fitz is None:
        raise RuntimeError("PyMuPDF (fitz) is not installed.")

    tmp_dir = pdf_path + "_pages_intake"
    os.makedirs(tmp_dir, exist_ok=True)
    image_paths = []
    try:
        doc = fitz.open(pdf_path)
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            pix = page.get_pixmap(dpi=200)
            img_path = os.path.join(tmp_dir, f"page_{page_num + 1}.jpg")
            pix.save(img_path, jpg_quality=90)
            image_paths.append(img_path)
        doc.close()

        extracted = _call_gemini_extraction(image_paths, applicant_name)
        field_form_payload = build_field_form_payload(extracted)

        # Normalize bank name to standard empanelled bank names if possible
        raw_bank = (extracted.get("bank_name") or "").strip()
        normalized_bank = None
        if raw_bank:
            rb_lower = raw_bank.lower()
            if "union" in rb_lower:
                normalized_bank = "Union Bank of India"
            elif "baroda" in rb_lower or "bob" in rb_lower:
                normalized_bank = "Bank of Baroda"
            elif "state bank" in rb_lower or "sbi" in rb_lower:
                normalized_bank = "State Bank of India"
            elif "hdfc" in rb_lower:
                normalized_bank = "HDFC Bank"
            elif "icici" in rb_lower:
                normalized_bank = "ICICI Bank"
            elif "axis" in rb_lower:
                normalized_bank = "Axis Bank"
            elif "canara" in rb_lower:
                normalized_bank = "Canara Bank"
            elif "punjab" in rb_lower or "pnb" in rb_lower:
                normalized_bank = "Punjab National Bank"
            else:
                normalized_bank = raw_bank

        # Normalize loan type
        raw_loan = (extracted.get("loan_type") or "").strip()
        normalized_loan = None
        if raw_loan:
            rl_lower = raw_loan.lower()
            if "home" in rl_lower or "hl" in rl_lower:
                normalized_loan = "Home Loan"
            elif "car" in rl_lower or "vehicle" in rl_lower or "auto" in rl_lower:
                normalized_loan = "Vehicle Loan"
            elif "personal" in rl_lower or "pl" in rl_lower:
                normalized_loan = "Personal Loan"
            elif "education" in rl_lower:
                normalized_loan = "Education Loan"
            elif "business" in rl_lower or "bt" in rl_lower:
                normalized_loan = "Business Takeover"
            elif "msme" in rl_lower:
                normalized_loan = "MSME Loan"
            elif "mudra" in rl_lower:
                normalized_loan = "Mudra Loan"
            elif "machinery" in rl_lower:
                normalized_loan = "Machinery Loan"
            else:
                normalized_loan = raw_loan

        case_data = {
            "applicant_name": extracted.get("name"),
            "contact_number": extracted.get("contact_number"),
            "address_visited": extracted.get("address_visited"),
            "office_address": extracted.get("office_address"),
            "bank_name": normalized_bank,
            "branch_name": extracted.get("branch_name"),
            "loan_type": normalized_loan,
            "loan_amount": extracted.get("loan_amount"),
            "executive_name": extracted.get("executive_name"),
            "co_applicant_name": extracted.get("co_applicant_name"),
            "co_applicant_contact": extracted.get("co_applicant_contact"),
            "co_applicant_address": extracted.get("co_applicant_address"),
            "visit_date": extracted.get("visit_date"),
            "marital_status": extracted.get("marital_status"),
            "occupation": extracted.get("occupation"),
            "firm_name": extracted.get("firm_name"),
        }

        return {
            "case_data": case_data,
            "field_form_data": field_form_payload,
        }
    finally:
        for p in image_paths:
            try:
                os.remove(p)
            except OSError:
                pass
        try:
            os.rmdir(tmp_dir)
        except OSError:
            pass
