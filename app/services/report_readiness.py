"""
What the certified CPV report (pdf_generator.py) will print as "Not Captured" for a case,
worked out WITHOUT generating the PDF - so the CA office can see and fill the gaps before a
bank-ready report goes out with blank fields in it.

Each entry names exactly where the value needs to be typed: "dashboard" fields are CA-office
facts (phone, address, loan amount - fixed via Edit Case), "field_form" fields are the field
agent's on-site questionnaire (fixed either by the agent resubmitting in the PWA, or by CA
office staff who already have the answer typing it in directly from the dashboard).
"""
from typing import Any, Dict, List, Optional


def _missing(value: Optional[str]) -> bool:
    return not value or not str(value).strip() or str(value).strip() == "Pending AI Extraction"


def _entry(field: str, label: str, source: str, how: str) -> Dict[str, str]:
    return {"field": field, "label": label, "source": source, "how": how}


def compute_report_readiness(
    applicant_name: str,
    applicant_phone: Optional[str],
    target_address: Optional[str],
    loan_amount: Optional[float],
    field_form: Dict[str, Any],
    co_applicant_name: Optional[str] = None,
    has_form16: bool = False,
) -> List[Dict[str, str]]:
    field_form = field_form or {}
    missing: List[Dict[str, str]] = []

    # --- Case-level facts (CA Dashboard -> Edit Case) ---
    if _missing(applicant_phone) and _missing(field_form.get("contact_number")):
        missing.append(_entry("applicant_phone", "Applicant Contact Number", "dashboard",
                               "Edit Case -> Contact Number"))
    if _missing(target_address):
        missing.append(_entry("target_address", "Verified Residence Address", "dashboard",
                               "Edit Case -> Address"))
    if not loan_amount:
        missing.append(_entry("loan_amount", "Loan Amount", "dashboard", "Edit Case -> Loan Amount"))

    # --- Applicant / residence questionnaire (field_form, top level) ---
    checks = [
        ("marital_status", "Marital Status"),
        ("qualification", "Qualification"),
        ("community", "Community"),
        ("landmark", "Residence Landmark"),
        ("building_type", "Building Type"),
        ("period_of_stay", "Period of Stay at Residence"),
        ("owner_name", "Residence Owner Name"),
        ("ownership", "Residence Ownership"),
        ("person_met", "Person Met at Residence"),
    ]
    for key, label in checks:
        if _missing(field_form.get(key)):
            missing.append(_entry(key, label, "field_form", "Field Visit Form -> Residential Details"))

    if _missing(field_form.get("neighbour_1")) and _missing(field_form.get("neighbour_2")):
        missing.append(_entry("neighbours", "Neighbour References", "field_form",
                               "Field Visit Form -> Residential Details -> References"))

    fam = field_form.get("family_members")
    has_family = isinstance(fam, list) and any(
        isinstance(m, dict) and not _missing(m.get("name")) and not _missing(m.get("age")) for m in fam
    )
    if not has_family:
        missing.append(_entry("family_members", "Family Background (name, age, relation)", "field_form",
                               "Field Visit Form -> Residential Details -> Family Details"))

    bank_status_missing = _missing(field_form.get("bank_account_status"))
    if bank_status_missing:
        missing.append(_entry("bank_account_status", "Bank Account Status", "field_form",
                               "Field Visit Form -> Income Tax & Bank Verification"))

    if has_form16:
        if _missing(field_form.get("itr_acknowledgement_no")):
            missing.append(_entry("itr_acknowledgement_no", "ITR Acknowledgement No.", "field_form",
                                   "Field Visit Form -> Income Tax & Bank Verification"))
        if _missing(field_form.get("itr_filing_date")):
            missing.append(_entry("itr_filing_date", "ITR Date of Filing", "field_form",
                                   "Field Visit Form -> Income Tax & Bank Verification"))

    # --- Office / workplace questionnaire (only when the applicant is not a housewife) ---
    occupation = str(field_form.get("occupation") or "")
    is_working = "housewife" not in occupation.lower() and occupation.strip() != ""
    if is_working:
        office = field_form.get("office_details") or {}
        office_checks = [
            ("firm_name", "Employer / Firm Name"),
            ("address", "Office / Workplace Address"),
            ("landmark", "Office Landmark"),
            ("firm_type", "Office Firm Type"),
            ("premises_ownership", "Office Premises Ownership"),
            ("established_since", "Office Established Since"),
            ("location", "Office Location Type"),
            ("nameboard", "Office Name Board Visibility"),
            ("employees", "Office Number of Workers"),
            ("assets", "Office Assets Visible"),
            ("reference", "Office Reference"),
            ("who_meet", "Who Was Met at Office"),
        ]
        for key, label in office_checks:
            if _missing(office.get(key)):
                missing.append(_entry(f"office_details.{key}", label, "field_form",
                                       "Field Visit Form -> Office Details"))
    elif occupation.strip() == "":
        missing.append(_entry("occupation", "Occupation", "field_form", "Field Visit Form -> Office Details"))

    # --- Co-applicant equivalents, only when this case actually has one ---
    if co_applicant_name:
        office_co = field_form.get("office_details_co") or {}
        co_occupation = str(office_co.get("occupation") or "")
        if "housewife" not in co_occupation.lower() and co_occupation.strip():
            co_office_checks = [
                ("firm_name", "Co-Applicant Employer / Firm Name"),
                ("address", "Co-Applicant Office Address"),
                ("landmark", "Co-Applicant Office Landmark"),
                ("established_since", "Co-Applicant Office Established Since"),
                ("location", "Co-Applicant Office Location Type"),
                ("assets", "Co-Applicant Office Assets Visible"),
                ("reference", "Co-Applicant Office Reference"),
                ("who_meet", "Co-Applicant: Who Was Met at Office"),
            ]
            for key, label in co_office_checks:
                if _missing(office_co.get(key)):
                    missing.append(_entry(f"office_details_co.{key}", label, "field_form",
                                           "Field Visit Form -> Co-Applicant Office Details"))

    return missing
