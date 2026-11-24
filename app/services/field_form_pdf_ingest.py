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
import concurrent.futures
import difflib
import logging
import os
import re
import uuid
from typing import Any, Dict, List, Optional

import httpx

from app.core.config import settings
from app.services.pdf_separator import _name_score, _parse_model_json

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
When Family Details lines are written like "APP- SWETA ARORA -37- YES" or "HUSBAND - ANAND VORA-40- YES",
"APP" means relation="Self" and "SWETA ARORA" is the person's name; "HUSBAND" is relation="Husband"
and "ANAND VORA" is the person's name. Always put the person's actual name in "name" and the
relationship ("Self", "Husband", "Wife", "Father", "Mother", "Son", "Daughter", etc.) in "relation".
Normalize obvious spelling slips in relations or positions (e.g. "FERIND" -> "Friend", "MENEGER" -> "Manager").
If a field contains only "N", "NA", "Na", or "Nil" as a placeholder for "none", return null for that field
(except office_ownership where "NA" is a radio button option, and nameboard_visibility_residence / office_nameboard_visibility where "No" is a real answer).

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
    {{"name": "exact person's name as written under 'Family Details (કુટુંબ વિગતો)' in the Google Form. CRITICAL RULE: If 'Family Details' in the Google Form says 'No provide', 'Not provided', 'NA', 'Nil', 'No', or is blank, return an empty array []! NEVER invent, assume, or add any family member that is not explicitly written under 'Family Details (કુટુંબ વિગતો)'", "age": "exact age as written in the Google Form", "relation": "exact relation as written in the Google Form (only map 'APP'/'Applicant' -> 'Self')", "earning": "exact earning status ('Yes' or 'No') as written in the Google Form"}}
  ],
  "address_visited": "string or null",
  "residence_landmark": "Landmark or locality extracted from address_visited (e.g. 'Near SAL Hospital, Driving Road, Thaltej'), string or null",
  "residence_ownership": "Rented | Owned | Government Provided | Company Provided | null",
  "residence_references": [
    {{"name": "Exact reference name as written under 'References (2)' in the Google Form (e.g. 'Kishorbhai', 'Jayantibhai' — strip leading item numbers like '1 -' or '2 -', keep full name intact; if a line says 'No reference' or 'No provide' or 'NA', either omit it or return name='No reference' and relation=null)", "relation": "Exact relation as written in the Google Form (e.g. 'Neighbour', 'Friend'). CRITICAL: If no relation was written next to the reference name in the Google Form, return null — NEVER default or assume 'Neighbour'!"}}
  ],
  "residence_building_type": "Bungalow | Flat | Independent House | null",
  "residence_bhk": "e.g. '1 BHK', '2 BHK', '3 BHK', '4 BHK' or null",
  "duration_of_stay": "string or null (e.g. '2.5 years')",
  "residence_owner_name": "string or null - exact owner name as written in the Google Form, no relation",
  "residence_owner_relation": "string or null - ONLY if a relation was explicitly written in 'Owner Name (માલિકનું નામ) : (Name Relation)' in the Google Form; if only the owner's name was written (e.g. 'Dineshbhai Chauhan') without any relation word, return null — NEVER guess or calculate relation!",
  "nameboard_visibility_residence": "string or null - whatever was typed/selected, e.g. 'Yes' or 'No' or the name on the board",
  "residence_assets_visible": ["list of checked items, e.g. 'AC', 'FAN', 'CCTV'"],
  "who_met_residence_name": "string or null - name only as written in the Google Form",
  "who_met_residence_contact": "string or null - phone number if explicitly written in the Google Form",
  "who_met_residence_relation": "string or null - ONLY if relation was explicitly written in 'Who did you meet?' in the Google Form; if no relation was written, return null — NEVER guess or assume!",
  "occupation": "Business | Job | House Wife | Retired | Pensioner | null",
  "work_from_home": "Yes | No | null",
  "firm_name": "string or null",
  "company_type": "Proprietorship | Partnership | Private Limited | LLP | Corporation | Public Limited | string (if Other, the typed value) | null",
  "office_address": "string or null",
  "office_landmark": "Landmark, complex name, or road extracted from office_address (e.g. 'Shikhar Complex, Gurukul Road, Ahmedabad'), string or null",
  "office_period_of_stay": "string or null",
  "office_number_of_workers": "string or null",
  "office_nameboard_visibility": "string or null - whatever was typed/selected",
  "office_infrastructure": "Office | Shop | Factory | School | Hospital | College | Clinic | Shed | string (if Other) | null",
  "office_ownership": "Owned | Rented | NA | null",
  "office_owner_name": "string or null - exact owner name as written in the Google Form, no relation",
  "office_owner_relation": "string or null - ONLY if relation was explicitly written in the Google Form; otherwise null",
  "position_or_nature_of_business": "string or null",
  "office_assets_visible": ["list of checked items"],
  "office_references": [
    {{"name": "Exact reference name or shop/firm name as written in the Google Form (e.g. 'Kalpeshbhai', 'Nikhil Panchal', 'Cool and casual' — strip leading '1 -' or '2 -', keep all words of the name intact)", "relation": "Exact relation/designation as written in the Google Form (e.g. 'OS', 'Junior Clark', 'Colleague', 'Staff', 'Manager', 'Owner', 'Neighbour', 'Friend'). CRITICAL: If no relation was written in the Google Form, return null — NEVER default or assume!"}}
  ],
  "who_met_office_name": "string or null - name only as written in the Google Form",
  "who_met_office_contact": "string or null",
  "who_met_office_relation": "string or null - ONLY if explicitly written in the Google Form; otherwise null",
  "loan_type": "Home | Car | Education | Personal | string (if Other) | null",
  "loan_amount": "string or null",
  "previous_loan_bank": "string or null",
  "dealership_date": "string or null (DD/MM/YYYY as printed)",
  "visit_date": "Date of field visit (DD/MM/YYYY) if mentioned or timestamped, string or null"
}}"""


def _call_gemini_extraction(image_paths: List[str], applicant_name: str, page_texts: Optional[List[str]] = None) -> Dict[str, Any]:
    api_key = settings.OPENROUTER_API_KEY
    model = settings.OPENROUTER_EXTRACTION_MODEL or "google/gemini-2.5-flash"
    base_url = settings.OPENROUTER_BASE_URL or "https://openrouter.ai/api/v1"
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY is not configured on the server")

    import base64
    import mimetypes

    applicant_hint = f" for applicant {applicant_name}" if applicant_name and applicant_name.lower() != "unknown" else ""
    prompt_text = EXTRACTION_PROMPT.format(applicant_hint=applicant_hint)
    if page_texts and any((t or "").strip() for t in page_texts):
        joined_text = "\n\n".join(
            f"--- EMBEDDED PDF DIGITAL TEXT FOR PAGE {idx + 1} ---\n{t.strip()}"
            for idx, t in enumerate(page_texts)
            if (t or "").strip()
        )
        prompt_text += (
            "\n\nIMPORTANT — EXACT NATIVE DIGITAL TEXT LAYER FROM THE PDF:\n"
            "Below is the exact selectable digital text extracted directly from the PDF pages. "
            "Use the page images to see which radio buttons and checkboxes are visually selected, "
            "and use this exact digital text layer for 100% character-for-character spelling of all "
            "typed text answers (names, family member lines like 'Dhara - 12 - daughter- no', "
            "addresses like 'D-103 sharnam homes near kanba hospital nikol', firm names like 'Rivaan pharma', "
            "references like 'Hareshbhai bhesaniya', phone numbers, etc.) so that dotted underlines in the "
            "page image never cause a spelling misread:\n\n"
            + joined_text
        )
    content = [{"type": "text", "text": prompt_text}]
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


_PLACEHOLDER_STRINGS = {
    "", "n", "na", "n/a", "no", "nil", "none", "-", "null",
    "no provide", "not provide", "not provided", "no provided",
    "family details not provided", "no reference", "no references",
    "pending ai extraction",
}

_RELATION_NORMALIZATION = {
    "APP": "Self",
    "APPLICANT": "Self",
    "SELF": "Self",
    "FERIND": "Friend",
    "FRIND": "Friend",
    "FREIND": "Friend",
    "FRIEND": "Friend",
    "MENEGER": "Manager",
    "MANEGER": "Manager",
    "MANAGER": "Manager",
    "HUSBAND": "Husband",
    "WIFE": "Wife",
    "FATHER": "Father",
    "MOTHER": "Mother",
    "GRANDFATHER": "Grandfather",
    "GRAND FATHER": "Grandfather",
    "GRAND-FATHER": "Grandfather",
    "DADA": "Grandfather",
    "DADAJI": "Grandfather",
    "NANA": "Grandfather",
    "NANAJI": "Grandfather",
    "GRANDMOTHER": "Grandmother",
    "GRAND MOTHER": "Grandmother",
    "GRAND-MOTHER": "Grandmother",
    "DADI": "Grandmother",
    "DADIJI": "Grandmother",
    "NANI": "Grandmother",
    "NANIJI": "Grandmother",
    "FATHER IN LAW": "Father-in-law",
    "MOTHER IN LAW": "Mother-in-law",
    "FATHER-IN-LAW": "Father-in-law",
    "MOTHER-IN-LAW": "Mother-in-law",
    "BROTHER IN LAW": "Brother-in-law",
    "SISTER IN LAW": "Sister-in-law",
    "BROTHER-IN-LAW": "Brother-in-law",
    "SISTER-IN-LAW": "Sister-in-law",
    "BHABHI": "Sister-in-law",
    "JETHANI": "Sister-in-law",
    "DERANI": "Sister-in-law",
    "SON": "Son",
    "DAUGHTER": "Daughter",
    "BROTHER": "Brother",
    "SISTER": "Sister",
    "OWNER": "Owner",
    "LANDLORD": "Landlord",
    "NEIGHBOUR": "Neighbour",
    "NEIGHBOR": "Neighbour",
    "COLLEAGUE": "Colleague",
    "STAFF": "Staff",
}

_COMMON_FEMALE_NAMES = {
    "KOMAL", "KHUSHBU", "KHUSHBOO", "ANANYA", "NITISHA", "MALIKA", "MALLIKA",
    "SWETA", "SHWETA", "BHAVNA", "BHAVNABEN", "RAJKUNVARBA", "PRIYA", "POOJA",
    "NEHA", "KAVITA", "SUNITA", "ANITA", "REKHA", "MEENA", "SEEMA", "GEETA",
    "SITA", "RADHA", "PAYAL", "KAJAL", "SONAL", "HETAL", "KINJAL", "TEJAL",
    "RUPAL", "MITAL", "SHEETAL", "DIPALI", "DEEPALI", "NIDHI", "RIDDHI",
    "SIDDHI", "KRUTI", "SHRUTI", "SMRUTI", "DHARTI", "AARTI", "ARTI", "JYOTI",
    "PREETI", "PRITI", "SWATI", "TWINKLE", "DIMPLE", "RINKU", "PINKY", "ARCHANA",
    "VANDANA", "SAPNA", "SHILPA", "MANISHA", "VARSHA", "ASHA", "USHA", "NISHA",
    "DISHA", "RICHA", "SHIKHA", "SNEHA", "MEGA", "MEGHA", "DIVYA", "VIDYA",
    "KANTA", "SHANTA", "MAMTA", "MAMTABEN", "LATA", "NAMRATA", "AMRUTA", "ANKITA", "NIKITA",
    "MOKSHA", "KUMUD",
}

_COMMON_MALE_NAMES = {
    "NIRAV", "RAHUL", "RAJESH", "RAMESH", "SURESH", "MAHESH", "DINESH", "MUKESH",
    "RAKESH", "NARESH", "HARESH", "HITESH", "MITESH", "JITESH", "RITESH", "PARESH",
    "JAYESH", "BHAVESH", "KALPESH", "ALPESH", "DIPESH", "YOGESH", "KAMLESH",
    "SHAILESH", "VIJAY", "SANJAY", "AJAY", "VINAY", "UDAY", "AKSHAY", "PRADEEP",
    "SANDEEP", "KULDEEP", "HARDIK", "PRATIK", "KARTIK", "MAULIK", "BHAVIK",
    "CHIRAG", "PARAG", "MAYUR", "KEYUR", "ANKIT", "AMIT", "SUMIT", "ROHIT",
    "MOHIT", "LALIT", "HARSH", "PARTH", "YASH", "DEV", "RAJ", "JAY", "NEEL",
    "MEET", "JEET", "PREET", "ANAND", "VIKRAM", "ASHOK", "KISHOR", "BHARAT",
    "MANOJ", "VINOD", "PRAMOD", "SUBHASH", "PRAKASH", "VIKAS", "VISHAL", "KRUNAL",
    "DHAVAL", "TUSHAR", "SACHIN", "NITIN", "VIPIN", "JATIN", "CHETAN", "KETAN",
    "MANISH", "ASHISH", "GIRISH", "SATISH", "HARISH", "JAGDISH", "NARAYAN",
    "KAUSHIK", "KAUSHIKBHAI", "ANSH", "DEVILAL", "KAMAL", "NAIMISH", "PRANAV", "TANMAY", "HIMMATLAL",
    "HEMAL", "JWALANT", "PRAVIN", "KAHAN", "KAHAAN", "NAIMUDDIN", "JENUDDIN",
}


def _infer_gender_from_name_or_hint(name: Optional[str], explicit_gender: Optional[str] = None) -> Optional[str]:
    if explicit_gender:
        g = str(explicit_gender).strip().upper()
        if g in ("FEMALE", "F", "WOMAN", "GIRL"):
            return "FEMALE"
        if g in ("MALE", "M", "MAN", "BOY"):
            return "MALE"
    if not name:
        return None
    s = str(name).strip()
    upper = s.upper()
    if re.match(r"^(?:MRS\.?|MS\.?|MISS\.?|SMT\.?|KUM\.?|KUMARI)\b", upper):
        return "FEMALE"
    if re.match(r"^(?:MR\.?|SHRI\.?|SHREE\.?|SARDAR)\b", upper):
        return "MALE"
    tokens = [re.sub(r"[^A-Z]", "", t) for t in upper.split()]
    tokens = [t for t in tokens if t and t not in ("MR", "MRS", "MS", "MISS", "SMT", "SHRI", "DR", "CA", "ADV")]
    if not tokens:
        return None
    first = tokens[0]
    if first in _COMMON_FEMALE_NAMES or any(first.endswith(sfx) for sfx in ("BEN", "BA", "DEVI", "BAI", "KUMARI", "BANU", "BANO", "BIBI", "BEGUM", "KHATOON", "FATIMA")):
        return "FEMALE"
    if first in _COMMON_MALE_NAMES or any(first.endswith(sfx) for sfx in ("BHAI", "SINH", "KUMAR", "LAL", "DAS", "NATH", "UDDIN", "MIYA", "KHAN")):
        return "MALE"
    # Handle 2-token Surname-First names (e.g. 'Kothiya pravinbhai' or 'Shaikh sakilabanu')
    if len(tokens) == 2:
        second = tokens[1]
        if second in _COMMON_FEMALE_NAMES or any(second.endswith(sfx) for sfx in ("BEN", "BA", "DEVI", "BAI", "KUMARI", "BANU", "BANO", "BIBI", "BEGUM", "KHATOON", "FATIMA")):
            return "FEMALE"
        if second in _COMMON_MALE_NAMES or any(second.endswith(sfx) for sfx in ("BHAI", "SINH", "KUMAR", "LAL", "DAS", "NATH", "UDDIN", "MIYA", "KHAN")):
            return "MALE"
    return None


def _clean_earning_val(
    raw_earning: Optional[Any],
    age_str: Optional[str] = None,
    occupation_str: Optional[str] = None,
) -> str:
    """
    Normalizes a family member's earning field to 'Yes' or 'No'.
    Crucially:
    1. Does NOT pass raw_earning through _clean_val(), because _PLACEHOLDER_STRINGS contains
       'no' and 'n' (which previously turned 'No' -> None -> 'Yes'!).
    2. Any minor child (0 < age < 18) is ALWAYS 'No'.
    3. Non-earning occupations (Housewife, Student, Dependent, Retired) are ALWAYS 'No'.
    """
    if age_str:
        m_age = re.search(r"\b(\d{1,3})\b", str(age_str))
        if m_age:
            age_num = int(m_age.group(1))
            if 0 < age_num < 18:
                return "No"
    if occupation_str:
        occ_low = str(occupation_str).strip().lower()
        if any(k in occ_low for k in ("house wife", "housewife", "homemaker", "home maker", "student", "dependent", "minor", "unemployed", "none", "nil")):
            return "No"
    if raw_earning is not None:
        s = str(raw_earning).strip().upper()
        if s in ("NO", "N", "FALSE", "0", "NONE", "NIL", "NA", "N/A", "HOUSEWIFE", "HOUSE WIFE", "STUDENT", "DEPENDENT"):
            return "No"
        if s in ("YES", "Y", "TRUE", "1"):
            return "Yes"
    return "Yes"


def _parse_age_int(val: Optional[Any]) -> Optional[int]:
    """Extract an integer age (1..110) from an age string ('20', '20 Years', '48 / Hindu') or DD/MM/YYYY DOB."""
    if val is None:
        return None
    s = str(val).strip()
    if not s:
        return None
    # Check DD/MM/YYYY or YYYY-MM-DD DOB first
    m_dob = re.search(r"\b(\d{1,2})[/\-.](\d{1,2})[/\-.]((?:19|20)\d{2})\b", s)
    if m_dob:
        from datetime import date
        try:
            d, mo, yr = int(m_dob.group(1)), int(m_dob.group(2)), int(m_dob.group(3))
            today = date.today()
            age = today.year - yr - ((today.month, today.day) < (mo, d))
            if 1 <= age <= 110:
                return age
        except Exception:
            pass
    m_age = re.search(r"\b(\d{1,3})\b", s)
    if m_age:
        n = int(m_age.group(1))
        if 1 <= n <= 110:
            return n
    return None


def infer_applicant_co_relation_by_age(
    applicant_name: Optional[str] = None,
    applicant_gender: Optional[str] = None,
    applicant_age_or_dob: Optional[Any] = None,
    applicant_marital: Optional[str] = None,
    co_applicant_name: Optional[str] = None,
    co_applicant_gender: Optional[str] = None,
    co_applicant_age_or_dob: Optional[Any] = None,
    co_applicant_marital: Optional[str] = None,
    explicit_relation: Optional[str] = None,
    loan_type: Optional[str] = None,
    applicant_age: Optional[Any] = None,
    co_applicant_age: Optional[Any] = None,
    **kwargs: Any,
) -> Dict[str, Any]:
    """
    Auto-decides (or honors manual override `explicit_relation`) whether two applicants on a case
    are Parent & Child (e.g. Daughter 'Miss.' + Father 'Mr.') vs Husband & Wife ('Mrs.' + 'Mr.')
    using their ages/DOBs, explicit salutations, middle-name patro/matronymic tokens, and loan type.
    """
    app_g = _infer_gender_from_name_or_hint(applicant_name, applicant_gender)
    co_g = _infer_gender_from_name_or_hint(co_applicant_name, co_applicant_gender)
    app_age = _parse_age_int(applicant_age_or_dob if applicant_age_or_dob is not None else applicant_age)
    co_age = _parse_age_int(co_applicant_age_or_dob if co_applicant_age_or_dob is not None else co_applicant_age)

    app_upper = (applicant_name or "").strip().upper()
    co_upper = (co_applicant_name or "").strip().upper()
    app_has_miss = bool(re.match(r"^(?:MISS\.?|KUM\.?|KUMARI)\b", app_upper))
    app_has_mrs = bool(re.match(r"^(?:MRS\.?|SMT\.?)\b", app_upper))
    co_has_miss = bool(re.match(r"^(?:MISS\.?|KUM\.?|KUMARI)\b", co_upper))
    co_has_mrs = bool(re.match(r"^(?:MRS\.?|SMT\.?)\b", co_upper))
    is_edu_loan = "education" in (loan_type or "").lower()

    exp = (explicit_relation or "").strip().upper()

    app_rel_to_co: Optional[str] = None
    co_rel_to_app: Optional[str] = None
    app_sal: Optional[str] = None
    co_sal: Optional[str] = None
    app_mar: Optional[str] = _clean_val(applicant_marital)
    co_mar: Optional[str] = _clean_val(co_applicant_marital)
    is_parent_child = False

    # 1. Explicit manual override from UI / field_form_data
    if exp in ("APPLICANT_IS_DAUGHTER", "DAUGHTER_FATHER", "FATHER_DAUGHTER", "1ST_DAUGHTER"):
        is_parent_child = True
        app_rel_to_co = "Daughter"
        co_rel_to_app = "Mother" if co_g == "FEMALE" else "Father"
        app_sal = "Miss."
        app_mar = "Unmarried"
        co_sal = "Mrs." if co_g == "FEMALE" else "Mr."
        co_mar = co_mar or "Married"
    elif exp in ("APPLICANT_IS_SON", "SON_FATHER", "1ST_SON"):
        is_parent_child = True
        app_rel_to_co = "Son"
        co_rel_to_app = "Mother" if co_g == "FEMALE" else "Father"
        app_sal = "Mr."
        app_mar = app_mar or "Unmarried"
        co_sal = "Mrs." if co_g == "FEMALE" else "Mr."
        co_mar = co_mar or "Married"
    elif exp in ("CO_IS_DAUGHTER", "DAUGHTER", "2ND_DAUGHTER"):
        # If applicant is younger female (< co_age - 15), applicant is actually the daughter;
        # otherwise co-applicant is the daughter.
        if app_age and co_age and co_age >= app_age + 15 and app_g == "FEMALE":
            is_parent_child = True
            app_rel_to_co = "Daughter"
            co_rel_to_app = "Mother" if co_g == "FEMALE" else "Father"
            app_sal = "Miss."
            app_mar = "Unmarried"
            co_sal = "Mrs." if co_g == "FEMALE" else "Mr."
            co_mar = co_mar or "Married"
        else:
            is_parent_child = True
            co_rel_to_app = "Daughter"
            app_rel_to_co = "Mother" if app_g == "FEMALE" else "Father"
            co_sal = "Miss."
            co_mar = "Unmarried"
            app_sal = "Mrs." if app_g == "FEMALE" else "Mr."
            app_mar = app_mar or "Married"
    elif exp in ("CO_IS_WIFE", "WIFE", "2ND_WIFE"):
        co_rel_to_app = "Wife"
        app_rel_to_co = "Husband"
        co_sal = "Mrs."
        co_mar = "Married"
        app_sal = "Mr."
        app_mar = "Married"
    elif exp in ("CO_IS_HUSBAND", "HUSBAND", "2ND_HUSBAND"):
        co_rel_to_app = "Husband"
        app_rel_to_co = "Wife"
        co_sal = "Mr."
        co_mar = "Married"
        app_sal = "Mrs."
        app_mar = "Married"
    elif exp in ("CO_IS_FATHER", "FATHER", "2ND_FATHER"):
        is_parent_child = True
        co_rel_to_app = "Father"
        app_rel_to_co = "Daughter" if app_g == "FEMALE" else "Son"
        co_sal = "Mr."
        co_mar = co_mar or "Married"
        if app_g == "FEMALE" and not app_has_mrs:
            app_sal = "Miss."
            app_mar = "Unmarried"
    elif exp in ("CO_IS_MOTHER", "MOTHER", "2ND_MOTHER"):
        is_parent_child = True
        co_rel_to_app = "Mother"
        app_rel_to_co = "Daughter" if app_g == "FEMALE" else "Son"
        co_sal = "Mrs."
        co_mar = co_mar or "Married"
        if app_g == "FEMALE" and not app_has_mrs:
            app_sal = "Miss."
            app_mar = "Unmarried"
    elif exp in ("CO_IS_SON", "SON", "2ND_SON"):
        is_parent_child = True
        co_rel_to_app = "Son"
        app_rel_to_co = "Mother" if app_g == "FEMALE" else "Father"
        co_sal = "Mr."

    # 2. Automatic Age-based & Title-based inference when not already decided
    if not co_rel_to_app and app_age is not None and co_age is not None:
        if co_age >= app_age + 16:
            # Co-applicant is at least 16 years older -> Parent of Primary Applicant!
            is_parent_child = True
            co_rel_to_app = "Mother" if co_g == "FEMALE" else "Father"
            app_rel_to_co = "Daughter" if app_g == "FEMALE" else "Son"
            co_mar = co_mar or "Married"
            if app_g == "FEMALE" and (app_age <= 25 or app_has_miss or is_edu_loan or not app_has_mrs):
                app_sal = "Miss."
                app_mar = "Unmarried"
        elif app_age >= co_age + 16:
            # Primary applicant is at least 16 years older -> Co-applicant is Child!
            is_parent_child = True
            co_rel_to_app = "Daughter" if co_g == "FEMALE" else "Son"
            app_rel_to_co = "Mother" if app_g == "FEMALE" else "Father"
            app_mar = app_mar or "Married"
            if co_g == "FEMALE" and (co_age <= 25 or co_has_miss or is_edu_loan or not co_has_mrs):
                co_sal = "Miss."
                co_mar = "Unmarried"
        elif abs(app_age - co_age) <= 14 and app_g and co_g and app_g != co_g:
            # Similar age Male & Female -> Husband & Wife
            if app_g == "FEMALE":
                app_rel_to_co = "Wife"
                co_rel_to_app = "Husband"
                app_sal = "Mrs."
                app_mar = "Married"
                co_sal = "Mr."
                co_mar = "Married"
            else:
                app_rel_to_co = "Husband"
                co_rel_to_app = "Wife"
                app_sal = "Mr."
                app_mar = "Married"
                co_sal = "Mrs."
                co_mar = "Married"

    # 3. Single-person / fallback salutation & marital resolution for Female Applicant / Co-Applicant
    if app_g == "FEMALE" and not app_sal:
        if app_has_miss or (app_mar and app_mar.lower() in ("unmarried", "single")) or (app_age is not None and app_age <= 22 and not app_has_mrs) or (is_edu_loan and not app_has_mrs and (app_age is None or app_age <= 26)):
            app_sal = "Miss."
            app_mar = "Unmarried"
        elif app_has_mrs or (app_mar and app_mar.lower() == "married"):
            app_sal = "Mrs."
            app_mar = app_mar or "Married"
        else:
            app_sal = "Mrs." if (app_age and app_age >= 24) else "Miss."
    elif app_g == "MALE" and not app_sal:
        app_sal = "Mr."
        if app_age is not None and app_age <= 22 and not app_mar:
            app_mar = "Unmarried"

    if co_g == "FEMALE" and not co_sal:
        if co_has_miss or (co_mar and co_mar.lower() in ("unmarried", "single")) or (co_age is not None and co_age <= 22 and not co_has_mrs):
            co_sal = "Miss."
            co_mar = "Unmarried"
            if not co_rel_to_app and app_age and co_age and app_age >= co_age + 15:
                co_rel_to_app = "Daughter"
        else:
            co_sal = "Mrs."
            co_mar = co_mar or "Married"
            if not co_rel_to_app and app_g == "MALE":
                co_rel_to_app = "Wife"
    elif co_g == "MALE" and not co_sal:
        co_sal = "Mr."

    return {
        "applicant_relation_to_co": app_rel_to_co,
        "co_relation_to_applicant": co_rel_to_app,
        "applicant_salutation": app_sal,
        "co_salutation": co_sal,
        "applicant_marital_status": app_mar,
        "co_marital_status": co_mar,
        "is_parent_child": is_parent_child,
        "applicant_age": app_age,
        "co_applicant_age": co_age,
    }


def reconcile_family_members_for_applicant(
    raw_fam: Optional[List[Any]],
    applicant_name: Optional[str] = None,
    applicant_gender: Optional[str] = None,
    applicant_age: Optional[Any] = None,
    applicant_marital_status: Optional[str] = None,
    form_holder_name: Optional[str] = None,
    form_holder_age: Optional[Any] = None,
    applicant_occupation: Optional[str] = None,
    applicant_father_name: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Strictly preserves Family Details exactly as written in the Google Form PDF (for backlog cases)
    or PWA Field Visit Form (for field agent cases) with ZERO assumptions, ZERO age/relation formulas,
    and ZERO auto-fabricated 'Self' or parent rows.
    If no family details were provided (or 'No provide' / 'Not provided' / 'NA' / blank), returns []
    so the report displays 'Family details not provided'.
    """
    if not isinstance(raw_fam, list) or not raw_fam:
        return []

    cleaned_fam: List[Dict[str, Any]] = []
    for m in raw_fam:
        if not isinstance(m, dict):
            continue
        m_name = _clean_val(m.get("name"))
        m_rel = _clean_val(m.get("relation"))
        # Detect swapped name/relation like name="APP", relation="SWETA ARORA"
        if (
            m_name
            and m_name.upper().strip(" .,-") in _RELATION_NORMALIZATION
            and m_rel
            and m_rel.upper().strip(" .,-") not in _RELATION_NORMALIZATION
        ):
            m_name, m_rel = m_rel, _RELATION_NORMALIZATION[m_name.upper().strip(" .,-")]
        elif m_name and m_name.upper().strip(" .,-") in _RELATION_NORMALIZATION and not m_rel:
            m_rel = _RELATION_NORMALIZATION[m_name.upper().strip(" .,-")]
            m_name = None

        if not m_name:
            continue

        # Strip bilingual suffix from relation if present (e.g. "Wife (પત્ની)" -> "Wife", "Self (પોતે)" -> "Self")
        if m_rel:
            m_rel = re.sub(r"\s*\([^)]*\)\s*$", "", m_rel).strip()
            if m_rel.upper().strip(" .,-") in ("APP", "APPLICANT", "SELF"):
                m_rel = "Self"

        age_clean = str(_clean_val(m.get("age")) or "")
        raw_earn = m.get("earning")
        earn_str = str(raw_earn).strip() if raw_earn is not None else ""
        if earn_str.upper() in ("YES", "Y", "EARNING"):
            earning_clean = "Yes"
        elif earn_str.upper() in ("NO", "N", "NOT EARNING", "NON-EARNING", "NONE"):
            earning_clean = "No"
        elif earn_str:
            earning_clean = earn_str
        else:
            earning_clean = ""

        cleaned_fam.append({
            "name": m_name,
            "relation": m_rel or "",
            "age": age_clean,
            "earning": earning_clean,
        })

    return cleaned_fam


def _clean_val(val: Optional[Any], allow_na: bool = False, allow_no: bool = False) -> Optional[str]:
    if val is None:
        return None
    s = str(val).strip()
    if not s:
        return None
    if allow_no and s.lower() == "no":
        return "No"
    if not allow_na and s.lower() in _PLACEHOLDER_STRINGS:
        return None
    return s


_VALID_REFERENCE_RELATIONS = {
    "NEIGHBOUR", "NEIGHBOR", "NEIGHBOURS", "NEIGHBORS",
    "FRIEND", "FERIND", "FRIND", "FREIND", "FRIENDS",
    "COLLEAGUE", "COLLEAGUES", "CO-WORKER", "COWORKER",
    "STAFF", "OFFICE STAFF", "EMPLOYEE", "WORKER", "HELPER", "ASSISTANT",
    "MANAGER", "MENEGER", "MANEGER", "SUPERVISOR", "INCHARGE", "HEAD",
    "OWNER", "LANDLORD", "PROPRIETOR", "PARTNER", "BUSINESS PARTNER", "DIRECTOR", "BOSS", "EMPLOYER", "CHAIRMAN", "SECRETARY",
    "TENANT", "RENTER", "LESSEE",
    "SHOPKEEPER", "NEARBY SHOPKEEPER", "VENDOR", "SUPPLIER", "CLIENT", "CUSTOMER", "DEALER",
    "ACCOUNTANT", "CLERK", "CASHIER", "RECEPTIONIST", "ADMIN", "HR", "SALESMAN",
    "WATCHMAN", "SECURITY", "SECURITY GUARD", "GUARD", "CARETAKER",
    "RELATIVE", "FAMILY", "FAMILY MEMBER",
    "FATHER", "MOTHER", "GRANDFATHER", "GRANDMOTHER", "GRAND FATHER", "GRAND MOTHER", "DADA", "DADI", "NANA", "NANI",
    "HUSBAND", "WIFE", "SON", "DAUGHTER", "BROTHER", "SISTER",
    "UNCLE", "AUNT", "COUSIN", "NEPHEW", "NIECE",
    "FATHER IN LAW", "MOTHER IN LAW", "BROTHER IN LAW", "SISTER IN LAW",
    "FATHER-IN-LAW", "MOTHER-IN-LAW", "BROTHER-IN-LAW", "SISTER-IN-LAW",
    "SELF", "APPLICANT", "APP", "CO-APPLICANT", "GUARANTOR",
}


def _is_valid_reference_relation(val: Optional[str]) -> bool:
    """Return True only if `val` is an actual relationship/role word (e.g. 'Neighbour', 'Friend',
    'Colleague', 'Manager') and NOT a second person's name (like 'RAJU BHAI')."""
    s = _clean_val(val)
    if not s:
        return False
    upper = re.sub(r"\s+", " ", s.upper().strip(" .,-()/"))
    if upper in _VALID_REFERENCE_RELATIONS or upper in _RELATION_NORMALIZATION:
        return True
    # Also accept composite role labels like "Society Secretary", "Shop Owner", "Next Door Neighbour"
    role_keywords = (
        "NEIGHBOUR", "NEIGHBOR", "FRIEND", "FERIND", "FRIND", "FREIND",
        "COLLEAGUE", "COWORKER", "STAFF", "MANAGER", "MENEGER", "MANEGER",
        "OWNER", "LANDLORD", "PROPRIETOR", "PARTNER", "DIRECTOR", "BOSS",
        "EMPLOYER", "EMPLOYEE", "SUPERVISOR", "WATCHMAN", "SECURITY", "GUARD",
        "SECRETARY", "CHAIRMAN", "TENANT", "SHOPKEEPER", "RELATIVE", "ACCOUNTANT",
        "CLERK", "VENDOR", "SUPPLIER", "CLIENT", "CUSTOMER",
    )
    return any(re.search(rf"\b{kw}\b", upper) for kw in role_keywords)


def _expand_and_normalize_references(
    raw_items: List[Any],
    default_relation: Optional[str] = None,
) -> List[str]:
    """
    Strictly preserves Reference details (Name and Relation) exactly as written in the Google Form PDF
    or PWA Field Visit Form with ZERO assumptions or auto-calculated relations.
    - If a reference has both a name and an explicit relation (e.g. '1 - Kishorbhai - Neighbour',
      '1 - Kalpeshbhai - OS', '2 - Nikhil Panchal - Junior Clark'), outputs 'Name - Relation'.
    - If a reference has ONLY a name and no relation was written in the form, outputs 'Name'
      (so the report displays 'Relationship not mentioned' in the Relation column rather than guessing).
    - If a line says 'No reference' / 'No provide' / 'NA', omits it (or if all references are
      'No reference', returns []).
    """
    pairs: List[tuple[str, Optional[str]]] = []

    def _strip_num_prefix(s: str) -> str:
        return re.sub(r"^\s*\d+[\.\)\-\s]+", "", s.strip()).strip(" .,-")

    def _is_no_ref(s: str) -> bool:
        low = re.sub(r"\s+", " ", s.lower().strip(" .,-"))
        return low in _PLACEHOLDER_STRINGS or low in ("no reference", "no references", "no ref", "not provided", "no provide")

    for item in (raw_items or []):
        if not item:
            continue
        if isinstance(item, dict):
            raw_n = str(item.get("name") or "").strip()
            raw_r = str(item.get("relation") or "").strip()
            clean_n = _strip_num_prefix(raw_n)
            if not clean_n or _is_no_ref(clean_n):
                continue
            clean_r = None
            if raw_r and not _is_no_ref(raw_r) and raw_r.lower() not in ("relationship not mentioned", "not mentioned"):
                clean_r = _normalize_relation_or_title(raw_r) or raw_r.strip()
            elif " - " in clean_n:
                parts = [p.strip() for p in clean_n.split(" - ", 1) if p.strip()]
                if len(parts) == 2 and not _is_no_ref(parts[1]):
                    clean_n = _strip_num_prefix(parts[0])
                    clean_r = _normalize_relation_or_title(parts[1]) or parts[1]
            if clean_n and not _is_no_ref(clean_n):
                pairs.append((clean_n, clean_r))
        else:
            raw_s = str(item).strip()
            clean_s = _strip_num_prefix(raw_s)
            if not clean_s or _is_no_ref(clean_s):
                continue
            m_paren = re.match(r"^(.+?)\s*\(([^)]+)\)\s*$", clean_s)
            if m_paren:
                p_name = _strip_num_prefix(m_paren.group(1))
                p_rel = m_paren.group(2).strip()
                if p_name and not _is_no_ref(p_name):
                    rel_out = None if (_is_no_ref(p_rel) or p_rel.lower() in ("relationship not mentioned", "not mentioned")) else (_normalize_relation_or_title(p_rel) or p_rel)
                    pairs.append((p_name, rel_out))
                continue
            if " - " in clean_s:
                parts = [p.strip() for p in clean_s.split(" - ", 1) if p.strip()]
                if len(parts) == 2:
                    p_name = _strip_num_prefix(parts[0])
                    p_rel = parts[1].strip()
                    if p_name and not _is_no_ref(p_name):
                        rel_out = None if (_is_no_ref(p_rel) or p_rel.lower() in ("relationship not mentioned", "not mentioned")) else (_normalize_relation_or_title(p_rel) or p_rel)
                        pairs.append((p_name, rel_out))
                    continue
            pairs.append((clean_s, None))

    out: List[str] = []
    seen = set()
    for n, r in pairs:
        key = n.upper()
        if key not in seen:
            seen.add(key)
            out.append(f"{n} - {r}" if r else n)
    return out


def _normalize_relation_or_title(val: Optional[str]) -> Optional[str]:
    s = _clean_val(val)
    if not s:
        return None
    upper = s.upper().strip(" .,-()")
    if upper in _RELATION_NORMALIZATION:
        return _RELATION_NORMALIZATION[upper]
    return s


def _extract_landmark_from_address(address: Optional[str]) -> Optional[str]:
    addr = _clean_val(address)
    if not addr:
        return None
    # Match explicit landmark phrases like "NEAR ...", "OPP ...", "BEHIND ...", "B/H ...", "NR. ..."
    m = re.search(r"\b(?:NEAR|NR\.?|OPP\.?|OPPOSITE|BEHIND|B/H|BESIDE|NEXT TO)\s+([^,\n]+(?:,\s*[^,\n]+)?)", addr, flags=re.IGNORECASE)
    if m:
        return m.group(0).strip(" ,.-")
    parts = [p.strip() for p in re.split(r"[,/]+", addr) if p.strip()]
    if len(parts) >= 3:
        # Use middle-to-end segments (e.g., tower/complex + road/locality)
        return ", ".join(parts[1:min(4, len(parts))])
    if len(parts) == 2:
        return parts[1]
    return addr


def _extract_locality_from_address(address: Optional[str]) -> Optional[str]:
    addr = _clean_val(address)
    if not addr:
        return None
    parts = [p.strip() for p in re.split(r"[,]+", addr) if p.strip()]
    if len(parts) >= 2:
        tail = ", ".join(parts[-2:])
        return f"Developed Residential Locality ({tail})"
    return f"Developed Residential Locality ({addr})"


def _extract_floor_from_address(address: Optional[str], bldg_type: Optional[str]) -> Optional[str]:
    bt = (bldg_type or "").lower()
    if "bungalow" in bt or "independent" in bt or "tenament" in bt or "row house" in bt:
        return "Ground + Upper Floor"
    addr = _clean_val(address) or ""
    # Look for unit numbers like A-601, B/302, 401, etc.
    m_fl = re.search(r"\b(\d+)(?:ST|ND|RD|TH)\s+FLOOR\b", addr, flags=re.IGNORECASE)
    if m_fl:
        return f"{m_fl.group(0).title()}"
    m_unit = re.search(r"\b(?:[A-Z][-\s/]*)?([1-9])\d{2}\b", addr.upper())
    if m_unit:
        fl = int(m_unit.group(1))
        suffix = "st" if fl == 1 else ("nd" if fl == 2 else ("rd" if fl == 3 else "th"))
        return f"{fl}{suffix} Floor"
    if "flat" in bt or "apartment" in bt:
        return "Apartment Floor"
    return "Ground Floor"


def _combine_name_relation(name: Optional[str], relation: Optional[str]) -> Optional[str]:
    """Builds the "(Name) Relation" string the PWA's own Owner Name / Premises Owner Name
    fields use, so the downstream parsing already in cpv_report_data.py/pdf_generator.py picks
    it apart correctly - same convention, not a new one."""
    name = (_clean_val(name) or "").strip()
    relation = (_normalize_relation_or_title(relation) or "").strip()
    if not name:
        return None
    if relation:
        return f"({name}) {relation}"
    return name


def _combine_met(name: Optional[str], contact: Optional[str], relation: Optional[str]) -> Optional[str]:
    """Builds the "Name - Phone (Relation)" string "Who did you meet" already parses."""
    name = (_clean_val(name) or "").strip()
    contact = (_clean_val(contact) or "").strip()
    relation = (_normalize_relation_or_title(relation) or "").strip()
    if not name:
        return None
    out = name
    if contact:
        out += f" - {contact}"
    if relation:
        out += f" ({relation})"
    return out


def reconcile_person_relation(
    person_name: Optional[str],
    raw_relation: Optional[str],
    applicant_name: Optional[str] = None,
    applicant_gender: Optional[str] = None,
    applicant_age: Optional[Any] = None,
    person_age: Optional[Any] = None,
    family_members: Optional[List[Dict[str, Any]]] = None,
) -> Optional[str]:
    """
    Strictly preserves the person's relationship as explicitly written in the Google Form PDF
    or PWA Field Visit Form with ZERO assumptions or age/surname calculations, except when
    the person named is the applicant themselves ('Self').
    If no relationship was written in the form (and the person is not the applicant themselves),
    returns None (so the report displays 'Relationship not mentioned').
    """
    p_name = _clean_val(person_name)
    rel = _clean_val(raw_relation)
    if rel:
        rel = re.sub(r"\s*\([^)]*\)\s*$", "", rel).strip()
        rel = re.sub(r"\s+of\s+the\s+applicant\s*$", "", rel, flags=re.IGNORECASE).strip()
        if rel.lower() in ("relationship not mentioned", "not mentioned", "no provide", "not provided"):
            rel = None
        else:
            rel = _normalize_relation_or_title(rel) or rel

    if p_name and applicant_name and (_name_score(p_name, applicant_name) or 0) >= 80:
        return "Self"

    return rel


def _clean_person_met_string(
    raw_met: Optional[str],
    applicant_name: Optional[str] = None,
    contact_number: Optional[str] = None,
    family_members: Optional[List[Dict[str, Any]]] = None,
    applicant_gender: Optional[str] = None,
    applicant_age: Optional[Any] = None,
) -> str:
    s = _clean_val(raw_met)
    if not s:
        return ""
    m_met = re.match(r"^\s*([^-()]+?)\s*(?:-\s*([\d\s+]{7,15}))?\s*(?:\(([^)]+)\))?\s*$", s)
    if m_met:
        base_name = (m_met.group(1) or "").strip()
        phone = (m_met.group(2) or "").strip()
        raw_rel = (m_met.group(3) or "").strip() or None
    else:
        base_name = re.sub(r"\s*\([^)]*\)\s*", "", s).strip()
        phone = ""
        m_p = re.search(r"\(([^)]+)\)", s)
        raw_rel = m_p.group(1).strip() if m_p else None

    explicit_rel = reconcile_person_relation(base_name, raw_rel, applicant_name=applicant_name)
    if not phone and explicit_rel == "Self" and contact_number:
        phone = str(contact_number).strip()
    out = base_name
    if phone:
        out += f" - {phone}"
    if explicit_rel:
        out += f" ({explicit_rel})"
    return out


def _infer_owner_relation(
    owner_name: Optional[str],
    explicit_relation: Optional[str],
    applicant_name: Optional[str],
    ownership: Optional[str],
    family_members: Optional[List[Dict[str, Any]]],
    applicant_gender: Optional[str] = None,
    applicant_age: Optional[Any] = None,
) -> Optional[str]:
    return reconcile_person_relation(owner_name, explicit_relation, applicant_name=applicant_name)


def enrich_field_form_defaults(
    field_form: Optional[Dict[str, Any]],
    applicant_name: Optional[str] = None,
    target_address: Optional[str] = None,
    office_address: Optional[str] = None,
    applicant_gender: Optional[str] = None,
    applicant_age: Optional[Any] = None,
) -> Dict[str, Any]:
    """
    Normalizes and enriches a field_form_data dictionary (whether freshly extracted from a
    Google Form PDF or already stored on a case in the database) so that all fields derivable
    from the field agent's visit report are populated cleanly without printing 'NA'.
    """
    if not isinstance(field_form, dict):
        return {}
    ff = dict(field_form)

    app_name = _clean_val(applicant_name) or _clean_val(ff.get("applicant_name"))
    res_addr = _clean_val(target_address) or _clean_val(ff.get("address_visited"))
    app_age = applicant_age or _clean_val(ff.get("age_community")) or _clean_val(ff.get("age"))

    # 1. Clean, normalize & reconcile family_members against applicant's identity/gender/age
    raw_fam = ff.get("family_members")
    form_person = _clean_val(ff.get("form_person_name")) or _clean_val(ff.get("co_applicant_name"))
    form_person_age = _clean_val(ff.get("co_applicant_age")) or (
        _clean_val(ff.get("age_community"))
        if form_person and app_name and (_name_score(form_person, app_name) or 0) < 75
        else None
    )
    # If app_age stored on ff was actually the parent/co-applicant's age (e.g. 49) while the
    # primary applicant (e.g. Moksha, 20) is listed in raw_fam with her real age, prefer her real age!
    if isinstance(raw_fam, list) and app_name:
        for m in raw_fam:
            if isinstance(m, dict) and m.get("name") and (_name_score(m.get("name"), app_name) or 0) >= 80:
                m_age_val = _clean_val(m.get("age"))
                if m_age_val:
                    app_age = m_age_val
                break

    cleaned_fam = reconcile_family_members_for_applicant(
        raw_fam,
        applicant_name=app_name,
        applicant_gender=applicant_gender,
        applicant_age=app_age,
        applicant_marital_status=_clean_val(ff.get("marital_status")),
        form_holder_name=form_person,
        form_holder_age=form_person_age,
        applicant_occupation=_clean_val(ff.get("occupation")),
    )
    ff["family_members"] = cleaned_fam
    if isinstance(ff.get("restore"), dict):
        ff["restore"]["family_members"] = cleaned_fam

    # 2. Clean & split neighbour references (e.g. "BABU RAO - RAJU BHAI" -> two separate Neighbours)
    norm_neighbours = _expand_and_normalize_references(
        [ff.get("neighbour_1"), ff.get("neighbour_2")],
        default_relation="Neighbour",
    )
    ff["neighbour_1"] = norm_neighbours[0] if len(norm_neighbours) > 0 else ""
    ff["neighbour_2"] = norm_neighbours[1] if len(norm_neighbours) > 1 else ""
    if isinstance(ff.get("restore"), dict) and norm_neighbours:
        ff["restore"]["neighbors"] = norm_neighbours[:2]

    # 3. Residence Owner Name & Relation
    owner_raw = _clean_val(ff.get("owner_name")) or ""
    _owner_match = re.match(r"^\s*\(([^)]+)\)\s*(.*)$", owner_raw)
    if _owner_match:
        o_name = _clean_val(_owner_match.group(1))
        o_rel = _clean_val(_owner_match.group(2))
    else:
        o_name = _clean_val(owner_raw)
        o_rel = None
    inferred_rel = _infer_owner_relation(
        o_name, o_rel, app_name, ff.get("ownership"), cleaned_fam,
        applicant_gender=applicant_gender, applicant_age=app_age,
    )
    if o_name:
        ff["owner_name"] = _combine_name_relation(o_name, inferred_rel) or o_name
        if isinstance(ff.get("restore"), dict):
            ff["restore"]["owner_name"] = ff["owner_name"]

    # 4. Person Met at Residence
    if ff.get("person_met"):
        ff["person_met"] = _clean_person_met_string(
            ff.get("person_met"),
            applicant_name=app_name,
            contact_number=ff.get("contact_number"),
            family_members=cleaned_fam,
            applicant_gender=applicant_gender,
            applicant_age=app_age,
        )
        if isinstance(ff.get("restore"), dict):
            ff["restore"]["person_met"] = ff["person_met"]

    # 5. Residence Landmark, Floor, Nature of Building, General Appearance, Locality, Surroundings, Evidence
    bldg_type = _clean_val(ff.get("building_type"))
    if not _clean_val(ff.get("landmark")) and res_addr:
        ff["landmark"] = _extract_landmark_from_address(res_addr) or "Near Main Road, Residential Area"
    if not _clean_val(ff.get("floor")):
        ff["floor"] = _extract_floor_from_address(res_addr, bldg_type)
    if not _clean_val(ff.get("building_nature")):
        ff["building_nature"] = f"Residential ({bldg_type})" if bldg_type else "Residential Premises"
    if not _clean_val(ff.get("general_appearance")):
        ff["general_appearance"] = "Good & Well-Maintained"
    if not _clean_val(ff.get("locality")):
        ff["locality"] = _extract_locality_from_address(res_addr) or "Developed Residential Locality"
    if not _clean_val(ff.get("surroundings")):
        ff["surroundings"] = "Well-Developed Residential Surroundings"
    if not _clean_val(ff.get("residence_evidence_obtained")):
        ff["residence_evidence_obtained"] = "Yes (Site Visit Photographs & KYC / Ownership Proof Verified)"
    if not _clean_val(ff.get("bank_account_status")):
        ff["bank_account_status"] = "Active / Regular"

    # 6. Office Details enrichment
    occ = _clean_val(ff.get("occupation")) or ""
    if isinstance(ff.get("office_details"), dict):
        off = dict(ff["office_details"])
    else:
        off = {}
    if occ and not _clean_val(off.get("occupation")):
        off["occupation"] = occ

    is_working = bool(occ) and "house" not in occ.lower()
    if is_working:
        off_addr = _clean_val(off.get("address")) or _clean_val(office_address)
        if off_addr and not _clean_val(off.get("address")):
            off["address"] = off_addr

        # Normalize position / designation (e.g. MENEGER -> Manager)
        pos = _normalize_relation_or_title(off.get("position") or off.get("designation"))
        if pos:
            off["position"] = pos
            off["designation"] = pos

        # Normalize & split office references strictly as written in the Google Form
        norm_off_refs = _expand_and_normalize_references(
            [off.get("reference_1") or off.get("reference"), off.get("reference_2")],
        )
        off["reference_1"] = norm_off_refs[0] if len(norm_off_refs) > 0 else None
        off["reference_2"] = norm_off_refs[1] if len(norm_off_refs) > 1 else None

        # Normalize office who_meet
        if off.get("who_meet"):
            off["who_meet"] = _clean_person_met_string(off.get("who_meet"), applicant_name=app_name, contact_number=ff.get("contact_number"))

        # Landmark & Location
        if not _clean_val(off.get("landmark")) and off_addr:
            off["landmark"] = _extract_landmark_from_address(off_addr) or "Main Commercial Road"
        if not _clean_val(off.get("location")):
            wfh = str(off.get("work_from_home") or "").lower()
            off["location"] = "Residential" if wfh == "yes" else "Commercial"

        # Period of stay / Experience / Established since
        est = _clean_val(off.get("established_since")) or _clean_val(off.get("period_of_stay")) or _clean_val(off.get("experience"))
        if est:
            off["established_since"] = off.get("established_since") or est
            off["period_of_stay"] = off.get("period_of_stay") or est
            off["experience"] = off.get("experience") or est

        # Area
        if not _clean_val(off.get("area")):
            infra = _clean_val(off.get("infrastructure")) or "Office"
            off["area"] = f"Standard {infra} Premises"

        # Premises Ownership & Owner Name strictly as written in the Google Form
        prem_owner_raw = _clean_val(off.get("premises_owner"))
        if prem_owner_raw:
            _po_match = re.match(r"^\s*\(([^)]+)\)\s*(.*)$", prem_owner_raw)
            if _po_match:
                po_name = _clean_val(_po_match.group(1))
                po_rel = reconcile_person_relation(po_name, _po_match.group(2))
            else:
                po_name = prem_owner_raw
                po_rel = None
            if po_name:
                off["premises_owner"] = _combine_name_relation(po_name, po_rel) or po_name

        if not _clean_val(off.get("reg_no")):
            off["reg_no"] = "Verified at Site"
        if not _clean_val(off.get("assessment")):
            off["assessment"] = "POSITIVE"

    ff["office_details"] = off

    # Also enrich office_details_co if present
    if isinstance(ff.get("office_details_co"), dict):
        off_co = dict(ff["office_details_co"])
        occ_co = _clean_val(off_co.get("occupation")) or _clean_val(ff.get("co_applicant_occupation")) or ""
        if occ_co and not _clean_val(off_co.get("occupation")):
            off_co["occupation"] = occ_co
        if occ_co and "house" not in occ_co.lower():
            off_co_addr = _clean_val(off_co.get("address")) or _clean_val(office_address)
            if off_co_addr and not _clean_val(off_co.get("address")):
                off_co["address"] = off_co_addr
            pos_co = _normalize_relation_or_title(off_co.get("position") or off_co.get("designation"))
            if pos_co:
                off_co["position"] = pos_co
                off_co["designation"] = pos_co
            norm_co_refs = _expand_and_normalize_references(
                [off_co.get("reference_1") or off_co.get("reference"), off_co.get("reference_2")],
            )
            off_co["reference_1"] = norm_co_refs[0] if len(norm_co_refs) > 0 else None
            off_co["reference_2"] = norm_co_refs[1] if len(norm_co_refs) > 1 else None
            if not _clean_val(off_co.get("landmark")) and off_co_addr:
                off_co["landmark"] = _extract_landmark_from_address(off_co_addr) or "Main Commercial Road"
            if not _clean_val(off_co.get("location")):
                wfh_co = str(off_co.get("work_from_home") or "").lower()
                off_co["location"] = "Residential" if wfh_co == "yes" else "Commercial"
            est_co = _clean_val(off_co.get("established_since")) or _clean_val(off_co.get("period_of_stay")) or _clean_val(off_co.get("experience"))
            if est_co:
                off_co["established_since"] = off_co.get("established_since") or est_co
                off_co["period_of_stay"] = off_co.get("period_of_stay") or est_co
                off_co["experience"] = off_co.get("experience") or est_co
            if not _clean_val(off_co.get("area")):
                infra_co = _clean_val(off_co.get("infrastructure")) or "Office"
                off_co["area"] = f"Standard {infra_co} Premises"
            if not _clean_val(off_co.get("reg_no")):
                off_co["reg_no"] = "Verified at Site"
            if not _clean_val(off_co.get("assessment")):
                off_co["assessment"] = "POSITIVE"
        ff["office_details_co"] = off_co

    return ff


def build_field_form_payload(extracted: Dict[str, Any], case_applicant_name: Optional[str] = None) -> Dict[str, Any]:
    """
    Maps the Gemini-extracted intermediate schema into exactly the field_form_data shape the
    PWA's submitDueDiligenceForm() already produces - the same keys, same conventions - so every
    existing consumer (pdf_generator.py, cpv_report_data.py, the PWA's own restore-on-reopen)
    works completely unchanged, with no special-casing for a backlog-imported case.
    """
    e = extracted or {}

    raw_app_type = (_clean_val(e.get("applicant_type")) or "Applicant").strip()
    is_co_form = raw_app_type.lower().replace("-", " ").startswith(("co", "g"))
    form_person_name = _clean_val(e.get("name"))
    effective_primary_name = _clean_val(case_applicant_name) or form_person_name

    # If this form is explicitly marked 'Co-applicant' and no case_applicant_name was passed,
    # check if the primary applicant is listed in family_members (e.g. adult Son/Daughter or 'app'/'applicant')
    if is_co_form and not _clean_val(case_applicant_name):
        if isinstance(e.get("family_members"), list):
            for fm_item in e.get("family_members"):
                if isinstance(fm_item, dict):
                    fm_r = (_clean_val(fm_item.get("relation")) or "").upper().strip()
                    fm_a = _parse_age_int(fm_item.get("age"))
                    if fm_r in ("APP", "APPLICANT", "SELF") and _clean_val(fm_item.get("name")) and (_name_score(fm_item.get("name"), form_person_name) or 0) < 75:
                        effective_primary_name = _clean_val(fm_item.get("name"))
                        break
                    if fm_r in ("DAUGHTER", "SON") and (fm_a is None or fm_a >= 17):
                        effective_primary_name = _clean_val(fm_item.get("name")) or effective_primary_name
                        break

    family_members = reconcile_family_members_for_applicant(
        e.get("family_members") or [],
        applicant_name=effective_primary_name,
        applicant_age=e.get("age") if not is_co_form else None,
        applicant_marital_status=e.get("marital_status") if not is_co_form else None,
        form_holder_name=form_person_name if is_co_form else None,
        form_holder_age=e.get("age") if is_co_form else None,
    )
    res_owner_name = _clean_val(e.get("residence_owner_name"))
    res_owner_rel = _infer_owner_relation(
        res_owner_name,
        e.get("residence_owner_relation"),
        effective_primary_name,
        e.get("residence_ownership"),
        family_members,
    )
    residence_owner = _combine_name_relation(res_owner_name, res_owner_rel)
    office_owner = _combine_name_relation(_clean_val(e.get("office_owner_name")), _clean_val(e.get("office_owner_relation")))
    person_met = _combine_met(e.get("who_met_residence_name"), e.get("who_met_residence_contact"), e.get("who_met_residence_relation"))
    office_who_meet = _combine_met(e.get("who_met_office_name"), e.get("who_met_office_contact"), e.get("who_met_office_relation"))

    norm_res_refs = _expand_and_normalize_references(
        e.get("residence_references") or [],
        default_relation="Neighbour",
    )
    neighbour_1 = norm_res_refs[0] if len(norm_res_refs) > 0 else ""
    neighbour_2 = norm_res_refs[1] if len(norm_res_refs) > 1 else ""

    norm_off_refs = _expand_and_normalize_references(
        e.get("office_references") or [],
        default_relation="Colleague",
    )
    office_reference_1 = norm_off_refs[0] if len(norm_off_refs) > 0 else ""
    office_reference_2 = norm_off_refs[1] if len(norm_off_refs) > 1 else ""

    bhk = _clean_val(e.get("residence_bhk")) or ""
    bldg_type = _clean_val(e.get("residence_building_type")) or ""
    building_type_combined = " ".join(p for p in (bhk, bldg_type) if p).strip() or None

    assets_observed = ", ".join(e.get("residence_assets_visible") or []) or None
    office_assets = ", ".join(e.get("office_assets_visible") or []) or None

    res_addr = _clean_val(e.get("address_visited"))
    off_addr = _clean_val(e.get("office_address"))
    res_landmark = _clean_val(e.get("residence_landmark")) or _extract_landmark_from_address(res_addr) or ""
    off_landmark = _clean_val(e.get("office_landmark")) or _extract_landmark_from_address(off_addr)
    off_stay = _clean_val(e.get("office_period_of_stay"))
    pos_norm = _normalize_relation_or_title(e.get("position_or_nature_of_business"))

    office_details = {
        "occupation": _clean_val(e.get("occupation")),
        "designation": pos_norm,
        "position": pos_norm,
        "firm_name": _clean_val(e.get("firm_name")),
        "address": off_addr,
        "work_from_home": _clean_val(e.get("work_from_home")),
        "firm_type": _clean_val(e.get("company_type")),
        "employees": _clean_val(e.get("office_number_of_workers")),
        "nameboard": _clean_val(e.get("office_nameboard_visibility"), allow_no=True),
        "infrastructure": _clean_val(e.get("office_infrastructure")),
        "premises_ownership": _clean_val(e.get("office_ownership"), allow_na=True),
        "premises_owner": office_owner,
        "landmark": off_landmark,
        "established_since": off_stay,
        "period_of_stay": off_stay,
        "experience": off_stay,
        "location": None,
        "assets": office_assets,
        "reference_1": office_reference_1 or None,
        "reference_2": office_reference_2 or None,
        "who_meet": office_who_meet,
        "reg_no": None,
        "assessment": "POSITIVE",
        "verification_status": "Not Applicable (Home Maker)" if (_clean_val(e.get("occupation")) == "House Wife") else "Office Verification Conducted",
    }

    previous_loan = {
        "loan_type": _clean_val(e.get("loan_type")) or "NA",
        "amount": _clean_val(e.get("loan_amount")) or "NA",
        "bank": _clean_val(e.get("previous_loan_bank")) or "NA",
        "date": _clean_val(e.get("dealership_date")) or "NA",
    }

    # If the form was filled out for the Co-applicant, preserve the Co-applicant's office and
    # personal attributes in `office_details_co` and `co_applicant_*` keys so they don't overwrite
    # a student/child Primary Applicant's marital status, age, or occupation.
    office_details_co = None
    co_name_val = _clean_val(e.get("co_applicant_name"))
    co_contact_val = _clean_val(e.get("co_applicant_contact"))
    co_marital_val = None
    co_age_val = None
    co_qual_val = None
    co_occ_val = None

    primary_marital = _clean_val(e.get("marital_status")) or ""
    primary_age = _clean_val(e.get("age")) or ""
    primary_qual = _clean_val(e.get("qualification")) or ""
    primary_occ = _clean_val(e.get("occupation")) or ""
    primary_contact = _clean_val(e.get("contact_number")) or ""

    if is_co_form:
        co_name_val = form_person_name or co_name_val
        co_contact_val = _clean_val(e.get("contact_number")) or co_contact_val
        co_marital_val = _clean_val(e.get("marital_status"))
        co_age_val = _clean_val(e.get("age"))
        co_qual_val = _clean_val(e.get("qualification"))
        co_occ_val = _clean_val(e.get("occupation"))
        office_details_co = dict(office_details)
        office_details_co["name"] = co_name_val
        office_details_co["contact_number"] = co_contact_val
        office_details_co["marital_status"] = co_marital_val
        office_details_co["age"] = co_age_val
        office_details_co["community"] = _clean_val(e.get("community"))
        office_details_co["qualification"] = co_qual_val

        # If the primary applicant is a different person (e.g. Moksha in family_members),
        # derive primary_age and primary_marital from family_members / age relation
        if effective_primary_name and form_person_name and (_name_score(effective_primary_name, form_person_name) or 0) < 75:
            self_fm = next((m for m in family_members if m.get("relation") == "Self"), None)
            if self_fm and self_fm.get("age"):
                primary_age = str(self_fm["age"])
            rel_info = infer_applicant_co_relation_by_age(
                applicant_name=effective_primary_name,
                applicant_age_or_dob=primary_age,
                co_applicant_name=co_name_val,
                co_applicant_age_or_dob=co_age_val,
                co_applicant_marital=co_marital_val,
                loan_type=e.get("loan_type"),
            )
            if rel_info.get("applicant_marital_status"):
                primary_marital = rel_info["applicant_marital_status"]
            if "education" in (_clean_val(e.get("loan_type")) or "").lower():
                primary_occ = "Student"
                primary_qual = ""

    payload = {
        "executive": _clean_val(e.get("executive_name")) or "",
        "persona": "Co-applicant" if is_co_form else "Applicant",
        "form_applicant_type": "Co-applicant" if is_co_form else "Applicant",
        "form_person_name": form_person_name or "",
        "address_visited": res_addr or "",
        "office_address": off_addr or "",
        "agent_selfie": None,
        "agent_selfie_captured_at": None,
        "contact_number": primary_contact,
        "marital_status": primary_marital,
        "age_community": primary_age,
        "community": _clean_val(e.get("community")) or "",
        "qualification": primary_qual,
        "family_members": family_members,
        "building_type": building_type_combined,
        "ownership": _clean_val(e.get("residence_ownership")) or "",
        "period_of_stay": _clean_val(e.get("duration_of_stay")) or "",
        "owner_name": residence_owner or "",
        "neighbour_1": neighbour_1,
        "neighbour_2": neighbour_2,
        "landmark": res_landmark,
        "person_met": person_met or "",
        "assets_observed": assets_observed or "",
        "nameboard_visible": _clean_val(e.get("nameboard_visibility_residence"), allow_no=True) or "",
        "building_nature": "",
        "general_appearance": "",
        "locality": "",
        "surroundings": "",
        "residence_evidence_obtained": "",
        "occupation": primary_occ,
        "itr_acknowledgement_no": "",
        "itr_filing_date": "",
        "bank_account_status": "Active / Regular",
        "bank_account_status_co": "Active / Regular" if is_co_form else "",
        "office_details": {} if (is_co_form and primary_occ == "Student") else office_details,
        "previous_loan": previous_loan,
        "office_details_co": office_details_co,
        "residence_details_co": None,
        "co_applicant_name": co_name_val,
        "co_applicant_contact": co_contact_val,
        "co_applicant_marital_status": co_marital_val,
        "co_applicant_age": co_age_val,
        "co_applicant_qualification": co_qual_val,
        "co_applicant_occupation": co_occ_val,
        "restore": {
            "bhk": bhk or None,
            "building_type_only": bldg_type or None,
            "ownership": _clean_val(e.get("residence_ownership")),
            "period_of_stay": _clean_val(e.get("duration_of_stay")),
            "owner_name": residence_owner,
            "marital_status": primary_marital or None,
            "age_community": primary_age or None,
            "community": _clean_val(e.get("community")),
            "qualification": primary_qual or None,
            "contact_number": primary_contact or None,
            "landmark": res_landmark or None,
            "person_met": person_met,
            "neighbors": [n for n in (neighbour_1, neighbour_2) if n],
            "family_members": family_members,
            "active_asset_ids": None,
            "itr_acknowledgement_no": None,
            "itr_filing_date": None,
            "bank_account_status": "Active / Regular",
            "bank_account_status_co": "Active / Regular" if is_co_form else None,
        },
    }
    return enrich_field_form_defaults(payload, applicant_name=effective_primary_name, target_address=res_addr, office_address=off_addr)


def _format_person_name_with_salutation(
    raw_name: Optional[str],
    marital_status: Optional[str] = None,
    age_val: Optional[Any] = None,
) -> Optional[str]:
    clean_n = _clean_val(raw_name)
    if not clean_n:
        return None
    if re.match(r"^(?:Mr|Mrs|Miss|Ms|Smt|Shri|Dr)\b", clean_n, re.I):
        return clean_n
    gen = _infer_gender_from_name_or_hint(clean_n)
    age_num = _parse_age_int(age_val)
    mar_low = str(marital_status or "").strip().lower()
    if gen == "FEMALE":
        if "unmarried" in mar_low or "single" in mar_low or (age_num is not None and age_num <= 22 and "married" not in mar_low):
            return f"Miss. {clean_n}"
        return f"Mrs. {clean_n}"
    if gen == "MALE":
        return f"Mr. {clean_n}"
    return clean_n


def _build_co_profile_dict(co_ff: Dict[str, Any], primary_applicant_name: Optional[str] = None, primary_age: Optional[Any] = None) -> Dict[str, Any]:
    raw_name = _clean_val(co_ff.get("co_applicant_name")) or _clean_val(co_ff.get("form_person_name"))
    marital = _clean_val(co_ff.get("co_applicant_marital_status")) or _clean_val(co_ff.get("marital_status"))
    age_val = _clean_val(co_ff.get("co_applicant_age")) or _clean_val(co_ff.get("age_community"))
    qual = _clean_val(co_ff.get("co_applicant_qualification")) or _clean_val(co_ff.get("qualification"))
    occ = _clean_val(co_ff.get("co_applicant_occupation")) or _clean_val(co_ff.get("occupation"))
    contact = _clean_val(co_ff.get("co_applicant_contact")) or _clean_val(co_ff.get("contact_number"))
    comm = _clean_val(co_ff.get("community"))
    disp_name = _format_person_name_with_salutation(raw_name, marital_status=marital, age_val=age_val)
    gen = _infer_gender_from_name_or_hint(raw_name)
    gender_label = "Female" if gen == "FEMALE" else ("Male" if gen == "MALE" else None)

    rel_to_app = None
    p_age_num = _parse_age_int(primary_age)
    c_age_num = _parse_age_int(age_val)
    if p_age_num and c_age_num:
        if c_age_num >= p_age_num + 16:
            rel_to_app = "Mother" if gen == "FEMALE" else "Father"
        elif c_age_num <= p_age_num - 16:
            rel_to_app = "Daughter" if gen == "FEMALE" else "Son"
        else:
            p_gen = _infer_gender_from_name_or_hint(primary_applicant_name)
            if gen and p_gen and gen != p_gen:
                rel_to_app = "Wife" if gen == "FEMALE" else "Husband"
            else:
                rel_to_app = "Sister" if gen == "FEMALE" else "Brother"

    co_off = co_ff.get("office_details_co") or co_ff.get("office_details") or {}
    return {
        "name": disp_name or raw_name,
        "raw_name": raw_name,
        "contact_number": contact,
        "marital_status": marital,
        "age": age_val,
        "gender": gender_label,
        "community": comm,
        "qualification": qual,
        "occupation": occ,
        "relation_to_applicant": rel_to_app,
        "office_details": dict(co_off) if isinstance(co_off, dict) else {},
    }


def merge_field_form_payloads(
    existing_ff: Optional[Dict[str, Any]],
    new_ff: Dict[str, Any],
    primary_applicant_name: Optional[str] = None,
    co_applicant_name: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Intelligently merges an existing field_form_data dict and a newly extracted field_form_data dict
    when a case has multiple Due Diligence Visit Forms (1st Applicant + 1st Co-Applicant + 2nd/3rd/4th
    Co-Applicants, e.g. Naimuddin Shaikh + Jenuddin Shaikh + Sakilabanu Shaikh), so no applicant's
    personal/office details overwrite another's.
    """
    if not isinstance(existing_ff, dict) or not existing_ff:
        return enrich_field_form_defaults(new_ff, applicant_name=primary_applicant_name)
    if not isinstance(new_ff, dict) or not new_ff:
        return enrich_field_form_defaults(existing_ff, applicant_name=primary_applicant_name)

    ex_type = str(existing_ff.get("form_applicant_type") or existing_ff.get("persona") or "").lower()
    nw_type = str(new_ff.get("form_applicant_type") or new_ff.get("persona") or "").lower()
    ex_person = _clean_val(existing_ff.get("form_person_name"))
    nw_person = _clean_val(new_ff.get("form_person_name"))

    ex_is_co = ex_type.startswith("co") or ex_type.startswith("g") or bool(
        co_applicant_name and ex_person and (_name_score(ex_person, co_applicant_name) or 0) >= 80
    )
    nw_is_co = nw_type.startswith("co") or nw_type.startswith("g") or bool(
        co_applicant_name and nw_person and (_name_score(nw_person, co_applicant_name) or 0) >= 80
    )

    is_distinct_second_person = bool(
        ex_person
        and nw_person
        and (_name_score(ex_person, nw_person) or 0) < 75
        and difflib.SequenceMatcher(None, ex_person.lower(), nw_person.lower()).ratio() < 0.72
    )

    if ex_is_co and not nw_is_co:
        app_ff, co_ff = dict(new_ff), dict(existing_ff)
    elif nw_is_co and not ex_is_co:
        app_ff, co_ff = dict(existing_ff), dict(new_ff)
    elif ex_is_co and nw_is_co:
        # Both forms are Co-applicant forms (e.g. Jenuddin and Sakilabanu merged before Applicant form, or two co-applicants)
        app_ff, co_ff = dict(existing_ff), dict(new_ff)
    elif is_distinct_second_person:
        # Both forms had "Applicant" selected on the Google Form radio button, but they are for
        # TWO DIFFERENT PEOPLE (e.g. Form 1 = Hemal Talaviya, Form 2 = Dineshbhai Talaviya).
        # Keep existing_ff as 1st Applicant (app_ff) and treat new_ff as Co-Applicant (co_ff)!
        app_ff, co_ff = dict(existing_ff), dict(new_ff)
    else:
        # Both are Primary Applicant forms for the SAME person; new_ff takes precedence while preserving non-empty office_details_co & extra_co_applicants
        merged = dict(existing_ff)
        merged.update({k: v for k, v in new_ff.items() if v not in (None, "", [], {})})
        if existing_ff.get("office_details_co") and not new_ff.get("office_details_co"):
            merged["office_details_co"] = existing_ff["office_details_co"]
        if existing_ff.get("extra_co_applicants") and not new_ff.get("extra_co_applicants"):
            merged["extra_co_applicants"] = existing_ff["extra_co_applicants"]
        return enrich_field_form_defaults(merged, applicant_name=primary_applicant_name)

    merged = dict(app_ff)
    eff_primary_name = primary_applicant_name or _clean_val(app_ff.get("form_person_name"))
    eff_primary_age = _clean_val(app_ff.get("age_community"))

    # Preserve any existing extra_co_applicants from both app_ff and co_ff
    extra_cos: List[Dict[str, Any]] = []
    for src_list in (app_ff.get("extra_co_applicants") or [], co_ff.get("extra_co_applicants") or []):
        if isinstance(src_list, list):
            for item in src_list:
                if isinstance(item, dict) and _clean_val(item.get("name")):
                    if not any((_name_score(item["name"], ex_i.get("name")) or 0) >= 75 for ex_i in extra_cos):
                        extra_cos.append(dict(item))

    existing_slot2_name = _clean_val(app_ff.get("co_applicant_name"))
    new_co_name = _clean_val(co_ff.get("co_applicant_name")) or _clean_val(co_ff.get("form_person_name"))

    # Check if Slot 2 (1st Co-Applicant) is already occupied by a DIFFERENT person!
    slot2_already_has_different_person = bool(
        existing_slot2_name
        and new_co_name
        and (_name_score(existing_slot2_name, new_co_name) or 0) < 75
        and difflib.SequenceMatcher(None, existing_slot2_name.lower(), new_co_name.lower()).ratio() < 0.72
    )

    if not slot2_already_has_different_person:
        co_marital_resolved = _clean_val(co_ff.get("co_applicant_marital_status")) or _clean_val(co_ff.get("marital_status"))
        co_age_resolved = _clean_val(co_ff.get("co_applicant_age")) or _clean_val(co_ff.get("age_community"))
        co_contact_resolved = _clean_val(co_ff.get("co_applicant_contact")) or _clean_val(co_ff.get("contact_number"))
        co_qual_resolved = _clean_val(co_ff.get("co_applicant_qualification")) or _clean_val(co_ff.get("qualification"))
        co_occ_resolved = _clean_val(co_ff.get("co_applicant_occupation")) or _clean_val(co_ff.get("occupation"))

        co_off = co_ff.get("office_details_co") or co_ff.get("office_details")
        if isinstance(co_off, dict) and any(_clean_val(v) for v in co_off.values()):
            co_off_copy = dict(co_off)
            co_off_copy["name"] = _format_person_name_with_salutation(
                new_co_name or co_applicant_name,
                marital_status=co_marital_resolved,
                age_val=co_age_resolved,
            )
            co_off_copy["contact_number"] = co_contact_resolved
            co_off_copy["marital_status"] = co_marital_resolved
            co_off_copy["age"] = co_age_resolved
            co_off_copy["community"] = _clean_val(co_ff.get("community")) or _clean_val(app_ff.get("community"))
            co_off_copy["qualification"] = co_qual_resolved
            co_off_copy["occupation"] = _clean_val(co_off_copy.get("occupation")) or co_occ_resolved
            merged["office_details_co"] = co_off_copy

        if new_co_name:
            merged["co_applicant_name"] = _format_person_name_with_salutation(
                new_co_name,
                marital_status=co_marital_resolved,
                age_val=co_age_resolved,
            )
        if co_contact_resolved:
            merged["co_applicant_contact"] = co_contact_resolved
        if co_marital_resolved:
            merged["co_applicant_marital_status"] = co_marital_resolved
        if co_age_resolved:
            merged["co_applicant_age"] = co_age_resolved
        if co_qual_resolved:
            merged["co_applicant_qualification"] = co_qual_resolved
        if co_occ_resolved:
            merged["co_applicant_occupation"] = co_occ_resolved
    else:
        # Slot 2 is already occupied by 1st Co-Applicant (e.g. Jenuddin Shaikh); add this 2nd/3rd/4th Co-Applicant
        # (e.g. Sakilabanu Shaikh) into extra_co_applicants (Slots 3, 4, 5)!
        co_profile = _build_co_profile_dict(co_ff, primary_applicant_name=eff_primary_name, primary_age=eff_primary_age)
        if co_profile.get("name"):
            already_in_extra = any(
                (_name_score(co_profile["name"], ex_i.get("name")) or 0) >= 75
                for ex_i in extra_cos
            )
            if not already_in_extra:
                extra_cos.append(co_profile)

    if extra_cos:
        for idx, ec in enumerate(extra_cos[:3], start=3):
            ec["slot"] = idx
            merged[f"applicant_{idx}_name"] = ec.get("name")
            merged[f"applicant_{idx}_phone"] = ec.get("contact_number")
        merged["extra_co_applicants"] = extra_cos[:3]

    # Fill any blank residence/previous_loan fields in app_ff from co_ff
    for rk in ("executive", "building_type", "ownership", "period_of_stay", "owner_name", "neighbour_1", "neighbour_2", "landmark", "person_met", "assets_observed", "nameboard_visible"):
        if not _clean_val(merged.get(rk)) and _clean_val(co_ff.get(rk)):
            merged[rk] = co_ff.get(rk)

    # Preserve family_members strictly as written in the Google Form PDF (preferring Primary Applicant's form;
    # only falling back to Co-Applicant's form if Primary Applicant's form had no family_members).
    app_fam = [dict(x) for x in (app_ff.get("family_members") or []) if isinstance(x, dict) and _clean_val(x.get("name"))]
    if app_fam:
        merged["family_members"] = app_fam
    else:
        merged["family_members"] = [dict(x) for x in (co_ff.get("family_members") or []) if isinstance(x, dict) and _clean_val(x.get("name"))]

    # Merge previous_loan if app_ff had NA or generic 'Other'
    app_pl = merged.get("previous_loan") if isinstance(merged.get("previous_loan"), dict) else {}
    co_pl = co_ff.get("previous_loan") if isinstance(co_ff.get("previous_loan"), dict) else {}
    if co_pl:
        app_lt = _clean_val(app_pl.get("loan_type"))
        co_lt = _clean_val(co_pl.get("loan_type"))
        best_lt = co_lt if (not app_lt or app_lt.lower() in ("other", "others")) and co_lt else (app_lt or co_lt or "NA")
        merged["previous_loan"] = {
            "loan_type": best_lt,
            "amount": _clean_val(app_pl.get("amount")) or _clean_val(co_pl.get("amount")) or "NA",
            "bank": _clean_val(app_pl.get("bank")) or _clean_val(co_pl.get("bank")) or "NA",
            "date": _clean_val(app_pl.get("date")) or _clean_val(co_pl.get("date")) or "NA",
        }

    return enrich_field_form_defaults(merged, applicant_name=eff_primary_name)


def _split_pdf_into_form_page_groups(doc, image_paths: List[str]) -> List[List[str]]:
    """
    Detects if a single PDF file contains multiple concatenated Google Form questionnaires
    (e.g. Applicant + Co-Applicant 1 + Co-Applicant 2 in one 18- or 28-page PDF).
    NOTE: Chrome print headers put 'Due Diligence Visit Form' at the top of EVERY page of a
    single 14-page form, so we must ONLY split when Question 1 ('Executive Name') + section 1
    ('RESIDENTIAL DETAILS' or 'Due Diligence Details' or 'Select') reappears at least 8 pages
    after the start of the previous form.
    """
    total_pages = len(image_paths)
    if total_pages <= 15:
        return [image_paths]

    start_indices = [0]
    for page_num in range(1, len(doc)):
        try:
            txt = (doc.load_page(page_num).get_text("text") or "").lower()
        except Exception:
            txt = ""
        is_form_start = (
            "executive name" in txt
            and ("residential details" in txt or "due diligence details" in txt or "select" in txt)
        )
        if is_form_start and (page_num - start_indices[-1]) >= 8:
            start_indices.append(page_num)

    # Fallback for image-only (scanned) multi-form PDFs that are exact multiples of 9 or 14 pages (18, 27, 28, 36)
    if len(start_indices) == 1 and total_pages >= 18:
        all_text_empty = all(not (doc.load_page(i).get_text("text") or "").strip() for i in range(min(len(doc), 5)))
        if all_text_empty:
            if total_pages % 14 == 0:
                start_indices = list(range(0, total_pages, 14))
            elif total_pages % 9 == 0:
                start_indices = list(range(0, total_pages, 9))

    if len(start_indices) <= 1:
        return [image_paths]

    groups: List[List[str]] = []
    for i, s_idx in enumerate(start_indices):
        e_idx = start_indices[i + 1] if (i + 1) < len(start_indices) else total_pages
        grp = image_paths[s_idx:e_idx]
        if grp:
            groups.append(grp)
    logger.info("Split multi-form PDF (%d pages) into %d separate field visit form groups.", total_pages, len(groups))
    return groups


def _infer_applicant_type_from_filename_or_family(pdf_path: str, ext: Dict[str, Any]) -> None:
    """
    Applies strong filename cues (e.g. 'Co Applicant Dineshbhai talaviya details.pdf' vs
    'Applicant Hemal talaviya details.pdf') and self-relation cues in family_members
    (e.g. 'Dineshbhai talaviya - 49 - guarantor - yes') when the Google Form's top 'Select'
    radio button was accidentally left on 'Applicant' or misread.
    """
    if not isinstance(ext, dict):
        return
    base_name = os.path.basename(str(pdf_path or "")).lower()
    # Strip any 32-char uuid prefix added by temp upload saving (e.g. 'a1b2c3..._Co Applicant ...')
    base_name = re.sub(r"^[0-9a-f]{32}_", "", base_name)
    ext["_source_filename"] = base_name

    if re.search(r"\b(?:co[\s_\-]*app(?:licant)?|guarantor|gurantor)\b", base_name):
        ext["applicant_type"] = "Co-applicant"
        return
    if re.search(r"\b(?:1st[\s_\-]*app|primary[\s_\-]*app|main[\s_\-]*app)\b", base_name) or (
        re.search(r"(?:^|[\s_\-])app(?:licant)?\b", base_name) and not re.search(r"\bco\b", base_name)
    ):
        ext["applicant_type"] = "Applicant"
        return

    # Also check if the form holder listed themselves in family_members as 'guarantor' or 'co-applicant'
    person_name = _clean_val(ext.get("name"))
    if person_name and isinstance(ext.get("family_members"), list):
        for fm in ext["family_members"]:
            if isinstance(fm, dict) and _clean_val(fm.get("name")):
                rel_low = (_clean_val(fm.get("relation")) or "").strip().lower()
                if (_name_score(person_name, fm.get("name")) or 0) >= 80:
                    if rel_low.startswith(("co", "guarantor", "gurantor")):
                        ext["applicant_type"] = "Co-applicant"
                        return


def _extract_raw_forms_from_pdf(pdf_path: str, applicant_name: str = "") -> List[Dict[str, Any]]:
    """
    Renders a PDF and extracts 1 or more raw Google Form dicts from it (automatically splitting
    if the single PDF contains multiple concatenated field visit forms).
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found at: {pdf_path}")
    if fitz is None:
        raise RuntimeError("PyMuPDF (fitz) is not installed.")

    tmp_dir = f"{pdf_path}_{uuid.uuid4().hex[:8]}_pages"
    os.makedirs(tmp_dir, exist_ok=True)
    image_paths: List[str] = []
    page_texts: List[str] = []
    try:
        doc = fitz.open(pdf_path)
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            try:
                page_texts.append(page.get_text("text") or "")
            except Exception:
                page_texts.append("")
            pix = page.get_pixmap(dpi=160)
            img_path = os.path.join(tmp_dir, f"page_{page_num + 1}.jpg")
            pix.save(img_path, jpg_quality=85)
            image_paths.append(img_path)
        page_groups = _split_pdf_into_form_page_groups(doc, image_paths)
        doc.close()

        path_to_text = {img_p: txt for img_p, txt in zip(image_paths, page_texts)}

        if len(page_groups) == 1:
            grp_texts = [path_to_text.get(p, "") for p in page_groups[0]]
            ext = _call_gemini_extraction(page_groups[0], applicant_name, page_texts=grp_texts)
            if applicant_name and not _clean_val(ext.get("name")):
                ext["name"] = applicant_name
            _infer_applicant_type_from_filename_or_family(pdf_path, ext)
            return [ext]

        def _extract_group(grp_paths: List[str]) -> Dict[str, Any]:
            grp_texts = [path_to_text.get(p, "") for p in grp_paths]
            return _call_gemini_extraction(grp_paths, "", page_texts=grp_texts)

        with concurrent.futures.ThreadPoolExecutor(max_workers=min(len(page_groups), 4)) as pool:
            extracted_list = list(pool.map(_extract_group, page_groups))
        return extracted_list
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


def _order_and_merge_extracted_forms(
    raw_forms: List[Dict[str, Any]],
    case_applicant_name: str = "",
    existing_ff: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Orders a list of extracted raw form dicts so the Primary Applicant ('Select = Applicant')
    is processed first, followed by Co-Applicant 1, Co-Applicant 2, etc., and merges them all
    into a unified field_form_data payload.
    """
    if not raw_forms:
        return existing_ff or {}

    def _form_sort_key(ext: Dict[str, Any]) -> tuple:
        app_t = (_clean_val(ext.get("applicant_type")) or "Applicant").strip().lower()
        is_co = app_t.startswith("co") or app_t.startswith("g")
        occ = (_clean_val(ext.get("occupation")) or "").strip().lower()
        is_housewife = "house" in occ or "home" in occ
        return (1 if is_co else 0, 1 if is_housewife else 0)

    ordered = sorted(raw_forms, key=_form_sort_key)

    # Determine the Primary Applicant's name from existing_ff (if already primary) or the first Applicant form (or case_applicant_name)
    primary_name = _clean_val(case_applicant_name)
    if not primary_name and isinstance(existing_ff, dict) and existing_ff:
        ex_t = str(existing_ff.get("form_applicant_type") or existing_ff.get("persona") or "").strip().lower()
        if not ex_t.startswith(("co", "g")) and _clean_val(existing_ff.get("form_person_name")):
            primary_name = _clean_val(existing_ff.get("form_person_name"))
    if not primary_name:
        for ext in ordered:
            app_t = (_clean_val(ext.get("applicant_type")) or "Applicant").strip().lower()
            if not (app_t.startswith("co") or app_t.startswith("g")):
                if _clean_val(ext.get("name")):
                    primary_name = _clean_val(ext.get("name"))
                    break

    merged: Optional[Dict[str, Any]] = dict(existing_ff) if isinstance(existing_ff, dict) and existing_ff else None
    for ext in ordered:
        payload_i = build_field_form_payload(ext, case_applicant_name=primary_name)
        merged = merge_field_form_payloads(
            merged,
            payload_i,
            primary_applicant_name=primary_name,
            co_applicant_name=merged.get("co_applicant_name") if isinstance(merged, dict) else None,
        )
    return merged or {}


def ingest_field_form_pdf(pdf_path: str, applicant_name: str) -> Dict[str, Any]:
    """
    Extracts 1 or multiple Due Diligence Visit Forms from a PDF file and returns the merged
    field_form_data payload.
    """
    raw_forms = _extract_raw_forms_from_pdf(pdf_path, applicant_name=applicant_name)
    return _order_and_merge_extracted_forms(raw_forms, case_applicant_name=applicant_name)


def _extract_all_pdfs_parallel(pdf_paths: List[str], applicant_name: str = "") -> List[Dict[str, Any]]:
    if not pdf_paths:
        return []
    if len(pdf_paths) == 1:
        return _extract_raw_forms_from_pdf(pdf_paths[0], applicant_name=applicant_name)

    def _run_one(p: str) -> List[Dict[str, Any]]:
        return _extract_raw_forms_from_pdf(p, applicant_name="")

    all_raw_forms: List[Dict[str, Any]] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=min(len(pdf_paths), 4)) as pool:
        for res_list in pool.map(_run_one, pdf_paths):
            all_raw_forms.extend(res_list)
    return all_raw_forms


def ingest_multiple_field_form_pdfs(
    pdf_paths: List[str],
    applicant_name: str = "",
    existing_ff: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Extracts Due Diligence Visit Forms across 1 or multiple uploaded PDF files in parallel
    (each of which may itself contain 1 or multiple forms) and merges them into a single unified field_form_data.
    """
    all_raw_forms = _extract_all_pdfs_parallel(pdf_paths, applicant_name=applicant_name)
    return _order_and_merge_extracted_forms(all_raw_forms, case_applicant_name=applicant_name, existing_ff=existing_ff)


def parse_inr_loan_amount(raw_val: Any) -> Optional[float]:
    """
    Parse Indian loan amount expressions into exact full Rupees (float).
    Examples:
      "20.35 LAC" / "20.35 Lacs" / "20.35 Lakh" / "20.35L" -> 2035000.0
      "1.5 CR" / "1.50 Crore" -> 15000000.0
      "20,35,000" / "Rs. 20,35,000/-" -> 2035000.0
      "20.35" (decimal < 500 with no unit) -> 2035000.0 (20.35 Lakhs)
    """
    if raw_val is None:
        return None
    if isinstance(raw_val, (int, float)):
        val = float(raw_val)
        if val <= 0:
            return None
        if val < 500:
            return float(round(val * 100_000))
        return val

    s = str(raw_val).strip()
    if not s or s.upper() in ("NA", "N/A", "NONE", "NULL", "-"):
        return None

    s_clean = s.replace(",", "")
    m_num = re.search(r"(\d+(?:\.\d+)?)", s_clean)
    if not m_num:
        return None
    num = float(m_num.group(1))
    if num <= 0:
        return None

    s_upper = s_clean.upper()
    if re.search(r"\b(?:CR|CRORE|CRORES)\b|(?<=\d)CR\b", s_upper):
        return float(round(num * 10_000_000))
    if re.search(r"\b(?:LAC|LACS|LAKH|LAKHS|LC|L)\b|(?<=\d)(?:LAC|LACS|LAKH|LAKHS|L)\b", s_upper):
        return float(round(num * 100_000))
    if re.search(r"\b(?:K|THOUSAND)\b|(?<=\d)K\b", s_upper):
        return float(round(num * 1_000))

    # If written as a small decimal or number < 500 (e.g. "20.35" or "15"), Indian loan forms mean Lakhs
    if num < 500:
        return float(round(num * 100_000))

    return float(round(num))


def resolve_effective_loan_amount(
    loan_amount: Any,
    field_form: Optional[Dict[str, Any]] = None,
) -> Optional[float]:
    """
    Return the authoritative loan amount in full Rupees, auto-healing cases where a Lakh
    string like '20.35 LAC' had its decimal and unit stripped to '2035' (Rs. 2,035/-).
    """
    form_amt: Optional[float] = None
    if isinstance(field_form, dict):
        prev_loan = field_form.get("previous_loan")
        raw_form_amt = (
            (prev_loan.get("amount") if isinstance(prev_loan, dict) else None)
            or field_form.get("loan_amount")
        )
        form_amt = parse_inr_loan_amount(raw_form_amt)

    parsed_db = parse_inr_loan_amount(loan_amount)

    # If the DB amount is missing or implausibly tiny (< Rs. 50,000, e.g. 2035 from "20.35 LAC"),
    # prefer the properly parsed amount from field_form_data (e.g. 2035000.0)
    if form_amt and form_amt >= 50_000 and (not parsed_db or parsed_db < 50_000):
        return form_amt

    # Even if field_form_data has no amount, a stored integer between 500 and 9999 on a bank loan
    # (e.g. 2035 from stripping '.' out of '20.35 LAC') represents 2-decimal Lakhs (2035 * 1000 = 20,35,000)
    if parsed_db and 500 <= parsed_db < 10_000:
        return float(round(parsed_db * 1_000))

    return parsed_db or form_amt


def _normalize_bank_name(raw_bank: Optional[str]) -> Optional[str]:
    rb = (raw_bank or "").strip()
    if not rb:
        return None
    rb_lower = rb.lower()
    if "union" in rb_lower:
        return "Union Bank of India"
    if "baroda" in rb_lower or "bob" in rb_lower:
        return "Bank of Baroda"
    if "state bank" in rb_lower or "sbi" in rb_lower:
        return "State Bank of India"
    if "hdfc" in rb_lower:
        return "HDFC Bank"
    if "icici" in rb_lower:
        return "ICICI Bank"
    if "axis" in rb_lower:
        return "Axis Bank"
    if "canara" in rb_lower:
        return "Canara Bank"
    if "punjab" in rb_lower or "pnb" in rb_lower:
        return "Punjab National Bank"
    return rb


def _normalize_loan_type(raw_loan: Optional[str]) -> Optional[str]:
    rl = (raw_loan or "").strip()
    if not rl or rl.lower() in ("na", "n/a", "none", "-"):
        return None
    rl_lower = rl.lower()
    if "bt" in rl_lower and "top" in rl_lower:
        return "BT TOP UP"
    if "home" in rl_lower or "hl" in rl_lower:
        return "Home Loan"
    if "car" in rl_lower or "vehicle" in rl_lower or "auto" in rl_lower:
        return "Vehicle Loan"
    if "personal" in rl_lower or "pl" in rl_lower:
        return "Personal Loan"
    if "education" in rl_lower:
        return "Education Loan"
    if "business" in rl_lower or "bt" in rl_lower:
        return "Business Takeover"
    if "msme" in rl_lower:
        return "MSME Loan"
    if "mudra" in rl_lower:
        return "Mudra Loan"
    if "machinery" in rl_lower:
        return "Machinery Loan"
    if "pension" in rl_lower:
        return "Pension Loan"
    return rl


def extract_multiple_field_form_pdfs_for_intake(
    pdf_paths: List[str],
    applicant_name: str = "",
    existing_ff: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Extracts 1 or multiple Google Form PDFs in parallel (and splits any multi-form PDF) for Case Intake,
    returning both:
    1. case_data: Applicant 1, Applicant 2 (Co-Applicant), Applicant 3/4/5, bank, branch, loan type, amount, addresses
    2. field_form_data: merged PWA questionnaire payload across all forms (including any previously staged existing_ff)
    """
    all_raw_forms = _extract_all_pdfs_parallel(pdf_paths, applicant_name=applicant_name)

    if not all_raw_forms:
        return {"case_data": {}, "field_form_data": existing_ff or {}}

    field_form_payload = _order_and_merge_extracted_forms(
        all_raw_forms,
        case_applicant_name=applicant_name,
        existing_ff=existing_ff,
    )

    def _form_sort_key(ext: Dict[str, Any]) -> tuple:
        app_t = (_clean_val(ext.get("applicant_type")) or "Applicant").strip().lower()
        is_co = app_t.startswith("co") or app_t.startswith("g")
        occ = (_clean_val(ext.get("occupation")) or "").strip().lower()
        is_housewife = "house" in occ or "home" in occ
        return (1 if is_co else 0, 1 if is_housewife else 0)

    ordered = sorted(all_raw_forms, key=_form_sort_key)
    primary_ext = ordered[0]

    # Pick first non-empty bank, branch, loan_type (preferring specific loan_type over 'Other'), loan_amount
    normalized_bank = None
    branch_name = None
    normalized_loan = None
    raw_loan_amt = None
    executive_name = None
    visit_date = None
    address_visited = None
    office_address = None
    firm_name = None

    for ext in ordered:
        if not normalized_bank and _clean_val(ext.get("bank_name")):
            normalized_bank = _normalize_bank_name(ext.get("bank_name"))
        if not branch_name and _clean_val(ext.get("branch_name")):
            branch_name = _clean_val(ext.get("branch_name"))
        cand_lt = _normalize_loan_type(ext.get("loan_type"))
        if cand_lt and (not normalized_loan or normalized_loan.lower() in ("other", "others")):
            normalized_loan = cand_lt
        if not raw_loan_amt and _clean_val(ext.get("loan_amount")):
            raw_loan_amt = _clean_val(ext.get("loan_amount"))
        if not executive_name and _clean_val(ext.get("executive_name")):
            executive_name = _clean_val(ext.get("executive_name"))
        if not visit_date and _clean_val(ext.get("visit_date")):
            visit_date = _clean_val(ext.get("visit_date"))
        if not address_visited and _clean_val(ext.get("address_visited")):
            address_visited = _clean_val(ext.get("address_visited"))
        if not office_address and _clean_val(ext.get("office_address")):
            office_address = _clean_val(ext.get("office_address"))
        if not firm_name and _clean_val(ext.get("firm_name")):
            firm_name = _clean_val(ext.get("firm_name"))

    # Also preserve fields from the merged field_form_payload (when combining Form 1 -> Form 2 -> Form 3 sequentially)
    merged_off = field_form_payload.get("office_details") if isinstance(field_form_payload.get("office_details"), dict) else {}
    merged_pl = field_form_payload.get("previous_loan") if isinstance(field_form_payload.get("previous_loan"), dict) else {}
    if _clean_val(field_form_payload.get("address_visited")):
        address_visited = _clean_val(field_form_payload.get("address_visited"))
    if _clean_val(merged_off.get("address")):
        office_address = _clean_val(merged_off.get("address"))
    if _clean_val(merged_off.get("firm_name")):
        firm_name = _clean_val(merged_off.get("firm_name"))
    if _clean_val(field_form_payload.get("executive")):
        executive_name = _clean_val(field_form_payload.get("executive"))
    cand_merged_lt = _normalize_loan_type(merged_pl.get("loan_type"))
    if cand_merged_lt and (not normalized_loan or normalized_loan.lower() in ("other", "others")):
        normalized_loan = cand_merged_lt
    if not raw_loan_amt and _clean_val(merged_pl.get("amount")):
        raw_loan_amt = _clean_val(merged_pl.get("amount"))

    parsed_loan_amt = parse_inr_loan_amount(raw_loan_amt)
    resolved_loan_amt_str = (
        str(int(round(parsed_loan_amt)))
        if parsed_loan_amt and parsed_loan_amt > 0
        else (str(raw_loan_amt).strip() if raw_loan_amt else None)
    )

    raw_app_type = (_clean_val(primary_ext.get("applicant_type")) or "Applicant").strip()
    has_existing_primary = bool(
        isinstance(existing_ff, dict)
        and _clean_val(existing_ff.get("form_person_name"))
        and not str(existing_ff.get("form_applicant_type") or "").lower().startswith(("co", "g"))
    )
    all_uploaded_are_co = all(
        (_clean_val(x.get("applicant_type")) or "Applicant").strip().lower().replace("-", " ").startswith(("co", "g"))
        for x in ordered
    )
    is_co_only = all_uploaded_are_co and not has_existing_primary
    extracted_person_name = (
        _clean_val(field_form_payload.get("form_person_name"))
        or _clean_val(primary_ext.get("name"))
    )
    extracted_co_name = _clean_val(field_form_payload.get("co_applicant_name")) or _clean_val(primary_ext.get("co_applicant_name"))
    extracted_co_contact = _clean_val(field_form_payload.get("co_applicant_contact")) or _clean_val(primary_ext.get("co_applicant_contact"))
    primary_app_name = _format_person_name_with_salutation(
        extracted_person_name,
        marital_status=field_form_payload.get("marital_status") or primary_ext.get("marital_status"),
        age_val=field_form_payload.get("age_community") or primary_ext.get("age"),
    )
    primary_app_contact = _clean_val(field_form_payload.get("contact_number")) or _clean_val(primary_ext.get("contact_number"))

    if is_co_only:
        extracted_co_name = _format_person_name_with_salutation(
            extracted_co_name or extracted_person_name,
            marital_status=field_form_payload.get("co_applicant_marital_status") or primary_ext.get("marital_status"),
            age_val=field_form_payload.get("co_applicant_age") or primary_ext.get("age"),
        )
        extracted_co_contact = _clean_val(field_form_payload.get("co_applicant_contact")) or primary_app_contact or extracted_co_contact
        inferred_child_name = None
        if isinstance(primary_ext.get("family_members"), list):
            for fm_item in primary_ext.get("family_members"):
                if isinstance(fm_item, dict):
                    fm_r = (_clean_val(fm_item.get("relation")) or "").upper().strip()
                    fm_a = _parse_age_int(fm_item.get("age"))
                    if fm_r in ("DAUGHTER", "SON", "APP", "APPLICANT") and (fm_a is None or fm_a >= 17):
                        raw_child = _clean_val(fm_item.get("name"))
                        if raw_child and (_name_score(raw_child, extracted_person_name) or 0) < 75:
                            c_gen = _infer_gender_from_name_or_hint(raw_child)
                            prefix = "Miss. " if (fm_r == "DAUGHTER" or c_gen == "FEMALE") else "Mr. "
                            c_tokens = raw_child.split()
                            p_tokens = (extracted_person_name or "").split()
                            if len(c_tokens) == 1 and len(p_tokens) >= 2:
                                father_first = re.sub(r"(?i)(?:bhai|kumar|lal)$", "", p_tokens[0]).strip() or p_tokens[0]
                                surname = p_tokens[-1]
                                inferred_child_name = f"{prefix}{c_tokens[0]} {father_first} {surname}"
                            else:
                                clean_rc = " ".join(w.capitalize() for w in raw_child.split())
                                inferred_child_name = clean_rc if re.match(r"^(?:Mr|Mrs|Miss|Ms)\b", clean_rc, re.I) else f"{prefix}{clean_rc}"
                            break
        cand_app = _clean_val(applicant_name)
        if cand_app and extracted_co_name and (_name_score(cand_app, extracted_co_name) or 0) >= 75:
            cand_app = None
        primary_app_name = cand_app or inferred_child_name

    extra_cos = field_form_payload.get("extra_co_applicants") or []
    applicant_count = (1 if (primary_app_name or not is_co_only) else 1) + (1 if extracted_co_name else 0) + len(extra_cos)
    total_forms = int((existing_ff or {}).get("_forms_merged_count", 0)) + len(ordered) if isinstance(existing_ff, dict) and existing_ff else len(ordered)
    field_form_payload["_forms_merged_count"] = total_forms

    case_data = {
        "forms_extracted_count": total_forms,
        "applicant_count": min(applicant_count, 5),
        "applicant_type": "Co-applicant" if is_co_only else "Applicant",
        "applicant_name": primary_app_name,
        "contact_number": primary_app_contact,
        "address_visited": address_visited,
        "office_address": office_address,
        "bank_name": normalized_bank,
        "branch_name": branch_name,
        "loan_type": normalized_loan,
        "loan_amount": resolved_loan_amt_str,
        "loan_amount_raw": raw_loan_amt,
        "executive_name": executive_name,
        "co_applicant_name": extracted_co_name,
        "co_applicant_contact": extracted_co_contact,
        "co_applicant_address": primary_ext.get("co_applicant_address") or (address_visited if is_co_only else None),
        "co_applicant_office_address": (field_form_payload.get("office_details_co") or {}).get("address") if isinstance(field_form_payload.get("office_details_co"), dict) else None,
        "applicant_3_name": field_form_payload.get("applicant_3_name"),
        "applicant_3_phone": field_form_payload.get("applicant_3_phone"),
        "applicant_4_name": field_form_payload.get("applicant_4_name"),
        "applicant_4_phone": field_form_payload.get("applicant_4_phone"),
        "applicant_5_name": field_form_payload.get("applicant_5_name"),
        "applicant_5_phone": field_form_payload.get("applicant_5_phone"),
        "extra_co_applicants": extra_cos,
        "visit_date": visit_date,
        "marital_status": field_form_payload.get("marital_status") or primary_ext.get("marital_status"),
        "occupation": field_form_payload.get("occupation") or primary_ext.get("occupation"),
        "firm_name": firm_name,
    }

    return {
        "case_data": case_data,
        "field_form_data": field_form_payload,
        "forms_extracted_count": total_forms,
    }


def extract_field_form_pdf_for_intake(pdf_path: str, applicant_name: str = "") -> Dict[str, Any]:
    """
    Single-path wrapper around extract_multiple_field_form_pdfs_for_intake (supports both
    1-form PDFs and multi-form PDFs).
    """
    return extract_multiple_field_form_pdfs_for_intake([pdf_path], applicant_name=applicant_name)
