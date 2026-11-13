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
import re
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
If a field contains only "N", "NA", "Na", "No", or "Nil" as a placeholder for "none", return null for that field
(except office_ownership where "NA" is a radio button option).

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
    {{"name": "person's actual name (never 'APP' or 'HUSBAND')", "age": "string", "relation": "Self | Husband | Wife | Father | Mother | Father-in-law | Mother-in-law | Son | Daughter | Brother | Sister | Brother-in-law | Sister-in-law | Family Member (CRITICAL: relation MUST be relative to the applicant; if the applicant is Female/Mrs./Ms., no member can ever be 'Wife' — her spouse is 'Husband', her own row is 'Self', and a brother-in-law's wife is 'Sister-in-law')", "earning": "Yes or No (MUST be 'No' if written as NO/N/Housewife/Student or if age < 18)"}}
  ],
  "address_visited": "string or null",
  "residence_landmark": "Landmark or locality extracted from address_visited (e.g. 'Near SAL Hospital, Driving Road, Thaltej'), string or null",
  "residence_ownership": "Rented | Owned | Government Provided | Company Provided | null",
  "residence_references": [
    {{"name": "Neighbour 1 person's name ONLY (if two neighbour names are written on one line separated by '-', ',', '&', or '/', output TWO separate objects in this array, NEVER put the second person's name into 'relation')", "relation": "Neighbour (default to 'Neighbour' unless another relation like 'Friend', 'Landlord', 'Relative', 'Secretary', 'Watchman' is explicitly written)"}}
  ],
  "residence_building_type": "Bungalow | Flat | Independent House | null",
  "residence_bhk": "e.g. '1 BHK', '2 BHK', '3 BHK', '4 BHK' or null",
  "duration_of_stay": "string or null (e.g. '2.5 years')",
  "residence_owner_name": "string or null - name only, no relation",
  "residence_owner_relation": "string or null - e.g. 'Father', 'Self', 'Mother in law', 'Family Member'",
  "nameboard_visibility_residence": "string or null - whatever was typed/selected, e.g. 'Yes' or 'No' or the name on the board",
  "residence_assets_visible": ["list of checked items, e.g. 'AC', 'FAN', 'CCTV'"],
  "who_met_residence_name": "string or null - name only",
  "who_met_residence_contact": "string or null - phone number if given",
  "who_met_residence_relation": "string or null - only if explicitly written, never guessed",
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
  "office_owner_name": "string or null - name only, no relation",
  "office_owner_relation": "string or null",
  "position_or_nature_of_business": "string or null",
  "office_assets_visible": ["list of checked items"],
  "office_references": [
    {{"name": "Reference person's name ONLY (if two reference names are written separated by '-', ',', '&', or '/', output TWO separate objects in this array, NEVER put the second person's name into 'relation')", "relation": "Colleague | Staff | Manager | Owner | Neighbour | Friend (default to 'Colleague' or 'Neighbour' if not explicitly written)"}}
  ],
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


_PLACEHOLDER_STRINGS = {"", "n", "na", "n/a", "no", "nil", "none", "-", "null", "pending ai extraction"}

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
    "KANTA", "SHANTA", "MAMTA", "LATA", "NAMRATA", "AMRUTA", "ANKITA", "NIKITA",
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
    if first in _COMMON_FEMALE_NAMES or any(first.endswith(sfx) for sfx in ("BEN", "BA", "DEVI", "BAI", "KUMARI")):
        return "FEMALE"
    if first in _COMMON_MALE_NAMES or any(first.endswith(sfx) for sfx in ("BHAI", "SINH", "KUMAR", "LAL", "DAS", "NATH")):
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


def reconcile_family_members_for_applicant(
    raw_fam: Optional[List[Any]],
    applicant_name: Optional[str] = None,
    applicant_gender: Optional[str] = None,
    applicant_age: Optional[Any] = None,
) -> List[Dict[str, Any]]:
    """
    Cleans, normalizes, and reconciles the family_members array against the primary applicant's
    identity, gender, and age:
    - Swaps misordered name/relation (e.g. name='APP', relation='SWETA ARORA').
    - Fixes impossible spouse relations relative to the applicant's gender:
      * A Female applicant ('Mrs. Komal Nirav Thakkar', gender='Female') can NEVER have a family
        member with relation='Wife'. If the row is herself -> 'Self'; if the row is male -> 'Husband';
        if the row is another female (e.g. 'Khushbu', 45) -> 'Mother-in-law' (if >=16 yrs older)
        or 'Sister-in-law' (joint-family sister-in-law).
      * A Male applicant ('Mr. ...', gender='Male') can NEVER have a family member with
        relation='Husband'. If the row is himself -> 'Self'; if female -> 'Wife'; if another male
        -> 'Father' (if >=16 yrs older) or 'Brother'.
    - Ensures any minor child (age < 18, e.g. age 14) has earning='No'.
    """
    if not isinstance(raw_fam, list):
        return []

    app_gender = _infer_gender_from_name_or_hint(applicant_name, applicant_gender)
    app_age_num: Optional[int] = None
    if applicant_age is not None:
        m_a = re.search(r"\b(\d{1,3})\b", str(applicant_age))
        if m_a:
            app_age_num = int(m_a.group(1))

    # Extract applicant's middle token (often husband/father name in Gujarati/Indian 3-part names)
    app_tokens = [
        re.sub(r"[^A-Za-z]", "", t).upper()
        for t in (applicant_name or "").split()
        if re.sub(r"[^A-Za-z]", "", t).upper() not in ("MR", "MRS", "MS", "MISS", "SMT", "SHRI", "DR")
    ]
    app_middle_token = app_tokens[1] if len(app_tokens) >= 3 else None

    # Check if this family list has minors (<18) that were previously stored with earning='Yes'
    # due to the old _clean_val('No') -> None -> 'Yes' bug.
    had_buggy_all_yes_minors = False
    for m in raw_fam:
        if isinstance(m, dict):
            a_m = re.search(r"\b(\d{1,3})\b", str(m.get("age") or ""))
            if a_m and 0 < int(a_m.group(1)) < 18 and str(m.get("earning") or "").strip().upper() == "YES":
                had_buggy_all_yes_minors = True
                break

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
        else:
            m_rel = _normalize_relation_or_title(m_rel)

        if not m_name:
            continue

        # Strip bilingual suffix from relation if present (e.g. "Wife (પત્ની)" -> "Wife")
        if m_rel:
            m_rel = re.sub(r"\s*\([^)]*\)\s*$", "", m_rel).strip()
            m_rel = _normalize_relation_or_title(m_rel) or m_rel

        age_clean = str(_clean_val(m.get("age")) or "")
        mem_age_num: Optional[int] = None
        if age_clean:
            m_ma = re.search(r"\b(\d{1,3})\b", age_clean)
            if m_ma:
                mem_age_num = int(m_ma.group(1))

        # 1. Check if member is actually the applicant themselves
        if applicant_name and (_name_score(m_name, applicant_name) or 0) >= 80:
            m_rel = "Self"
        elif m_rel and m_rel.lower().startswith("self"):
            m_rel = "Self"

        mem_gender = _infer_gender_from_name_or_hint(m_name)
        if not mem_gender and app_middle_token and m_name.strip().upper().startswith(app_middle_token):
            mem_gender = "MALE"

        rel_upper = (m_rel or "").upper()

        # 2. Reconcile impossible spouse relations against applicant's gender
        if app_gender == "FEMALE" and rel_upper == "WIFE":
            if applicant_name and (_name_score(m_name, applicant_name) or 0) >= 65:
                m_rel = "Self"
            elif mem_gender == "MALE":
                m_rel = "Husband"
            else:
                if app_age_num and mem_age_num and mem_age_num >= app_age_num + 16:
                    m_rel = "Mother-in-law"
                else:
                    m_rel = "Sister-in-law"
        elif app_gender == "MALE" and rel_upper == "HUSBAND":
            if applicant_name and (_name_score(m_name, applicant_name) or 0) >= 65:
                m_rel = "Self"
            elif mem_gender == "FEMALE":
                m_rel = "Wife"
            else:
                if app_age_num and mem_age_num and mem_age_num >= app_age_num + 16:
                    m_rel = "Father"
                else:
                    m_rel = "Brother"
        elif rel_upper == "HUSBAND" and mem_gender == "FEMALE":
            m_rel = "Wife" if app_gender == "MALE" else "Sister-in-law"
        elif rel_upper == "WIFE" and mem_gender == "MALE":
            m_rel = "Husband" if app_gender == "FEMALE" else "Brother"

        earning_clean = _clean_earning_val(m.get("earning"), age_str=age_clean, occupation_str=m.get("occupation"))
        # If this record was saved under the old bug where every 'No' was turned into 'Yes'
        # (evidenced by minor children having earning='Yes') and no occupation was stored,
        # repair non-self dependent/homemaker relations that were affected by the same bug.
        if (
            had_buggy_all_yes_minors
            and not m.get("occupation")
            and m_rel in ("Sister-in-law", "Mother-in-law", "Mother", "Wife", "Grandmother")
        ):
            earning_clean = "No"

        cleaned_fam.append({
            "name": m_name,
            "relation": m_rel or "Family Member",
            "age": age_clean,
            "earning": earning_clean,
        })

    return cleaned_fam


def _clean_val(val: Optional[Any], allow_na: bool = False) -> Optional[str]:
    if val is None:
        return None
    s = str(val).strip()
    if not s:
        return None
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
    "FATHER", "MOTHER", "HUSBAND", "WIFE", "SON", "DAUGHTER", "BROTHER", "SISTER",
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
    default_relation: str = "Neighbour",
) -> List[str]:
    """
    Takes raw reference strings or {name, relation} dicts and returns normalized
    'Name - Relation' strings. Crucially, if two people's names were combined with
    ' - ', ',', '&', or '/' (e.g. 'BABU RAO - RAJU BHAI' where 'RAJU BHAI' was mistaken
    for a relation), splits them into two separate reference entries, each with `default_relation`.
    """
    pairs: List[tuple[str, str]] = []

    def _add_name_or_split(name_str: str, rel_str: Optional[str]):
        clean_n = (_clean_val(name_str) or "").strip(" .,-")
        clean_n = re.sub(r"^\d+[\.\)\-\s]+", "", clean_n).strip()
        if not clean_n:
            return
        norm_r = _normalize_relation_or_title(rel_str) if _is_valid_reference_relation(rel_str) else None
        # Check if clean_n itself contains two names separated by ',', '&', '/', or ' and '
        sub_names = [
            re.sub(r"^\d+[\.\)\-\s]+", "", p.strip(" .,-")).strip()
            for p in re.split(r"\s*(?:,|&|/|\band\b)\s*", clean_n, flags=re.IGNORECASE)
            if p and p.strip(" .,-")
        ]
        if len(sub_names) > 1:
            for sn in sub_names:
                if sn:
                    pairs.append((sn, norm_r or default_relation))
        else:
            pairs.append((clean_n, norm_r or default_relation))

    for item in raw_items:
        if not item:
            continue
        if isinstance(item, dict):
            n_val = _clean_val(item.get("name"))
            r_val = _clean_val(item.get("relation"))
            if not n_val:
                continue
            if r_val and not _is_valid_reference_relation(r_val):
                # Gemini put the 2nd person's name into 'relation' (e.g. name='BABU RAO', relation='RAJU BHAI')
                _add_name_or_split(n_val, default_relation)
                _add_name_or_split(r_val, default_relation)
            else:
                _add_name_or_split(n_val, r_val or default_relation)
        else:
            s_val = _clean_val(item)
            if not s_val:
                continue
            # Check for parenthetical relation like "BABU RAO (Neighbour)"
            m_paren = re.match(r"^(.+?)\s*\(([^)]+)\)\s*$", s_val)
            if m_paren and _is_valid_reference_relation(m_paren.group(2)):
                _add_name_or_split(m_paren.group(1), m_paren.group(2))
                continue
            if " - " in s_val:
                parts = [p.strip() for p in s_val.split(" - ") if p.strip()]
                if len(parts) == 2:
                    left, right = parts[0], parts[1]
                    if _is_valid_reference_relation(right):
                        _add_name_or_split(left, right)
                    else:
                        # Both left and right are people's names (e.g. "BABU RAO - RAJU BHAI")!
                        _add_name_or_split(left, default_relation)
                        _add_name_or_split(right, default_relation)
                else:
                    # 3+ parts separated by " - "
                    if _is_valid_reference_relation(parts[-1]):
                        rel_part = parts[-1]
                        for nm in parts[:-1]:
                            _add_name_or_split(nm, rel_part)
                    else:
                        for nm in parts:
                            _add_name_or_split(nm, default_relation)
            else:
                _add_name_or_split(s_val, default_relation)

    out: List[str] = []
    seen = set()
    for n, r in pairs:
        key = n.upper()
        if key not in seen:
            seen.add(key)
            out.append(f"{n} - {r}")
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
    Reconciles a single person's relationship to the primary applicant (used for family_members,
    person_met / 'Who did you meet', and residence/office owner_name) so a Female applicant can
    never have someone labeled 'Wife' and a Male applicant can never have someone labeled 'Husband'.
    """
    p_name = _clean_val(person_name)
    rel = _clean_val(raw_relation)
    if rel:
        rel = re.sub(r"\s*\([^)]*\)\s*$", "", rel).strip()
        rel = _normalize_relation_or_title(rel) or rel

    if p_name and applicant_name and (_name_score(p_name, applicant_name) or 0) >= 80:
        return "Self"
    if rel and rel.lower().startswith("self"):
        return "Self"

    # If this person is already in the reconciled family_members list, use their reconciled relation
    # whenever raw_relation is missing OR is an impossible spouse relation.
    fm_rel = None
    if p_name and family_members:
        fm = next(
            (m for m in family_members if isinstance(m, dict) and m.get("name") and (_name_score(p_name, m["name"]) or 0) >= 80),
            None,
        )
        if fm and fm.get("relation"):
            fm_rel = _normalize_relation_or_title(fm.get("relation")) or fm.get("relation")
            if not person_age and fm.get("age"):
                person_age = fm.get("age")

    app_gender = _infer_gender_from_name_or_hint(applicant_name, applicant_gender)
    app_age_num: Optional[int] = None
    if applicant_age is not None:
        m_a = re.search(r"\b(\d{1,3})\b", str(applicant_age))
        if m_a:
            app_age_num = int(m_a.group(1))

    mem_age_num: Optional[int] = None
    if person_age is not None:
        m_ma = re.search(r"\b(\d{1,3})\b", str(person_age))
        if m_ma:
            mem_age_num = int(m_ma.group(1))

    app_tokens = [
        re.sub(r"[^A-Za-z]", "", t).upper()
        for t in (applicant_name or "").split()
        if re.sub(r"[^A-Za-z]", "", t).upper() not in ("MR", "MRS", "MS", "MISS", "SMT", "SHRI", "DR")
    ]
    app_middle_token = app_tokens[1] if len(app_tokens) >= 3 else None

    mem_gender = _infer_gender_from_name_or_hint(p_name)
    if not mem_gender and p_name and app_middle_token and p_name.strip().upper().startswith(app_middle_token):
        mem_gender = "MALE"

    rel_upper = (rel or "").upper()

    if app_gender == "FEMALE" and rel_upper == "WIFE":
        if fm_rel and fm_rel.upper() != "WIFE":
            return fm_rel
        if p_name and applicant_name and (_name_score(p_name, applicant_name) or 0) >= 65:
            return "Self"
        if mem_gender == "MALE":
            return "Husband"
        if app_age_num and mem_age_num and mem_age_num >= app_age_num + 16:
            return "Mother-in-law"
        return "Sister-in-law"

    if app_gender == "MALE" and rel_upper == "HUSBAND":
        if fm_rel and fm_rel.upper() != "HUSBAND":
            return fm_rel
        if p_name and applicant_name and (_name_score(p_name, applicant_name) or 0) >= 65:
            return "Self"
        if mem_gender == "FEMALE":
            return "Wife"
        if app_age_num and mem_age_num and mem_age_num >= app_age_num + 16:
            return "Father"
        return "Brother"

    if rel_upper == "HUSBAND" and mem_gender == "FEMALE":
        if fm_rel and fm_rel.upper() != "HUSBAND":
            return fm_rel
        return "Wife" if app_gender == "MALE" else "Sister-in-law"

    if rel_upper == "WIFE" and mem_gender == "MALE":
        if fm_rel and fm_rel.upper() != "WIFE":
            return fm_rel
        return "Husband" if app_gender == "FEMALE" else "Brother"

    return rel or fm_rel


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
    # Parse "Name - Phone (Relation)" or "Name (Relation)" or bare "Name"
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

    if raw_rel:
        raw_rel = re.sub(r"\s+of\s+the\s+applicant\s*$", "", raw_rel, flags=re.IGNORECASE).strip()

    reconciled_rel = reconcile_person_relation(
        base_name,
        raw_rel,
        applicant_name=applicant_name,
        applicant_gender=applicant_gender,
        applicant_age=applicant_age,
        family_members=family_members,
    )
    out = base_name
    if phone:
        out += f" - {phone}"
    if reconciled_rel:
        out += f" ({reconciled_rel})"
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
    owner = _clean_val(owner_name)
    reconciled = reconcile_person_relation(
        owner,
        explicit_relation,
        applicant_name=applicant_name,
        applicant_gender=applicant_gender,
        applicant_age=applicant_age,
        family_members=family_members,
    )
    if reconciled:
        return reconciled
    if not owner:
        return None
    own_lower = (ownership or "").lower()
    if "rent" in own_lower:
        return "Landlord"
    # Check if shares last name / surname token with applicant or family
    owner_tokens = {t.upper() for t in re.findall(r"[A-Za-z]{3,}", owner) if t.upper() not in {"BEN", "BHAI", "KUMAR", "SMT", "SHRI", "MRS", "MR"}}
    app_tokens = {t.upper() for t in re.findall(r"[A-Za-z]{3,}", applicant_name or "") if t.upper() not in {"BEN", "BHAI", "KUMAR", "SMT", "SHRI", "MRS", "MR"}}
    if (owner_tokens & app_tokens) or "own" in own_lower:
        return "Family Member"
    return "Property Owner"


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
    cleaned_fam = reconcile_family_members_for_applicant(
        raw_fam,
        applicant_name=app_name,
        applicant_gender=applicant_gender,
        applicant_age=app_age,
    )
    if cleaned_fam:
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

        # Normalize & split office references (if two names were combined with ' - ', split into reference_1 and reference_2)
        norm_off_refs = _expand_and_normalize_references(
            [off.get("reference_1") or off.get("reference"), off.get("reference_2")],
            default_relation="Colleague",
        )
        if norm_off_refs:
            off["reference_1"] = norm_off_refs[0]
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

        # Premises Ownership & Owner Name (especially when occupation == "Job" and Google Form radio was "NA")
        prem_own_raw = str(off.get("premises_ownership") or "").strip()
        if not prem_own_raw or prem_own_raw.upper() in ("NA", "N/A", "N"):
            if occ.lower() == "job":
                off["premises_ownership"] = "Employer Premises (Salaried Job)"
            else:
                off["premises_ownership"] = "Commercial Premises"

        prem_owner_raw = _clean_val(off.get("premises_owner"))
        if not prem_owner_raw:
            # Look for an OWNER reference in reference_1 / reference_2, else firm_name
            ref_owner = None
            for rk in ("reference_1", "reference_2"):
                rv = _clean_val(off.get(rk)) or ""
                if " - " in rv:
                    r_name, r_rel = rv.split(" - ", 1)
                    if r_rel.strip().upper() in ("OWNER", "BOSS", "DIRECTOR", "PROPRIETOR", "PARTNER", "EMPLOYER"):
                        ref_owner = f"({r_name.strip()}) Employer / {r_rel.strip().title()}"
                        break
            if ref_owner:
                off["premises_owner"] = ref_owner
            elif _clean_val(off.get("firm_name")):
                rel_lbl = "Employer" if occ.lower() == "job" else "Management"
                off["premises_owner"] = f"({_clean_val(off.get('firm_name'))}) {rel_lbl}"
        else:
            _po_match = re.match(r"^\s*\(([^)]+)\)\s*(.*)$", prem_owner_raw)
            if _po_match:
                po_name = _clean_val(_po_match.group(1))
                po_rel = _normalize_relation_or_title(_po_match.group(2))
            else:
                po_name = prem_owner_raw
                po_rel = None
            if po_name and not po_rel:
                if app_name and (_name_score(po_name, app_name) or 0) >= 85:
                    po_rel = "Self"
                elif occ.lower() == "job":
                    po_rel = "Employer"
                elif "rent" in str(off.get("premises_ownership") or "").lower():
                    po_rel = "Landlord"
                else:
                    po_rel = "Owner"
            if po_name:
                off["premises_owner"] = _combine_name_relation(po_name, po_rel) or po_name

        if not _clean_val(off.get("reg_no")):
            off["reg_no"] = "Verified at Site"
        if not _clean_val(off.get("assessment")):
            off["assessment"] = "POSITIVE"

    ff["office_details"] = off
    return ff


def build_field_form_payload(extracted: Dict[str, Any]) -> Dict[str, Any]:
    """
    Maps the Gemini-extracted intermediate schema into exactly the field_form_data shape the
    PWA's submitDueDiligenceForm() already produces - the same keys, same conventions - so every
    existing consumer (pdf_generator.py, cpv_report_data.py, the PWA's own restore-on-reopen)
    works completely unchanged, with no special-casing for a backlog-imported case.
    """
    e = extracted or {}

    applicant_name = _clean_val(e.get("name"))
    family_members = reconcile_family_members_for_applicant(
        e.get("family_members") or [],
        applicant_name=applicant_name,
        applicant_age=e.get("age"),
    )
    res_owner_name = _clean_val(e.get("residence_owner_name"))
    res_owner_rel = _infer_owner_relation(
        res_owner_name,
        e.get("residence_owner_relation"),
        applicant_name,
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
        "nameboard": _clean_val(e.get("office_nameboard_visibility")),
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

    payload = {
        "executive": _clean_val(e.get("executive_name")) or "",
        "persona": "Applicant",
        "agent_selfie": None,
        "agent_selfie_captured_at": None,
        "contact_number": _clean_val(e.get("contact_number")) or "",
        "marital_status": _clean_val(e.get("marital_status")) or "",
        "age_community": _clean_val(e.get("age")) or "",
        "community": _clean_val(e.get("community")) or "",
        "qualification": _clean_val(e.get("qualification")) or "",
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
        "nameboard_visible": _clean_val(e.get("nameboard_visibility_residence")) or "",
        "building_nature": "",
        "general_appearance": "",
        "locality": "",
        "surroundings": "",
        "residence_evidence_obtained": "",
        "occupation": _clean_val(e.get("occupation")) or "",
        "itr_acknowledgement_no": "",
        "itr_filing_date": "",
        "bank_account_status": "Active / Regular",
        "bank_account_status_co": "",
        "office_details": office_details,
        "previous_loan": previous_loan,
        "office_details_co": None,
        "residence_details_co": None,
        "restore": {
            "bhk": bhk or None,
            "building_type_only": bldg_type or None,
            "ownership": _clean_val(e.get("residence_ownership")),
            "period_of_stay": _clean_val(e.get("duration_of_stay")),
            "owner_name": residence_owner,
            "marital_status": _clean_val(e.get("marital_status")),
            "age_community": _clean_val(e.get("age")),
            "community": _clean_val(e.get("community")),
            "qualification": _clean_val(e.get("qualification")),
            "contact_number": _clean_val(e.get("contact_number")),
            "landmark": res_landmark or None,
            "person_met": person_met,
            "neighbors": [n for n in (neighbour_1, neighbour_2) if n],
            "family_members": family_members,
            "active_asset_ids": None,
            "itr_acknowledgement_no": None,
            "itr_filing_date": None,
            "bank_account_status": "Active / Regular",
            "bank_account_status_co": None,
        },
    }
    return enrich_field_form_defaults(payload, applicant_name=applicant_name, target_address=res_addr, office_address=off_addr)


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
        if applicant_name and not _clean_val(extracted.get("name")):
            extracted["name"] = applicant_name
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
        if applicant_name and not _clean_val(extracted.get("name")):
            extracted["name"] = applicant_name
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

        raw_loan_amt = extracted.get("loan_amount")
        parsed_loan_amt = parse_inr_loan_amount(raw_loan_amt)
        resolved_loan_amt_str = (
            str(int(round(parsed_loan_amt)))
            if parsed_loan_amt and parsed_loan_amt > 0
            else (str(raw_loan_amt).strip() if raw_loan_amt else None)
        )

        case_data = {
            "applicant_name": extracted.get("name"),
            "contact_number": extracted.get("contact_number"),
            "address_visited": extracted.get("address_visited"),
            "office_address": extracted.get("office_address"),
            "bank_name": normalized_bank,
            "branch_name": extracted.get("branch_name"),
            "loan_type": normalized_loan,
            "loan_amount": resolved_loan_amt_str,
            "loan_amount_raw": raw_loan_amt,
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
