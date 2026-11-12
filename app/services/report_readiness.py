"""
What the certified CPV report (pdf_generator.py) will print as "Not Captured" for a case,
worked out WITHOUT generating the PDF - so the CA office can see and fill the gaps before a
bank-ready report goes out with blank fields in it.

Every entry here mirrors a real "Not Captured" cell pdf_generator.py can actually print - this
module is kept in lockstep with pdf_generator.py's field_form.get(...) / document-scan lookups
on purpose, so "Check Report Readiness" never gives a false all-clear for a field the report
will still show blank.

Each entry names exactly where the value needs to be typed/scanned: "dashboard" fields are
CA-office facts (phone, address, loan amount - fixed via Edit Case), "field_form" fields are the
field agent's on-site questionnaire (fixed either by the agent resubmitting in the PWA, or by CA
office staff who already have the answer typing it in directly from the dashboard), "document"
fields need a physical document AI-scanned (Aadhaar/PAN/income-proof) rather than typed anywhere.
"""
from typing import Any, Dict, List, Optional


def _missing(value: Optional[str]) -> bool:
    if not value:
        return True
    s = str(value).strip()
    return not s or s.upper() in ("NA", "N/A", "PENDING AI EXTRACTION", "-")


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
    has_income_doc: Optional[bool] = None,
    has_income_doc_co: bool = False,
    has_aadhaar_doc: bool = False,
    has_pan_doc: bool = False,
    has_aadhaar_doc_co: bool = False,
    has_pan_doc_co: bool = False,
    extra_applicants: Optional[List[Dict[str, Any]]] = None,
    has_home_photo: Optional[Dict[int, bool]] = None,
) -> List[Dict[str, str]]:
    from app.services.field_form_pdf_ingest import enrich_field_form_defaults
    field_form = enrich_field_form_defaults(
        field_form or {},
        applicant_name=applicant_name,
        target_address=target_address if target_address != "Pending AI Extraction" else None,
    )
    missing: List[Dict[str, str]] = []
    # has_income_doc supersedes the older has_form16 name (self-employed applicants prove income
    # with an ITR acknowledgement or computation-of-income sheet, not a Form 16) - callers that
    # still only pass has_form16 keep working unchanged.
    if has_income_doc is None:
        has_income_doc = has_form16

    # --- Case-level facts (CA Dashboard -> Edit Case) ---
    if _missing(applicant_phone) and _missing(field_form.get("contact_number")):
        missing.append(_entry("applicant_phone", "Applicant Contact Number", "dashboard",
                               "Edit Case -> Contact Number"))
    if _missing(target_address):
        missing.append(_entry("target_address", "Verified Residence Address", "dashboard",
                               "Edit Case -> Address"))
    if not loan_amount:
        missing.append(_entry("loan_amount", "Loan Amount", "dashboard", "Edit Case -> Loan Amount"))

    # --- Applicant KYC documents (AI-scanned, not typed) - these print DOB/Age/Gender and
    # Aadhaar/PAN numbers on Annexure A; no field_form entry can ever fill them in. ---
    if not has_aadhaar_doc:
        missing.append(_entry("aadhaar_scan", "Applicant Aadhaar Card (for DOB/Age/Gender + Aadhaar No.)",
                               "document", "AI Ingest Bank Folder/PDF, or Select Multiple Files -> scan the Aadhaar card"))
    if not has_pan_doc:
        missing.append(_entry("pan_scan", "Applicant PAN Card (for KYC PAN No.)", "document",
                               "AI Ingest Bank Folder/PDF, or Select Multiple Files -> scan the PAN card"))

    # --- Applicant / residence questionnaire (field_form, top level) ---
    checks = [
        ("marital_status", "Marital Status"),
        ("qualification", "Qualification"),
        ("community", "Community"),
        ("landmark", "Residence Landmark"),
        ("building_type", "Building Type"),
        ("period_of_stay", "Period of Stay at Residence"),
        ("owner_name", "Residence Owner Name & Relation (e.g. (Name) Relation)"),
        ("ownership", "Residence Ownership"),
        ("nameboard_visible", "Residence Name Board Visibility"),
        ("building_nature", "Nature of Building"),
        ("general_appearance", "General Appearance of Property"),
        ("locality", "Locality"),
        ("surroundings", "Surroundings"),
        ("assets_observed", "Residence Assets Visible"),
        ("residence_evidence_obtained", "Evidence Supporting Proof Obtained"),
        ("person_met", "Person Met at Residence"),
    ]
    for key, label in checks:
        if _missing(field_form.get(key)):
            missing.append(_entry(key, label, "field_form", "Field Visit Form -> Residential Details"))

    if _missing(field_form.get("neighbour_1")):
        missing.append(_entry("neighbour_1", "Neighbour Reference 1", "field_form",
                               "Field Visit Form -> Residential Details -> References"))
    if _missing(field_form.get("neighbour_2")):
        missing.append(_entry("neighbour_2", "Neighbour Reference 2", "field_form",
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

    # --- Applicant income proof: a scanned Form 16 / ITR Acknowledgement / Computation of
    # Income sheet, NOT the manually-typed ack no/filing date fields below (those only ever fill
    # in a gap on a row the scan already created - they can never create the row by themselves,
    # so a case with neither has an empty Annexure C no matter what's typed into them). ---
    if not has_income_doc:
        missing.append(_entry("income_doc", "Applicant Income Proof (Form 16 / ITR Acknowledgement / Return Assessment / Computation of Income)",
                               "document", "Click 'Upload & Scan Document' to scan Form 16, ITR-V, Return Assessment Statement, or Computation of Income"))

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
            ("premises_owner", "Office Premises Owner Name"),
            ("established_since", "Office Established Since"),
            ("location", "Office Location Type"),
            ("nameboard", "Office Name Board Visibility"),
            ("infrastructure", "Office Infrastructure of Premises"),
            ("employees", "Office Number of Workers"),
            ("position", "Line of Business / Position at Work"),
            ("assets", "Office Assets Visible"),
            ("reference", "Office Reference"),
            ("who_meet", "Who Was Met at Office"),
            ("reg_no", "Office Reg. No. / Emp. No."),
        ]
        for key, label in office_checks:
            if key == "reference":
                has_ref = not _missing(office.get("reference_1")) or not _missing(office.get("reference"))
                if not has_ref:
                    missing.append(_entry("office_details.reference", label, "field_form", "Field Visit Form -> Office Details"))
                continue
            if _missing(office.get(key)):
                missing.append(_entry(f"office_details.{key}", label, "field_form",
                                       "Field Visit Form -> Office Details"))
    elif occupation.strip() == "":
        missing.append(_entry("occupation", "Occupation", "field_form", "Field Visit Form -> Office Details"))

    # --- Co-applicant equivalents, only when this case actually has one ---
    if co_applicant_name:
        # Personal/KYC particulars print on Annexure A unconditionally whenever a co-applicant
        # exists, regardless of whether the co-applicant is employed.
        if not has_aadhaar_doc_co:
            missing.append(_entry("aadhaar_scan_co", "Co-Applicant Aadhaar Card (for DOB/Age/Gender + Aadhaar No.)",
                                   "document", "AI Ingest Bank Folder/PDF -> scan the co-applicant's Aadhaar card"))
        if not has_pan_doc_co:
            missing.append(_entry("pan_scan_co", "Co-Applicant PAN Card (for KYC PAN No.)", "document",
                                   "AI Ingest Bank Folder/PDF -> scan the co-applicant's PAN card"))

        office_co = field_form.get("office_details_co") or {}
        co_personal_checks = [
            ("marital_status", "Co-Applicant Marital Status"),
            ("community", "Co-Applicant Community"),
            ("qualification", "Co-Applicant Qualification"),
            ("relation_to_applicant", "Co-Applicant Relation to Applicant"),
        ]
        for key, label in co_personal_checks:
            if _missing(office_co.get(key)):
                missing.append(_entry(f"office_details_co.{key}", label, "field_form",
                                       "Field Visit Form -> Co-Applicant Office Details"))

        co_occupation = str(office_co.get("occupation") or "")
        if "housewife" not in co_occupation.lower() and co_occupation.strip():
            co_office_checks = [
                ("firm_name", "Co-Applicant Employer / Firm Name"),
                ("address", "Co-Applicant Office Address"),
                ("landmark", "Co-Applicant Office Landmark"),
                ("firm_type", "Co-Applicant Office Firm Type"),
                ("premises_ownership", "Co-Applicant Office Premises Ownership"),
                ("premises_owner", "Co-Applicant Office Premises Owner Name"),
                ("established_since", "Co-Applicant Office Established Since"),
                ("location", "Co-Applicant Office Location Type"),
                ("nameboard", "Co-Applicant Office Name Board Visibility"),
                ("employees", "Co-Applicant Office Number of Workers"),
                ("assets", "Co-Applicant Office Assets Visible"),
                ("reference_1", "Co-Applicant Office Reference"),
                ("who_meet", "Co-Applicant: Who Was Met at Office"),
                ("reg_no", "Co-Applicant Office Reg. No. / Emp. No."),
            ]
            for key, label in co_office_checks:
                if _missing(office_co.get(key)):
                    missing.append(_entry(f"office_details_co.{key}", label, "field_form",
                                           "Field Visit Form -> Co-Applicant Office Details"))

            if not has_income_doc_co:
                missing.append(_entry("income_doc_co", "Co-Applicant Income Proof (Form 16 / ITR Acknowledgement / Computation of Income)",
                                       "document", "AI Ingest Bank Folder/PDF -> scan the co-applicant's income-proof document"))

        if _missing(field_form.get("bank_account_status_co")):
            missing.append(_entry("bank_account_status_co", "Co-Applicant Bank Account Status", "field_form",
                                   "Field Visit Form -> Co-Applicant Office Details"))

    # --- Applicants 3-5 (home visit only, no office/KYC required by the report) ---
    has_home_photo = has_home_photo or {}
    for extra in (extra_applicants or []):
        slot = extra.get("slot")
        name = extra.get("name")
        if not slot or not name:
            continue
        home_group = extra.get("home_group", slot)
        if home_group != slot:
            continue  # Shares another applicant's home visit - nothing extra to capture
        if not has_home_photo.get(slot):
            missing.append(_entry(f"home_photo_{slot}", f"Applicant {slot} ({name}) Residence Photographs",
                                   "document", f"Field Agent PWA -> Applicant {slot} Residence tab"))

    return missing
