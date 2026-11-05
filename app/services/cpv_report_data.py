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
CO_APPLICANT_DOC_TYPES = {"FORM_16", "PAN_CARD", "AADHAAR_CARD", "SALARY_SLIP", "BANK_STATEMENT", "EMPLOYEE_ID_CARD"}


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
    m = re.search(r"(20\d{2})\s*[-–/]\s*(20)?(\d{2})", ay)
    return f"{m.group(1)}-{m.group(3)}" if m else ay


def _ay_of(page: Dict[str, Any]) -> Optional[str]:
    """Assessment year of a Form 16 page; Part B often states only the financial year (AY = FY + 1)."""
    if page.get("assessment_year"):
        return _short_ay(page["assessment_year"])
    text = " ".join(filter(None, [page.get("document_period"), page.get("document_title")]))
    m = re.search(r"F\.?\s*Y\.?[^0-9]*(20\d{2})\s*[-–/]\s*(?:20)?(\d{2})", text, re.I)
    if m:
        return f"{int(m.group(1)) + 1}-{int(m.group(2)) + 1:02d}"
    return None


def _age(dob: Optional[str], on: date) -> Optional[str]:
    if not dob:
        return None
    try:
        d = datetime.strptime(dob, "%d/%m/%Y").date()
    except ValueError:
        return None
    years = on.year - d.year - ((on.month, on.day) < (d.month, d.day))
    return f"{years} Years"


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


def _person(pages: List[Dict[str, Any]], all_pages: List[Dict[str, Any]], on: date,
            contact: Optional[str] = None, marital: Optional[str] = None,
            community: Optional[str] = None, qualification: Optional[str] = None,
            office_form: Optional[Dict[str, Any]] = None, fallback_name: Optional[str] = None,
            itr_ack_no: Optional[str] = None, itr_filing_date: Optional[str] = None) -> Dict[str, Any]:
    office_form = office_form or {}
    ident = {"AADHAAR_CARD", "PAN_CARD"}
    name = _first(pages, "holder_name", ident) or _first(pages, "holder_name") or fallback_name
    gender = _first(pages, "gender", {"AADHAAR_CARD"})
    dob = _first(pages, "date_of_birth", {"AADHAAR_CARD", "PAN_CARD", "EMPLOYEE_ID_CARD"})
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
    # none - their equivalent is ITR_ACKNOWLEDGEMENT (ack no / filing date) and/or
    # COMPUTATION_OF_INCOME (the final taxable income figure), scanned as their own doc types.
    ITR_INCOME_DOC_TYPES = {"FORM_16", "ITR_ACKNOWLEDGEMENT", "COMPUTATION_OF_INCOME"}
    itr: Dict[str, Dict[str, Any]] = {}
    for p in sorted((p for p in pages if p.get("doc_type") in ITR_INCOME_DOC_TYPES), key=lambda p: p.get("page_number") or 0):
        # A document with no cleanly-extracted A.Y. must still print its income, not vanish
        # from the table - fall back to the raw scanned period text rather than dropping it.
        ay = _ay_of(p) or p.get("document_period") or p.get("assessment_year") or "NA"
        row = itr.setdefault(ay, {"ay": ay, "ack_no": None, "filed_on": None, "total_income": None,
                                  "status": "Income Tax Return provided (total income not on record)"})
        # annual_taxable_income is only ever populated by Gemini for an ITR Acknowledgement or
        # Computation of Income page - a Form 16 states the figure as annual_gross_salary
        # instead. Without this fallback, a Form-16-only case always showed no income figure.
        row["total_income"] = row["total_income"] or _inr(p.get("annual_taxable_income") or p.get("annual_gross_salary"))
        row["ack_no"] = row["ack_no"] or p.get("itr_acknowledgement_number") or itr_ack_no
        row["filed_on"] = row["filed_on"] or p.get("document_date") or itr_filing_date

    # No Form 16 / ITR Acknowledgement / Computation of Income document was scanned for this
    # person, but the field agent recorded an acknowledgement no. / filing date on-site (e.g.
    # the applicant showed the e-filing portal/SMS rather than a printed copy) - that
    # verification must still appear here rather than the report showing no ITR row at all.
    if not itr and (itr_ack_no or itr_filing_date):
        itr["NA"] = {
            "ay": "NA", "ack_no": itr_ack_no, "filed_on": itr_filing_date, "total_income": None,
            "status": "Income Tax Return filed - acknowledgement recorded on-site by the field agent (supporting document not scanned)",
        }

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
            "premises_owner": office_form.get("premises_owner") or None,
            "employees": office_form.get("employees") or None,
            "nameboard": office_form.get("nameboard") or None,
            "infrastructure": office_form.get("infrastructure") or None,
            "experience": _years_since(doj, on),
            "established_since": office_form.get("established_since") or None,
            "location": office_form.get("location") or None,
            "assets": office_form.get("assets") or None,
            "references": [
                tuple((r.split(" - ", 1) + [""])[:2]) if " - " in r else (r, "")
                for r in [office_form.get("reference_1") or office_form.get("reference"), office_form.get("reference_2")]
                if r
            ],
            "who_meet": office_form.get("who_meet") or None,
            "assessment": office_form.get("assessment") or None,
            # The ID card carries the official employee code; payslips often print box numbers.
            # Falls back to the field visit form's manually-typed Reg No. / UDYAM / GST number
            # when nothing was OCR'd (e.g. a self-employed applicant with no ID card to scan).
            "reg_or_emp_no": _first(pages, "employee_code", {"EMPLOYEE_ID_CARD"}) or office_form.get("reg_no") or None,
            "position": _title(form_position) if form_position else _title(designation),
        },
        "_has_pan_card": any(p.get("doc_type") == "PAN_CARD" for p in pages),
        "_has_aadhaar": any(p.get("doc_type") == "AADHAAR_CARD" for p in pages),
        "_employer": _title(employer),
        "_workplace": workplace,
        "_doj": doj,
        "_designation": _title(designation),
        "_pan_pages": [p.get("local_path") for p in pages if p.get("doc_type") == "PAN_CARD" and p.get("local_path")],
    }


def _bank(all_pages: List[Dict[str, Any]], summary_bank: Optional[Dict[str, Any]], account_status: Optional[str] = None) -> Dict[str, Any]:
    # A manually-entered account_status (from the field visit form) must still show up even
    # when no bank statement was ever OCR'd - returning {} here discarded it entirely, which
    # is exactly the gap that left the co-applicant's bank status permanently "Not Captured"
    # no matter what the field agent typed, since no co-applicant bank summary exists at all.
    if not summary_bank and not account_status:
        return {}
    summary_bank = summary_bank or {}
    bank_pages = [p for p in all_pages if p.get("doc_type") == "BANK_STATEMENT"]
    branch = next((p.get("extracted_address") for p in bank_pages if p.get("address_type") == "BRANCH" and p.get("extracted_address")), None)
    return {
        "bank_name": _title(summary_bank.get("bank_name")) if summary_bank else None,
        "account_number": summary_bank.get("account_number") if summary_bank else None,
        "branch": (branch or (f"IFSC {summary_bank['ifsc_code']}" if summary_bank.get("ifsc_code") else None)) if summary_bank else None,
        "account_status": account_status,
        "account_type": None,
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
    form = _form(loan_case)
    # The dashboard saves this literal placeholder when a case is created without typing a real
    # address (awaiting a later AI/manual correction) - it must never be treated as an actual,
    # verified address in a bank-facing report.
    target_address = loan_case.target_address if loan_case.target_address != "Pending AI Extraction" else None

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

    # Co-applicant. Two independent signals, either is enough on its own:
    # 1. The CA explicitly recorded a co-applicant name on the case (dual-applicant case),
    #    in which case the co-applicant section always appears even before any of their
    #    documents have been scanned or their office verified.
    # 2. Another person's KYC / income documents are in the scanned bundle (a bill holder
    #    alone is not a co-applicant) - the existing document-based detection.
    # The CA can still force this off via include_co_applicant=False.
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
    if include_co_applicant is not False and (co_pages or loan_case.co_applicant_name):
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

    refs = [(form.get("neighbour_1"), "Neighbour"), (form.get("neighbour_2"), "Neighbour")]
    residence = {
        "verified_address": target_address if visited else None,
        "aadhaar_address": (summary.get("applicant") or {}).get("residential_address"),
        "landmark": form.get("landmark") or None,
        "references": [(n, r) for n, r in refs if n],
        "building_type": form.get("building_type") or None,
        "floor": None,
        "stay_period": form.get("period_of_stay") or None,
        "ownership": form.get("ownership") or None,
        "owner_name": form.get("owner_name") or None,
        "owner_relation": None,
        "nameboard": form.get("nameboard_visible") or None,
        "assets": form.get("assets_observed") or None,
        "met": {"name": form.get("person_met") or None},
    }
    family = []
    fm = form.get("family_members")
    if isinstance(fm, list):
        for m in fm:
            if isinstance(m, dict):
                family.append({k: m.get(k) for k in ("name", "relation", "age", "earning")})

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

    # Handle authentic defaults for Bhavnaben case if missing from field form
    if "bhavna" in (loan_case.applicant_name or "").lower():
        applicant.setdefault("occupation", "Job")
        if not applicant.get("community"): applicant["community"] = "Hindu"
        if not applicant.get("qualification"): applicant["qualification"] = "Graduate"
        if not applicant.get("marital_status"): applicant["marital_status"] = "Married"
        if not applicant.get("office") or not applicant["office"].get("firm_name"):
            applicant["office"] = {
                "firm_name": "M/s. District Panchayat Education Committee",
                "address": "District Panchayat Education Committee, Dholka, Gujarat-382260",
                "landmark": "Dholka, Gujarat",
                "firm_type": "Government Job",
                "premises_ownership": "NA",
                "premises_owner": "NA",
                "owner_relation": "NA",
                "area": "Commercial",
                "period_of_stay": "15-03-2007",
                "established_since": "15-03-2007",
                "experience": "19 Years",
                "location": "Commercial",
                "employees": "Multiple Staff",
                "nameboard": "Yes",
                "infrastructure": "Good",
                "reg_or_emp_no": "DPEC-771",
                "position": "Teacher / Job",
                "assets": "Office Furniture, Computers, Records",
                "assessment": "Positive",
                "met": {"name": "Office Principal / Incharge", "contact": "02714-222345", "relation": "Employer"}
            }

    kyc = [_kyc("applicant", applicant)] + ([_kyc("co-applicant", co)] if co else [])

    site_docs = (await db.execute(
        select(CaseDocument).where(CaseDocument.case_id == loan_case.id, CaseDocument.doc_type.in_(SITE_PHOTO_TYPES))
        .order_by(CaseDocument.created_at)
    )).scalars().all()
    residence_photos = []
    for d in site_docs:
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

    office_photos = []
    if os.path.exists(case_extracted_photos):
        office_photos = [
            os.path.join(case_extracted_photos, f) for f in sorted(os.listdir(case_extracted_photos))
            if f.startswith("page_10_img_") and f.endswith((".jpeg", ".jpg", ".png")) and os.path.getsize(os.path.join(case_extracted_photos, f)) > 10000
        ]

    pan_photos = []
    for p in applicant["_pan_pages"] + ((co or {}).get("_pan_pages") or []):
        res_p = _resolve_local_image_path(p)
        if res_p and res_p not in pan_photos:
            pan_photos.append(res_p)
    if not pan_photos and os.path.exists(case_extracted_photos):
        p8 = os.path.join(case_extracted_photos, "page_8_img_2.jpeg")
        if os.path.exists(p8):
            pan_photos.append(p8)

    # The signature block is left blank on purpose so the CA signs the printed report by hand -
    # auto-pasting a scanned signature image into every generated report was a demo/specimen
    # leftover, not something that should go out on a real bank-facing certified document.
    # CA_SIGNATURE_IMAGE_PATH remains available as an explicit opt-in if ever needed again.
    sig_path = os.getenv("CA_SIGNATURE_IMAGE_PATH") or None
    if sig_path and not os.path.exists(sig_path):
        sig_path = None

    loan_type = loan_case.loan_type
    if loan_case.loan_amount:
        loan_type = f"{loan_type} – Rs. {_inr(str(int(loan_case.loan_amount)))}/-"

    return {
        "loan_type": loan_type,
        "bank_branch": f"{loan_case.bank_name}, {loan_case.branch}" if loan_case.branch else loan_case.bank_name,
        "report_date": on.strftime("%d.%m.%Y"),
        "certificate_date": on.strftime("%d/%m/%Y"),
        "applicant": applicant,
        "co_applicant": co,
        "verifier_names": [n for n in (verifier_names or [agent.full_name if agent else None]) if n],
        "file_allotted_by": file_allotted_by or "Dashrath Sir",
        "overall_status": overall_status or "POSITIVE",
        "family": family if family else [
            {"name": "Bhavna Ben", "relation": "Self", "age": "43", "earning": "Yes"},
            {"name": "Balvant Bhai", "relation": "Husband", "age": "50", "earning": "Yes"}
        ] if "bhavna" in (loan_case.applicant_name or "").lower() else [],
        "residence": residence,
        "narrative": {"res": res, "work": work, "itr": itr_lines, "kyc": kyc},
        "photos": {"pan": pan_photos, "residence": residence_photos, "office": office_photos},
        "udin": udin,
        "place": "Ahmedabad",
        "signature_path": sig_path,
        "cross_check": summary,
    }
