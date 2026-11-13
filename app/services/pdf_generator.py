import hashlib
import os
import re
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from app.core.config import settings
from app.services.applicant_slots import home_group_for_slot, parse_home_sharing
from app.services.pdf_separator import _name_score


def is_valid_image(path: Optional[str]) -> bool:
    """Check if file exists and can be validly decoded by PIL without crashing ReportLab."""
    if not path or not os.path.exists(path):
        return False
    try:
        if os.path.getsize(path) < 100:
            return False
        from PIL import Image as PILImage
        with PILImage.open(path) as img:
            img.verify()
        return True
    except Exception:
        return False


def generate_certified_cpv_report(
    output_pdf_path: str,
    case_data: Dict[str, Any],
    visit_data: Optional[Dict[str, Any]] = None,
    document_items: Optional[List[Dict[str, Any]]] = None,
    ca_remarks: str = "",
    udin: Optional[str] = None,
    partner_name: Optional[str] = None,
    firm_reg_no: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Compile a bank-ready, certified Contact Point Verification (CPV) Report matching
    the exact 9-page specimen copy used by Naimish N. Shah & Co. Chartered Accountants
    for Union Bank of India and other empanelled banks.
    """
    os.makedirs(os.path.dirname(os.path.abspath(output_pdf_path)), exist_ok=True)

    partner = partner_name or "CA PRANAV N. SHAH"
    frn = firm_reg_no or "106829W"
    # A UDIN is unique per document (ICAI portal); without one the report must say so.
    effective_udin = udin or "NOT YET GENERATED"
    rep_date = case_data.get("report_date") or datetime.now().strftime("%d-%m-%Y")

    NOT_CAPTURED = "NA"

    applicant_name = case_data.get("applicant_name") or NOT_CAPTURED
    raw_target_address = case_data.get("target_address")
    target_address = raw_target_address if raw_target_address and raw_target_address != "Pending AI Extraction" else NOT_CAPTURED
    from app.services.field_form_pdf_ingest import enrich_field_form_defaults, resolve_effective_loan_amount
    field_form = enrich_field_form_defaults(
        case_data.get("field_form") or {},
        applicant_name=applicant_name if applicant_name != NOT_CAPTURED else None,
        target_address=target_address if target_address != NOT_CAPTURED else None,
    )
    applicant_phone = case_data.get("applicant_phone") or field_form.get("contact_number") or NOT_CAPTURED
    bank_name = case_data.get("bank_name") or NOT_CAPTURED
    branch = case_data.get("branch") or NOT_CAPTURED
    loan_type = case_data.get("loan_type") or NOT_CAPTURED
    loan_amount = resolve_effective_loan_amount(case_data.get("loan_amount"), field_form)
    loan_amount_str = f"Rs. {loan_amount:,.0f}/-" if loan_amount else NOT_CAPTURED
    co_applicant_name = case_data.get("co_applicant_name") or None
    co_applicant_phone = case_data.get("co_applicant_phone") or None
    # Only set when the CA office has flagged the co-applicant as living at a separate address
    # from the primary applicant - the overwhelming majority of dual-applicant cases (e.g.
    # spouses) leave this blank and share the one Annexure A residence section below.
    co_applicant_address = case_data.get("co_applicant_address") or None

    # Real OCR'd identity facts (Aadhaar/PAN/Employee ID scans), when the CA office has
    # actually scanned those documents for this case - never a stand-in from another case.
    document_items = document_items or []

    # Refresh relationship_to_applicant in-memory across all pdf_ingest pages using the exact
    # same assign_relationships() pass that assemble_cpv_report_data() (DOCX) runs, so PDF and
    # DOCX never disagree on which pages belong to SELF vs DIFFERENT_PERSON.
    from app.services.pdf_separator import assign_relationships as _assign_rels
    _ingest_ocr_pages = []
    _ingest_doc_refs = []
    for _d in document_items:
        _od = _d.get("ocr_data")
        if isinstance(_od, dict) and _od.get("source") == "pdf_ingest" and _od.get("scan_status") != "FAILED":
            _page_copy = dict(_od)
            _page_copy["doc_type"] = _page_copy.get("llm_doc_type") or _page_copy.get("doc_type") or _d.get("doc_type")
            _ingest_ocr_pages.append(_page_copy)
            _ingest_doc_refs.append(_d)
    if _ingest_ocr_pages:
        _assign_rels(
            _ingest_ocr_pages,
            applicant_name if applicant_name != NOT_CAPTURED else "",
            co_applicant_name or "",
        )
        for _d, _p in zip(_ingest_doc_refs, _ingest_ocr_pages):
            _d["ocr_data"] = _p

    # A page whose holder name couldn't be read at all (blurry/back-side scan, OCR failure) is
    # tagged relationship_to_applicant="UNKNOWN" by assign_relationships - genuinely unidentified,
    # not "assume it's the applicant". Treating UNKNOWN the same as "not DIFFERENT_PERSON" (the
    # old check) let an unreadable duplicate scan of the CO-APPLICANT's own card - same Aadhaar
    # number, just no holder name on that particular page - get attributed to the PRIMARY
    # APPLICANT instead, printing the co-applicant's Aadhaar number in the applicant's own slot.
    # None/absent (no relationship tag at all, e.g. a document scanned before this field existed)
    # still defaults to the applicant's own, matching the equivalent fallback already used for
    # the dashboard's KYC card slots.
    def _belongs_to(rel: Optional[str], co_applicant: bool) -> bool:
        if co_applicant:
            return rel == "DIFFERENT_PERSON"
        return rel in (None, "SELF")

    def _ocr_first(field_name: str, doc_types: Optional[set] = None, co_applicant: bool = False):
        for d in document_items:
            od = d.get("ocr_data") or {}
            # The DB's own doc_type column collapses unusual document kinds (e.g. an
            # employee ID card) down to OTHER - the real Gemini classification lives
            # inside ocr_data itself, same as _ai_ingested_pages() resolves it.
            real_doc_type = od.get("llm_doc_type") or od.get("doc_type") or d.get("doc_type")
            if not _belongs_to(od.get("relationship_to_applicant"), co_applicant):
                continue
            if od.get(field_name) and (doc_types is None or real_doc_type in doc_types):
                return od[field_name]
        return None

    def _ocr_residential_address(co_applicant: bool = False):
        for d in document_items:
            od = d.get("ocr_data") or {}
            real_doc_type = od.get("llm_doc_type") or od.get("doc_type") or d.get("doc_type")
            if not _belongs_to(od.get("relationship_to_applicant"), co_applicant):
                continue
            addr_val = od.get("extracted_address") or od.get("address")
            if real_doc_type == "AADHAAR_CARD" and addr_val and od.get("address_type") in ("RESIDENTIAL", None):
                return addr_val
        for d in document_items:
            od = d.get("ocr_data") or {}
            if not _belongs_to(od.get("relationship_to_applicant"), co_applicant):
                continue
            addr_val = od.get("extracted_address") or od.get("address")
            if addr_val and od.get("address_type") == "RESIDENTIAL":
                return addr_val
        return None

    # Applicants 3-5: scoped strictly to matched_applicant_slot (set by pdf_separator.py's
    # tag_applicant_slots, independent of the applicant/co-applicant SELF/DIFFERENT_PERSON
    # binary above) - a document is only used here when it was unambiguously matched to THAT
    # slot's configured name, so one applicant's PAN/Aadhaar/DOB can never print under another
    # applicant's section, the same guarantee _belongs_to() gives applicant vs co-applicant.
    def _ocr_first_for_slot(field_name: str, slot_no: int, doc_types: Optional[set] = None):
        for d in document_items:
            od = d.get("ocr_data") or {}
            if od.get("matched_applicant_slot") != slot_no:
                continue
            real_doc_type = od.get("llm_doc_type") or od.get("doc_type") or d.get("doc_type")
            if od.get(field_name) and (doc_types is None or real_doc_type in doc_types):
                return od[field_name]
        return None

    real_pan = _ocr_first("extracted_pan", {"PAN_CARD"}) or _ocr_first("extracted_pan")
    real_aadhaar = _ocr_first("extracted_aadhaar", {"AADHAAR_CARD"})
    real_dob = _ocr_first("date_of_birth", {"AADHAAR_CARD", "PAN_CARD", "EMPLOYEE_ID_CARD"}) or _ocr_first("date_of_birth")
    real_gender = _ocr_first("gender", {"AADHAAR_CARD", "PAN_CARD"}) or _ocr_first("gender")
    real_aadhaar_address = _ocr_residential_address()

    # Same OCR lookups, scoped to the co-applicant's own scanned documents (a different
    # person from the one who's own KYC the applicant's lookups above are scoped to).
    real_pan_co = _ocr_first("extracted_pan", {"PAN_CARD"}, co_applicant=True) or _ocr_first("extracted_pan", co_applicant=True)
    real_aadhaar_co = _ocr_first("extracted_aadhaar", {"AADHAAR_CARD"}, co_applicant=True)
    real_dob_co = _ocr_first("date_of_birth", {"AADHAAR_CARD", "PAN_CARD", "EMPLOYEE_ID_CARD"}, co_applicant=True) or _ocr_first("date_of_birth", co_applicant=True)
    real_gender_co = _ocr_first("gender", {"AADHAAR_CARD", "PAN_CARD"}, co_applicant=True) or _ocr_first("gender", co_applicant=True)

    doc = SimpleDocTemplate(
        output_pdf_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )

    styles = getSampleStyleSheet()

    # The real letterhead renders the firm name in "Monotype Corsiva" (confirmed by extracting
    # the embedded font program straight out of a genuine CA-office-delivered report PDF) - not
    # an italic serif approximation. Register the real font so this is an exact match, not a
    # lookalike.
    firm_script_font = "Times-BoldItalic"
    _corsiva_path = os.path.join("app", "static", "fonts", "MonotypeCorsiva.ttf")
    if os.path.exists(_corsiva_path):
        try:
            if "MonotypeCorsiva" not in pdfmetrics.getRegisteredFontNames():
                pdfmetrics.registerFont(TTFont("MonotypeCorsiva", _corsiva_path))
            firm_script_font = "MonotypeCorsiva"
        except Exception:
            firm_script_font = "Times-BoldItalic"

    # Specimen typography styles
    firm_title_style = ParagraphStyle(
        "FirmTitle",
        parent=styles["Normal"],
        fontName=firm_script_font,
        fontSize=19,
        leading=22,
        textColor=colors.HexColor("#0F172A"),
        alignment=1,  # Center within its column
    )
    firm_sub_style = ParagraphStyle(
        "FirmSub",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=11,
        textColor=colors.HexColor("#0F172A"),
        alignment=1,
    )
    firm_partners_style = ParagraphStyle(
        "FirmPartners",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#0F172A"),
        alignment=0,  # Left, stacked under the logo like the real letterhead
    )
    firm_addr_style = ParagraphStyle(
        "FirmAddr",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7,
        leading=9.5,
        textColor=colors.HexColor("#64748B"),
        alignment=1,
    )
    page_num_style = ParagraphStyle(
        "PageNum",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.5,
        leading=9,
        textColor=colors.HexColor("#94A3B8"),
        alignment=2,  # Right
    )
    section_title_style = ParagraphStyle(
        "SecTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor("#1E40AF"),
        alignment=1,
        spaceBefore=4,
        spaceAfter=6,
    )
    anx_title_style = ParagraphStyle(
        "AnxTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=13,
        textColor=colors.HexColor("#1E40AF"),
        alignment=1,
        spaceBefore=2,
        spaceAfter=4,
    )
    body_style = ParagraphStyle(
        "BodyTextCustom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor("#1E293B"),
    )
    table_cell_style = ParagraphStyle(
        "TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#0F172A"),
    )
    table_cell_bold = ParagraphStyle(
        "TableCellBold",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#0F172A"),
    )
    table_hdr_style = ParagraphStyle(
        "TableHdr",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=7.5,
        leading=10,
        textColor=colors.white,
    )

    story = []

    logo_path = os.path.join("app", "static", "ca_india_logo.jpg")
    has_logo = os.path.exists(logo_path)

    def add_firm_header(page_num: int):
        # Two-column letterhead matching the firm's real report: CA India logo + both partner
        # names stacked on the left, the firm's script-style name + "CHARTERED ACCOUNTANTS" on
        # the right - not centered as one stacked block like the earlier layout had it.
        left_cell = []
        if has_logo:
            left_cell.append(Image(logo_path, width=0.95 * inch, height=0.52 * inch))
            left_cell.append(Spacer(1, 2))
        left_cell.append(Paragraph("CA PRANAV N. SHAH", firm_partners_style))
        left_cell.append(Paragraph("CA TANMAY J. DESAI", firm_partners_style))

        right_cell = [
            Paragraph("Naimish N. Shah & Co.", firm_title_style),
            Paragraph("CHARTERED ACCOUNTANTS", firm_sub_style),
        ]

        header_table = Table([[left_cell, right_cell]], colWidths=[2.8 * inch, 4.7 * inch])
        header_table.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("ALIGN", (0, 0), (0, 0), "LEFT"),
            ("ALIGN", (1, 0), (1, 0), "RIGHT"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]))
        story.append(header_table)
        story.append(Spacer(1, 3))
        story.append(Paragraph(
            "“SHREE GANESH”, B/3, Trupti Apartments, 3rd Floor, Next to Old High Court (interchange) Metro Station, Navrangpura, "
            "Ahmedabad – 380 009. E-Mail: contact@nnshahco.in (O).: (079)27546336 Mobile: 98240 21625, 98790 05671",
            firm_addr_style
        ))
        story.append(Spacer(1, 2))
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#1E40AF"), spaceAfter=2))
        story.append(Paragraph(f"{page_num} | P a g e", page_num_style))
        story.append(Spacer(1, 4))

    # ================= PAGE 1 =================
    add_firm_header(1)
    story.append(Paragraph("Contact Point Verification (CPV) report for loan process", section_title_style))
    story.append(Spacer(1, 4))

    loan_persons_text = f"Applicant: <b>{applicant_name}</b>"
    if co_applicant_name:
        loan_persons_text += f"<br/>Co-Applicant: <b>{co_applicant_name}</b>"
    verifier_name = (
        case_data.get("agent_name")
        or field_form.get("executive")
        or field_form.get("executive_name")
        or NOT_CAPTURED
    )
    allotted_by_name = (
        field_form.get("file_allotted_by")
        or field_form.get("allotted_by")
        or (f"{bank_name}, {branch}" if branch != NOT_CAPTURED else bank_name)
    )
    p1_grid = [
        [Paragraph("<b>Type of Loan:</b>", table_cell_bold), Paragraph(str(loan_type), table_cell_style)],
        [Paragraph("<b>Branch:</b>", table_cell_bold), Paragraph(f"{bank_name}, {branch}", table_cell_style)],
        [Paragraph("<b>Report Date:</b>", table_cell_bold), Paragraph(rep_date, table_cell_style)],
        [Paragraph("<b>Loan Persons:</b>", table_cell_bold), Paragraph(loan_persons_text, table_cell_style)],
        [Paragraph("<b>Verifier Executive:</b>", table_cell_bold), Paragraph(f"Name: {verifier_name}", table_cell_style)],
        [Paragraph("<b>File Allotted:</b>", table_cell_bold), Paragraph(f"Name: {allotted_by_name}", table_cell_style)],
    ]
    t_p1 = Table(p1_grid, colWidths=[2.2 * inch, 5.3 * inch])
    t_p1.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F8FAFC")),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(t_p1)
    story.append(Spacer(1, 10))

    story.append(Paragraph("<b>Indexing:</b>", body_style))
    story.append(Spacer(1, 3))
    idx_grid = [
        [Paragraph("Sr. No.", table_hdr_style), Paragraph("Verification Content", table_hdr_style), Paragraph("Annexure No", table_hdr_style)],
        [Paragraph("1", table_cell_style), Paragraph("Residential Verification", table_cell_style), Paragraph("Annexure 'A'", table_cell_style)],
        [Paragraph("2", table_cell_style), Paragraph("Business/ Office Verification", table_cell_style), Paragraph("Annexure 'B'", table_cell_style)],
        [Paragraph("3", table_cell_style), Paragraph("Income tax Return", table_cell_style), Paragraph("Annexure 'C'", table_cell_style)],
        [Paragraph("4", table_cell_style), Paragraph("Bank Details", table_cell_style), Paragraph("Annexure 'D'", table_cell_style)],
        [Paragraph("5", table_cell_style), Paragraph("Visit Photographs", table_cell_style), Paragraph("Annexure 'E'", table_cell_style)],
        [Paragraph("6", table_cell_style), Paragraph("Total Pages", table_cell_style), Paragraph("13" if co_applicant_name else "11", table_cell_style)],
    ]
    t_idx = Table(idx_grid, colWidths=[0.8 * inch, 4.4 * inch, 2.3 * inch])
    t_idx.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1E40AF")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(t_idx)
    story.append(Spacer(1, 12))

    obs_grid = [
        [
            Paragraph("<b>Overall Observation Status:</b>", table_cell_bold),
            Paragraph("<font color='#059669' size='9'><b>OVERALL OPERATION IS CONSIDERED POSITIVE</b></font>", table_cell_style),
        ]
    ]
    t_obs = Table(obs_grid, colWidths=[2.2 * inch, 5.3 * inch])
    t_obs.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#059669")),
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#ECFDF5")),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(t_obs)

    # ================= PAGE 2 =================
    story.append(PageBreak())
    add_firm_header(2)
    story.append(Paragraph("SUMMARY OF THE REPORT", section_title_style))
    story.append(Spacer(1, 6))

    # Dynamic Summary Details from field_form & case
    met_raw = field_form.get("person_met") or ""
    if met_raw:
        clean_met = re.sub(r"\s*-\s*\d+", "", str(met_raw)).strip()
        if ")" not in clean_met and ")" in str(met_raw):
            clean_met += ")"
        if "of the applicant" not in clean_met.lower() and "(" in clean_met:
            clean_met = clean_met.replace(")", " of the applicant)")
        met_desc = clean_met
    else:
        met_desc = "the occupants at the site"

    stay_period = str(field_form.get("period_of_stay") or "")
    if stay_period and not stay_period.lower().endswith("years") and not stay_period.lower().endswith("yrs"):
        stay_period = f"{stay_period} years"
    stay_period = stay_period or NOT_CAPTURED

    bldg_type = field_form.get("building_type") or NOT_CAPTURED
    ownership = field_form.get("ownership") or NOT_CAPTURED

    office = field_form.get("office_details") or {}
    firm_name = office.get("firm_name") or ""
    office_addr = office.get("address") or ""
    # Premises Owner Name is suggested to the agent as "(Name) Relation" (e.g. "( Rajesh Patel )
    # Landlord") so the DOCX's separate Relation with Applicant cell can be populated - without
    # parsing it out here too, the PDF (which has no separate relation row) would print the raw
    # "(Rajesh Patel) Landlord" string, parentheses and all, instead of just the name.
    premises_owner_raw = office.get("premises_owner") or ""
    _premises_owner_match = re.match(r"^\s*\(([^)]+)\)\s*(.*)$", premises_owner_raw)
    office_premises_owner = (_premises_owner_match.group(1).strip() if _premises_owner_match else premises_owner_raw.strip()) or NOT_CAPTURED
    position = office.get("position") or NOT_CAPTURED
    experience = office.get("experience") or office.get("period_of_stay") or ""
    if experience and not str(experience).lower().endswith("years") and not str(experience).lower().endswith("yrs"):
        experience = f"{experience} years"
    experience = experience or NOT_CAPTURED

    occupation_val = field_form.get("occupation") or NOT_CAPTURED
    # Must match the Annexure B is_working check below exactly (same occupation field, not
    # firm_name) - an applicant whose occupation is e.g. "Business" but who has no office_details
    # captured yet (office fields genuinely not filled in by the field agent) was printing "is a
    # Housewife / Homemaker" here while Annexure B, two pages later, correctly showed an Office
    # Verification section for the same applicant - a contradiction within the same certified
    # report caused by this earlier is_working check keying off firm_name instead of occupation.
    is_working = field_form.get("occupation") not in ("Housewife", "House Wife", None)

    # Co-applicant's own office, submitted separately in the PWA questionnaire since the
    # co-applicant's workplace is frequently a different premises from the applicant's.
    office_co = field_form.get("office_details_co") or {}
    co_premises_owner_raw = office_co.get("premises_owner") or ""
    _co_premises_owner_match = re.match(r"^\s*\(([^)]+)\)\s*(.*)$", co_premises_owner_raw)
    office_co_premises_owner = (_co_premises_owner_match.group(1).strip() if _co_premises_owner_match else co_premises_owner_raw.strip()) or NOT_CAPTURED

    # Co-applicant's own residence details, only ever submitted by the PWA when the CA office
    # flagged co_applicant_address on the case record (most dual-applicant cases share one home
    # and never have this).
    residence_co = field_form.get("residence_details_co") or {}
    co_firm_name = office_co.get("firm_name") or ""
    co_office_addr = office_co.get("address") or ""
    co_position = office_co.get("position") or NOT_CAPTURED
    co_occupation_val = office_co.get("occupation") or NOT_CAPTURED

    # Real Form 16 assessment years, read off the applicant's own scanned Form 16 pages -
    # never a hardcoded guess. One scanned Form 16 can cover multiple years (Part A/Part B
    # pages, or several years filed together); each page is deduplicated by its own A.Y.
    from app.services.cpv_report_data import _ay_of, _inr

    # A salaried applicant's income proof is FORM_16; a self-employed/business applicant has no
    # Form 16 at all - their equivalent is an ITR_ACKNOWLEDGEMENT (ack no / filing date) and/or
    # a COMPUTATION_OF_INCOME sheet (the final taxable income figure). All three are collapsed
    # to other DocumentType enum values in the DB column, so the real page type must come from
    # ocr_data, the same way _ocr_first() above resolves doc types for OCR lookups.
    ITR_INCOME_DOC_TYPES = {"FORM_16", "ITR_ACKNOWLEDGEMENT", "COMPUTATION_OF_INCOME", "PROFIT_LOSS_BALANCE_SHEET"}

    def _is_itr_income_doc(d):
        od = d.get("ocr_data") or {}
        return (od.get("llm_doc_type") or od.get("doc_type") or d.get("doc_type")) in ITR_INCOME_DOC_TYPES

    def _build_itr_rows(co_applicant: bool):
        rows = {}
        cand_ods = []
        for d in document_items:
            if not _is_itr_income_doc(d):
                continue
            od = d.get("ocr_data") or {}
            is_co_doc = od.get("relationship_to_applicant") == "DIFFERENT_PERSON"
            if co_applicant != is_co_doc:
                continue
            cand_ods.append(od)
        known_ays = [_ay_of(od) for od in cand_ods if _ay_of(od)]
        default_ay = known_ays[0] if len(set(known_ays)) == 1 else None
        for od in cand_ods:
            ay = _ay_of(od) or default_ay
            income_val = od.get("annual_taxable_income") or od.get("annual_gross_salary")
            ack_val = od.get("itr_acknowledgement_number")
            dt_val = od.get("document_date")
            if not ay and not income_val and not ack_val:
                continue
            ay = ay or "Verified"
            row = rows.setdefault(ay, {"ay": ay, "income": None, "ack_no": None, "filed_on": None})
            row["income"] = row["income"] or _inr(income_val)
            row["ack_no"] = row["ack_no"] or ack_val
            row["filed_on"] = row["filed_on"] or dt_val
        # Per explicit CA office instruction: omit any ITR / Form 16 / Assessment record
        # where the Total Income / Amount is not available (None / NA / 0).
        return {
            ay: r for ay, r in rows.items()
            if r.get("income") and str(r.get("income")).strip().upper() not in ("", "NA", "N/A", "NONE", "0")
        }

    form16_rows = _build_itr_rows(co_applicant=False)
    form16_ay_list = sorted(form16_rows.keys(), reverse=True)
    form16_ay_str = ", ".join(f"A.Y.{ay}" for ay in form16_ay_list) if form16_ay_list else NOT_CAPTURED

    form16_rows_co = _build_itr_rows(co_applicant=True)

    work_bullet = ""
    if is_working:
        work_bullet = f"""
    <b>Working Details:</b><br/><br/>
     The applicant, <b>{applicant_name}</b>, is employed with/ has a business named <b>{firm_name or NOT_CAPTURED}</b>, located at, <b>{office_addr or NOT_CAPTURED}</b>. A physical verification was conducted on {rep_date}.<br/><br/>
     During the verification, the applicant's employment details/ business details was confirmed, the applicant is working as a <b>{position}</b>. The applicant has been associated with the organization for <b>{experience}</b>.<br/><br/>
     Based on the verification conducted, the employment details of the applicant are genuine.<br/><br/>
        """
    else:
        work_bullet = f"""
    <b>Working Details:</b><br/><br/>
     The applicant, <b>{applicant_name}</b>, is a Housewife / Homemaker. Workplace physical verification is not applicable.<br/><br/>
     During the verification, it was confirmed that the applicant is not engaged in external commercial employment.<br/><br/>
     Based on the verification conducted, the applicant's profile details are genuine.<br/><br/>
        """

    is_co_working = bool(co_applicant_name) and office_co.get("occupation") not in ("Housewife", "House Wife", None)
    co_work_bullet = ""
    if co_applicant_name:
        if is_co_working:
            co_work_bullet = (
                "<b>Co-Applicant Working Details:</b><br/><br/>"
                f"  The co-applicant, <b>{co_applicant_name}</b>, is employed with/ has a business named <b>{co_firm_name or NOT_CAPTURED}</b>, located at, <b>{co_office_addr or NOT_CAPTURED}</b>. A physical verification was conducted on {rep_date}.<br/><br/>"
                f"  During the verification, the co-applicant is working as a <b>{co_position}</b>.<br/><br/>"
                f"  Based on the verification conducted, the employment details of the co-applicant are genuine.<br/><br/>"
            )
        else:
            co_work_bullet = (
                "<b>Co-Applicant Working Details:</b><br/><br/>"
                f"  The co-applicant, <b>{co_applicant_name}</b>, is a Housewife / Homemaker. Workplace physical verification is not applicable.<br/><br/>"
            )
    kyc_line = f"The applicant, <b>{applicant_name}</b>, has submitted the KYC documents."
    if co_applicant_name:
        kyc_line += f"<br/>The co-applicant, <b>{co_applicant_name}</b>, has submitted the KYC documents."

    p2_content = f"""
    <b>Residential Details:</b><br/><br/>
     A residence verification was conducted for the applicant, <b>{applicant_name}</b>, at the following address Viz: <b>{target_address}</b>, on {rep_date}.<br/><br/>
     During the course of verification, the premises were occupied. The verification was carried out through interaction with <b>{met_desc}</b> who confirmed that they have been residing at the said address for the past <b>{stay_period}</b>. Which appears consistent with the information provided.<br/><br/>
     The property is a <b>{bldg_type}</b> and is classified as <b>{ownership}</b>. The surrounding area is residential in nature, and the locality was observed to be developed with adequate infrastructure.<br/><br/>
     During the course of verification, residence proof indicators were observed at the premises. Based on physical verification, interaction with occupants, and supporting indicators available at the site, the residential details furnished by the applicant are verified and consistent with the information provided.<br/><br/>
    {work_bullet}
    {co_work_bullet}
    <b>ITR:</b><br/><br/>
     {("The applicant has submitted Income Tax Return(s) / Form No. 16 for the Assessment year(s) <b>" + form16_ay_str + "</b> as proof of income, provided for our verification.") if form16_ay_list else "No Income Tax Returns or Form No. 16 were provided for our verification."}<br/><br/>
    <b>KYC:</b><br/><br/>
     {kyc_line}
    """
    story.append(Paragraph(p2_content, body_style))

    # ================= PAGE 3 =================
    story.append(PageBreak())
    add_firm_header(3)
    story.append(Paragraph("__________Annexure ‘A’__________<br/>Residence Verification", anx_title_style))
    story.append(Spacer(1, 4))

    # The PWA's dropdown stores a bilingual value, e.g. "Married (પરિણિત)" - the report's PDF
    # font has no Gujarati glyphs, so that suffix renders as solid black boxes. Strip it here.
    def _strip_regional_suffix(val):
        return re.sub(r"\s*\([^)]*\)\s*$", "", val).strip() if val else val

    from app.services.cpv_report_data import _age
    from datetime import date as _date_cls
    real_age = _age(real_dob, _date_cls.today())
    marital_val = _strip_regional_suffix(field_form.get("marital_status")) or NOT_CAPTURED
    community_val = field_form.get("community") or NOT_CAPTURED
    qual_val = field_form.get("qualification") or NOT_CAPTURED
    dob_age_gender_val = " / ".join(filter(None, [real_dob, real_age, real_gender])) or NOT_CAPTURED

    anxA_p3 = [
        [Paragraph("<b>Name of Applicant</b>", table_cell_bold), Paragraph(applicant_name, table_cell_style), Paragraph("<b>Contact Number</b>", table_cell_bold), Paragraph(applicant_phone, table_cell_style)],
        [Paragraph("<b>DOB / Age / Gender</b>", table_cell_bold), Paragraph(dob_age_gender_val, table_cell_style), Paragraph("<b>Marital Status</b>", table_cell_bold), Paragraph(marital_val, table_cell_style)],
        [Paragraph("<b>Community</b>", table_cell_bold), Paragraph(community_val, table_cell_style), Paragraph("<b>KYC PAN No.</b>", table_cell_bold), Paragraph(real_pan or NOT_CAPTURED, table_cell_style)],
        [Paragraph("<b>Aadhar Card No.</b>", table_cell_bold), Paragraph(real_aadhaar or NOT_CAPTURED, table_cell_style), Paragraph("<b>Qualification</b>", table_cell_bold), Paragraph(qual_val, table_cell_style)],
        [Paragraph("<b>Occupation</b>", table_cell_bold), Paragraph(occupation_val, table_cell_style), Paragraph("<b>Loan Facility</b>", table_cell_bold), Paragraph(f"{loan_type} ({loan_amount_str})", table_cell_style)],
    ]
    t_anxA_p3 = Table(anxA_p3, colWidths=[1.8 * inch, 2.0 * inch, 1.8 * inch, 1.9 * inch])
    t_anxA_p3.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F8FAFC")),
        ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#F8FAFC")),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(t_anxA_p3)
    story.append(Spacer(1, 8))

    if co_applicant_name:
        real_age_co = _age(real_dob_co, _date_cls.today())
        dob_age_gender_val_co = " / ".join(filter(None, [real_dob_co, real_age_co, real_gender_co])) or NOT_CAPTURED
        anxA_p3_co = [
            [Paragraph("<b>Name of Co-Applicant</b>", table_cell_bold), Paragraph(co_applicant_name, table_cell_style), Paragraph("<b>Contact Number</b>", table_cell_bold), Paragraph(co_applicant_phone or NOT_CAPTURED, table_cell_style)],
            [Paragraph("<b>DOB / Age / Gender</b>", table_cell_bold), Paragraph(dob_age_gender_val_co, table_cell_style), Paragraph("<b>Marital Status</b>", table_cell_bold), Paragraph(_strip_regional_suffix(office_co.get("marital_status")) or NOT_CAPTURED, table_cell_style)],
            [Paragraph("<b>Community</b>", table_cell_bold), Paragraph(office_co.get("community") or NOT_CAPTURED, table_cell_style), Paragraph("<b>KYC PAN No.</b>", table_cell_bold), Paragraph(real_pan_co or NOT_CAPTURED, table_cell_style)],
            [Paragraph("<b>Aadhar Card No.</b>", table_cell_bold), Paragraph(real_aadhaar_co or NOT_CAPTURED, table_cell_style), Paragraph("<b>Qualification</b>", table_cell_bold), Paragraph(office_co.get("qualification") or NOT_CAPTURED, table_cell_style)],
            [Paragraph("<b>Occupation</b>", table_cell_bold), Paragraph(co_occupation_val, table_cell_style), Paragraph("<b>Relation to Applicant</b>", table_cell_bold), Paragraph(office_co.get("relation_to_applicant") or NOT_CAPTURED, table_cell_style)],
        ]
        t_anxA_p3_co = Table(anxA_p3_co, colWidths=[1.8 * inch, 2.0 * inch, 1.8 * inch, 1.9 * inch])
        t_anxA_p3_co.setStyle(TableStyle([
            ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F8FAFC")),
            ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#F8FAFC")),
            ("TOPPADDING", (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ]))
        story.append(t_anxA_p3_co)
        story.append(Spacer(1, 8))

    # Family background table
    story.append(Paragraph("<b>Family background:</b>", body_style))
    story.append(Spacer(1, 3))
    
    fam_grid = [
        [Paragraph("Name", table_hdr_style), Paragraph("Relation", table_hdr_style), Paragraph("Age", table_hdr_style), Paragraph("Earning", table_hdr_style)]
    ]
    from app.services.field_form_pdf_ingest import reconcile_family_members_for_applicant
    raw_fam = reconcile_family_members_for_applicant(
        field_form.get("family_members") if isinstance(field_form, dict) else None,
        applicant_name=applicant_name if applicant_name != NOT_CAPTURED else None,
        applicant_gender=real_gender,
        applicant_age=real_age,
    )
    if isinstance(raw_fam, list) and len(raw_fam) > 0:
        for m in raw_fam:
            if isinstance(m, dict):
                fam_grid.append([
                    Paragraph(str(m.get("name") or "-"), table_cell_style),
                    Paragraph(str(m.get("relation") or "-"), table_cell_style),
                    Paragraph(str(m.get("age") or "-"), table_cell_style),
                    Paragraph(str(m.get("earning") or "-"), table_cell_style),
                ])
    else:
        fam_grid.append([Paragraph(applicant_name, table_cell_style), Paragraph("Self", table_cell_style), Paragraph(NOT_CAPTURED, table_cell_style), Paragraph(NOT_CAPTURED, table_cell_style)])

    t_fam = Table(fam_grid, colWidths=[2.2 * inch, 2.0 * inch, 1.5 * inch, 1.8 * inch])
    t_fam.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1E40AF")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(t_fam)
    story.append(Spacer(1, 8))

    # Present Residence Premises table
    story.append(Paragraph("<b>Present Residence Premises:</b>", body_style))
    story.append(Spacer(1, 3))
    
    res_landmark = (field_form.get("landmark") if isinstance(field_form, dict) else None) or NOT_CAPTURED
    res_bldg = (field_form.get("building_type") if isinstance(field_form, dict) else None) or NOT_CAPTURED
    res_floor = (field_form.get("floor") if isinstance(field_form, dict) else None) or None
    if res_floor and res_bldg != NOT_CAPTURED and res_floor.lower() not in res_bldg.lower():
        res_bldg = f"{res_bldg}, {res_floor}"
    elif res_floor and res_bldg == NOT_CAPTURED:
        res_bldg = res_floor
    res_stay = (field_form.get("period_of_stay") if isinstance(field_form, dict) else None) or NOT_CAPTURED
    # The PWA's Owner Name field is filled as a single string in the form "(Name) Relation"
    # (e.g. "(Ranjanba Vaghela) Mother in law") - there is no separate relation input. This
    # used to show the residence Ownership status (Owned/Rented) in the Relation cell instead,
    # which isn't a relation at all; parse the real relation out of the owner_name string.
    res_owner_raw = (field_form.get("owner_name") if isinstance(field_form, dict) else None) or ""
    _owner_match = re.match(r"^\s*\(([^)]+)\)\s*(.*)$", res_owner_raw)
    if _owner_match:
        res_owner = _owner_match.group(1).strip() or NOT_CAPTURED
        res_rel = _owner_match.group(2).strip() or NOT_CAPTURED
    else:
        res_owner = res_owner_raw.strip() or NOT_CAPTURED
        res_rel = NOT_CAPTURED
    # When the applicant owns the property themselves, there's no natural way to type a
    # "(Self)" relation suffix in the Owner Name box - the owner name IS the applicant's own
    # name. Detect that match instead of leaving a confusing NA next to the applicant's own name.
    if res_owner != NOT_CAPTURED and res_rel == NOT_CAPTURED and applicant_name != NOT_CAPTURED and (_name_score(res_owner, applicant_name) or 0) >= 85:
        res_rel = "Self"
    res_met = (field_form.get("person_met") if isinstance(field_form, dict) else None) or NOT_CAPTURED
    # If the agent only typed a bare name (no "(Relation)" suffix) and that name matches someone
    # already on the Family Members list, show the relation already on file instead of leaving it
    # out just because it wasn't retyped here too - PDF has no separate relation cell for this
    # field, so append it the same way the suggested "Name (Relation)" format would have shown it.
    if res_met != NOT_CAPTURED and "(" not in res_met and isinstance(raw_fam, list):
        _met_fam_match = next(
            (m for m in raw_fam if isinstance(m, dict) and m.get("name") and (_name_score(res_met, m["name"]) or 0) >= 80),
            None,
        )
        if _met_fam_match and _met_fam_match.get("relation"):
            res_met = f"{res_met} ({_met_fam_match['relation']})"

    neighbour_1 = field_form.get("neighbour_1") if isinstance(field_form, dict) else None
    neighbour_2 = field_form.get("neighbour_2") if isinstance(field_form, dict) else None
    neighbours_list = [n for n in [neighbour_1, neighbour_2] if n]
    neighbours_val = "<br/>".join(f"{i + 1}. {n}" for i, n in enumerate(neighbours_list)) or NOT_CAPTURED

    def _aadhaar_address_label(aadhaar_addr: Optional[str], verified_addr: str) -> str:
        # Never assert a match that was never actually checked - a CA-certified report must
        # state the true relationship between the two addresses, not a copy-pasted claim.
        if not aadhaar_addr:
            return NOT_CAPTURED
        if not verified_addr or verified_addr == NOT_CAPTURED:
            return aadhaar_addr
        norm = lambda s: set(re.sub(r"[^a-z0-9 ]", " ", s.lower()).split())
        a_tokens, v_tokens = norm(aadhaar_addr), norm(verified_addr)
        a_pin = re.search(r"\b\d{6}\b", aadhaar_addr)
        v_pin = re.search(r"\b\d{6}\b", verified_addr)
        same_pin = bool(a_pin and v_pin and a_pin.group() == v_pin.group())
        overlap = len(a_tokens & v_tokens) / max(1, min(len(a_tokens), len(v_tokens)))
        if same_pin and overlap >= 0.4:
            return "As Above (Matches with Verified Address)"
        return f"{aadhaar_addr} (Differs from the Verified Address above - applicant's Aadhaar-registered address)"

    aadhaar_addr_val = _aadhaar_address_label(real_aadhaar_address, target_address)

    prem_grid = [
        [Paragraph("<b>Verified Address Situated At</b>", table_cell_bold), Paragraph(target_address, table_cell_style)],
        [Paragraph("<b>Address as per Aadhar card</b>", table_cell_bold), Paragraph(aadhaar_addr_val, table_cell_style)],
        [Paragraph("<b>Landmark</b>", table_cell_bold), Paragraph(res_landmark, table_cell_style)],
        [Paragraph("<b>References (Neighbours)</b>", table_cell_bold), Paragraph(neighbours_val, table_cell_style)],
        [Paragraph("<b>Type of Building & Floor</b>", table_cell_bold), Paragraph(res_bldg, table_cell_style)],
    ]
    t_prem = Table(prem_grid, colWidths=[2.2 * inch, 5.3 * inch])
    t_prem.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F8FAFC")),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(t_prem)

    # ================= PAGE 4 =================
    story.append(PageBreak())
    add_firm_header(4)
    story.append(Paragraph("Annexure ‘A’ (Continued) — Residence Verification Details", anx_title_style))
    story.append(Spacer(1, 4))

    # This whole block used to hardcode "Owned" / "Yes (Verified at entrance)" / "Fully
    # Residential" / "Good" / "Developed Residential Locality" / a generic assets list / "Yes
    # (Enclosed with verification dossier)" literally - identical fabricated text printed for
    # EVERY case regardless of what was actually observed on site. Name board Visibility, Nature
    # of Building, General Appearance, Locality, Surroundings, and Evidence supporting proof are
    # now real fields in the PWA field-visit form (added per CA office request so every field in
    # this report has an actual capture source and nothing has to fall back to NA).
    res_locality = (field_form.get("locality") if isinstance(field_form, dict) else None) or ""
    res_surroundings = (field_form.get("surroundings") if isinstance(field_form, dict) else None) or ""
    res_locality_surroundings = ", ".join(p for p in (res_locality, res_surroundings) if p) or NOT_CAPTURED
    p4_grid = [
        [Paragraph("<b>Period of stay in present premises</b>", table_cell_bold), Paragraph(res_stay, table_cell_style)],
        [Paragraph("<b>Residence is</b>", table_cell_bold), Paragraph(ownership, table_cell_style)],
        [Paragraph("<b>Owner Name</b>", table_cell_bold), Paragraph(res_owner, table_cell_style)],
        [Paragraph("<b>Relation with Applicant</b>", table_cell_bold), Paragraph(res_rel, table_cell_style)],
        [Paragraph("<b>Name board Visibility</b>", table_cell_bold), Paragraph((field_form.get("nameboard_visible") if isinstance(field_form, dict) else None) or NOT_CAPTURED, table_cell_style)],
        [Paragraph("<b>Nature of Building</b>", table_cell_bold), Paragraph((field_form.get("building_nature") if isinstance(field_form, dict) else None) or NOT_CAPTURED, table_cell_style)],
        [Paragraph("<b>General Appearance of Property</b>", table_cell_bold), Paragraph((field_form.get("general_appearance") if isinstance(field_form, dict) else None) or NOT_CAPTURED, table_cell_style)],
        [Paragraph("<b>Locality & Surroundings</b>", table_cell_bold), Paragraph(res_locality_surroundings, table_cell_style)],
        [Paragraph("<b>Assets Visible</b>", table_cell_bold), Paragraph((field_form.get("assets_observed") if isinstance(field_form, dict) else None) or NOT_CAPTURED, table_cell_style)],
        [Paragraph("<b>Evidence supporting proof obtained</b>", table_cell_bold), Paragraph((field_form.get("residence_evidence_obtained") if isinstance(field_form, dict) else None) or NOT_CAPTURED, table_cell_style)],
        [Paragraph("<b>Overall Assessment</b>", table_cell_bold), Paragraph("<font color='#059669'><b>POSITIVE</b></font>", table_cell_style)],
        [Paragraph("<b>Person Met at Site</b>", table_cell_bold), Paragraph(res_met, table_cell_style)],
    ]
    t_p4 = Table(p4_grid, colWidths=[2.5 * inch, 5.0 * inch])
    t_p4.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F8FAFC")),
        ("TOPPADDING", (0, 0), (-1, -1), 3.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5),
    ]))
    story.append(t_p4)

    # Annexure A (Co-Applicant) - only printed when the CA office has flagged the co-applicant
    # as living at a separate address from the primary applicant (co_applicant_address set).
    # Most dual-applicant cases share one home and never generate this page - the primary
    # applicant's Annexure A above already covers a shared residence for both.
    if co_applicant_name and co_applicant_address:
        story.append(PageBreak())
        add_firm_header("4A")
        story.append(Paragraph("__________Annexure ‘A’ (Co-Applicant)__________<br/>Residence Verification", anx_title_style))
        story.append(Spacer(1, 4))

        res_co_landmark = residence_co.get("landmark") or NOT_CAPTURED
        res_co_bldg = residence_co.get("building_type") or NOT_CAPTURED
        res_co_stay = residence_co.get("period_of_stay") or NOT_CAPTURED
        res_co_owner_raw = residence_co.get("owner_name") or ""
        _owner_match_co = re.match(r"^\s*\(([^)]+)\)\s*(.*)$", res_co_owner_raw)
        if _owner_match_co:
            res_co_owner = _owner_match_co.group(1).strip() or NOT_CAPTURED
            res_co_rel = _owner_match_co.group(2).strip() or NOT_CAPTURED
        else:
            res_co_owner = res_co_owner_raw.strip() or NOT_CAPTURED
            res_co_rel = NOT_CAPTURED
        res_co_met = residence_co.get("person_met") or NOT_CAPTURED
        co_neighbours_list = [n for n in [residence_co.get("neighbour_1"), residence_co.get("neighbour_2")] if n]
        co_neighbours_val = "<br/>".join(f"{i + 1}. {n}" for i, n in enumerate(co_neighbours_list)) or NOT_CAPTURED

        anxA_co_grid = [
            [Paragraph("<b>Name of Co-Applicant</b>", table_cell_bold), Paragraph(co_applicant_name, table_cell_style), Paragraph("<b>Contact Number</b>", table_cell_bold), Paragraph(co_applicant_phone or NOT_CAPTURED, table_cell_style)],
            [Paragraph("<b>Aadhar Card No.</b>", table_cell_bold), Paragraph(real_aadhaar_co or NOT_CAPTURED, table_cell_style), Paragraph("<b>KYC PAN No.</b>", table_cell_bold), Paragraph(real_pan_co or NOT_CAPTURED, table_cell_style)],
            [Paragraph("<b>Verified Address Situated At</b>", table_cell_bold), Paragraph(co_applicant_address, table_cell_style), Paragraph("<b>Landmark</b>", table_cell_bold), Paragraph(res_co_landmark, table_cell_style)],
            [Paragraph("<b>Type of Building & Floor</b>", table_cell_bold), Paragraph(res_co_bldg, table_cell_style), Paragraph("<b>Period of Stay</b>", table_cell_bold), Paragraph(res_co_stay, table_cell_style)],
            [Paragraph("<b>Owner Name</b>", table_cell_bold), Paragraph(res_co_owner, table_cell_style), Paragraph("<b>Relation with Co-Applicant</b>", table_cell_bold), Paragraph(res_co_rel, table_cell_style)],
            [Paragraph("<b>References (Neighbours)</b>", table_cell_bold), Paragraph(co_neighbours_val, table_cell_style), Paragraph("<b>Person Met at Site</b>", table_cell_bold), Paragraph(res_co_met, table_cell_style)],
            [Paragraph("<b>Overall Assessment</b>", table_cell_bold), Paragraph("<font color='#059669'><b>POSITIVE</b></font>", table_cell_style), Paragraph("", table_cell_style), Paragraph("", table_cell_style)],
        ]
        t_anxA_co = Table(anxA_co_grid, colWidths=[1.8 * inch, 2.0 * inch, 1.8 * inch, 1.9 * inch])
        t_anxA_co.setStyle(TableStyle([
            ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F8FAFC")),
            ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#F8FAFC")),
            ("TOPPADDING", (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ]))
        story.append(t_anxA_co)

    # ================= PAGE 5 =================
    story.append(PageBreak())
    add_firm_header(5)
    
    is_working = isinstance(field_form, dict) and field_form.get("occupation") not in ("Housewife", "House Wife", None)
    is_business = str(field_form.get("occupation") or "").strip().lower() == "business"
    if is_working:
        anx_b_title = "Office Verification (Business Premises)" if is_business else "Office Verification (Salaried / Employer Premises)"
        story.append(Paragraph(f"__________Annexure ‘B’__________<br/>{anx_b_title}", anx_title_style))
        story.append(Spacer(1, 4))
        # Two named references, same pattern as the residence neighbours - back-compat with the
        # older single "reference" field for cases saved before this was split in two.
        office_refs_list = [r for r in [office.get("reference_1") or office.get("reference"), office.get("reference_2")] if r]
        office_refs_val = "<br/>".join(f"{i + 1}. {r}" for i, r in enumerate(office_refs_list)) or NOT_CAPTURED
        office_assessment = office.get("assessment") or None
        assessment_html = f"<font color='#059669'><b>{office_assessment}</b></font>" if office_assessment else "<font color='#059669'><b>POSITIVE</b></font>"
        p5_grid = [
            [Paragraph("<b>Firm Name</b>", table_cell_bold), Paragraph(firm_name or NOT_CAPTURED, table_cell_style)],
            [Paragraph("<b>Premises Address</b>", table_cell_bold), Paragraph(office_addr or NOT_CAPTURED, table_cell_style)],
            [Paragraph("<b>Landmark</b>", table_cell_bold), Paragraph(office.get("landmark") or NOT_CAPTURED, table_cell_style)],
            [Paragraph("<b>Firm Type</b>", table_cell_bold), Paragraph(office.get("firm_type") or NOT_CAPTURED, table_cell_style)],
            [Paragraph("<b>Premises Ownership</b>", table_cell_bold), Paragraph(office.get("premises_ownership") or NOT_CAPTURED, table_cell_style)],
            [Paragraph("<b>Premises Owner Name</b>", table_cell_bold), Paragraph(office_premises_owner, table_cell_style)],
            [Paragraph("<b>Established since</b>", table_cell_bold), Paragraph(office.get("established_since") or NOT_CAPTURED, table_cell_style)],
            [Paragraph("<b>Location</b>", table_cell_bold), Paragraph(office.get("location") or NOT_CAPTURED, table_cell_style)],
            [Paragraph("<b>Name board Visibility</b>", table_cell_bold), Paragraph(office.get("nameboard") or NOT_CAPTURED, table_cell_style)],
            [Paragraph("<b>Infrastructure of premises</b>", table_cell_bold), Paragraph(office.get("infrastructure") or NOT_CAPTURED, table_cell_style)],
            [Paragraph("<b>Number of Workers</b>", table_cell_bold), Paragraph(office.get("employees") or NOT_CAPTURED, table_cell_style)],
            [Paragraph("<b>Reg No. / Emp No.</b>", table_cell_bold), Paragraph(office.get("reg_no") or NOT_CAPTURED, table_cell_style)],
            [Paragraph("<b>Line of Business / Position at Work</b>", table_cell_bold), Paragraph(position or NOT_CAPTURED, table_cell_style)],
            [Paragraph("<b>Assets Visible</b>", table_cell_bold), Paragraph(office.get("assets") or NOT_CAPTURED, table_cell_style)],
            [Paragraph("<b>Reference</b>", table_cell_bold), Paragraph(office_refs_val, table_cell_style)],
            [Paragraph("<b>Overall Assessment</b>", table_cell_bold), Paragraph(assessment_html, table_cell_style)],
            [Paragraph("<b>Who meet?</b>", table_cell_bold), Paragraph(office.get("who_meet") or NOT_CAPTURED, table_cell_style)],
        ]
    else:
        story.append(Paragraph("__________Annexure ‘B’__________<br/>Office Verification (Housewife)", anx_title_style))
        story.append(Spacer(1, 4))
        b_rows = [
            "Firm Name", "Premises Address", "Landmark", "Firm Type", "Premises Ownership",
            "Premises Owner Name", "Established since", "Location", "Name board Visibility",
            "Infrastructure of premises", "Reg No. / Emp No.", "Line of business / Position at Work",
            "Assets Visible", "Reference", "Overall Assessment", "Who meet?"
        ]
        p5_grid = [
            [Paragraph(f"<b>{r}</b>", table_cell_bold), Paragraph("Not Applicable (Applicant is a Housewife / Co-Applicant)", table_cell_style)]
            for r in b_rows
        ]

    t_p5 = Table(p5_grid, colWidths=[2.5 * inch, 5.0 * inch])
    t_p5.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F8FAFC")),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(t_p5)

    if co_applicant_name:
        story.append(PageBreak())
        add_firm_header("5A")
        if is_co_working:
            co_is_business = str(office_co.get("occupation") or "").strip().lower() == "business"
            co_anx_b_title = "Office Verification (Business Premises)" if co_is_business else "Office Verification (Salaried / Employer Premises)"
            story.append(Paragraph(f"__________Annexure ‘B’ (Co-Applicant)__________<br/>{co_anx_b_title}", anx_title_style))
            story.append(Spacer(1, 4))
            co_office_refs_list = [r for r in [office_co.get("reference_1") or office_co.get("reference"), office_co.get("reference_2")] if r]
            co_office_refs_val = "<br/>".join(f"{i + 1}. {r}" for i, r in enumerate(co_office_refs_list)) or NOT_CAPTURED
            co_office_assessment = office_co.get("assessment") or None
            co_assessment_html = f"<font color='#059669'><b>{co_office_assessment}</b></font>" if co_office_assessment else "<font color='#059669'><b>POSITIVE</b></font>"
            p5_grid_co = [
                [Paragraph("<b>Firm Name</b>", table_cell_bold), Paragraph(co_firm_name or NOT_CAPTURED, table_cell_style)],
                [Paragraph("<b>Premises Address</b>", table_cell_bold), Paragraph(co_office_addr or NOT_CAPTURED, table_cell_style)],
                [Paragraph("<b>Landmark</b>", table_cell_bold), Paragraph(office_co.get("landmark") or NOT_CAPTURED, table_cell_style)],
                [Paragraph("<b>Firm Type</b>", table_cell_bold), Paragraph(office_co.get("firm_type") or NOT_CAPTURED, table_cell_style)],
                [Paragraph("<b>Premises Ownership</b>", table_cell_bold), Paragraph(office_co.get("premises_ownership") or NOT_CAPTURED, table_cell_style)],
                [Paragraph("<b>Premises Owner Name</b>", table_cell_bold), Paragraph(office_co_premises_owner, table_cell_style)],
                [Paragraph("<b>Established since</b>", table_cell_bold), Paragraph(office_co.get("established_since") or NOT_CAPTURED, table_cell_style)],
                [Paragraph("<b>Location</b>", table_cell_bold), Paragraph(office_co.get("location") or NOT_CAPTURED, table_cell_style)],
                [Paragraph("<b>Name board Visibility</b>", table_cell_bold), Paragraph(office_co.get("nameboard") or NOT_CAPTURED, table_cell_style)],
                [Paragraph("<b>Infrastructure of premises</b>", table_cell_bold), Paragraph(office_co.get("infrastructure") or NOT_CAPTURED, table_cell_style)],
                [Paragraph("<b>Number of Workers</b>", table_cell_bold), Paragraph(office_co.get("employees") or NOT_CAPTURED, table_cell_style)],
                [Paragraph("<b>Reg No. / Emp No.</b>", table_cell_bold), Paragraph(office_co.get("reg_no") or NOT_CAPTURED, table_cell_style)],
                [Paragraph("<b>Line of Business / Position at Work</b>", table_cell_bold), Paragraph(co_position or NOT_CAPTURED, table_cell_style)],
                [Paragraph("<b>Assets Visible</b>", table_cell_bold), Paragraph(office_co.get("assets") or NOT_CAPTURED, table_cell_style)],
                [Paragraph("<b>Reference</b>", table_cell_bold), Paragraph(co_office_refs_val, table_cell_style)],
                [Paragraph("<b>Overall Assessment</b>", table_cell_bold), Paragraph(co_assessment_html, table_cell_style)],
                [Paragraph("<b>Who meet?</b>", table_cell_bold), Paragraph(office_co.get("who_meet") or NOT_CAPTURED, table_cell_style)],
            ]
        else:
            story.append(Paragraph("__________Annexure ‘B’ (Co-Applicant)__________<br/>Office Verification (Housewife)", anx_title_style))
            story.append(Spacer(1, 4))
            b_rows_co = [
                "Firm Name", "Premises Address", "Landmark", "Firm Type", "Premises Ownership",
                "Premises Owner Name", "Established since", "Location", "Name board Visibility",
                "Infrastructure of premises", "Number of Workers", "Reg No. / Emp No.",
                "Line of business / Position at Work", "Assets Visible", "Reference",
                "Overall Assessment", "Who meet?"
            ]
            p5_grid_co = [
                [Paragraph(f"<b>{r}</b>", table_cell_bold), Paragraph("Not Applicable (Co-Applicant is a Housewife)", table_cell_style)]
                for r in b_rows_co
            ]
        t_p5_co = Table(p5_grid_co, colWidths=[2.5 * inch, 5.0 * inch])
        t_p5_co.setStyle(TableStyle([
            ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F8FAFC")),
            ("TOPPADDING", (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ]))
        story.append(t_p5_co)

    # ================= PAGE 6 =================
    story.append(PageBreak())
    add_firm_header(6)
    story.append(Paragraph("__________Annexure ‘C’__________<br/>INCOME TAX RETURN Verification", anx_title_style))
    story.append(Spacer(1, 2))
    story.append(Paragraph(f"Applicant: <b>{applicant_name}</b>", body_style))
    story.append(Spacer(1, 3))

    # Manually-entered fallback (CA office knows it but it wasn't scanned) - only used for a
    # row the OCR itself didn't supply an ack no / filing date for.
    manual_itr_ack_no = field_form.get("itr_acknowledgement_no") or None
    manual_itr_filing_date = field_form.get("itr_filing_date") or None
    if form16_ay_list:
        itr_grid = [[Paragraph("A.Y.", table_hdr_style), Paragraph("Acknowledgement No", table_hdr_style), Paragraph("Date of Filing", table_hdr_style), Paragraph("Total Income / Status", table_hdr_style)]]
        for ay in form16_ay_list:
            row = form16_rows[ay]
            income = row["income"]
            ack_no = row["ack_no"] or manual_itr_ack_no or "Verified (Computation on Record)"
            filed_on = row["filed_on"] or manual_itr_filing_date or "Verified"
            status = f"Rs. {income} (Income Tax Return / Computation of Income Verified)" if income else "Income Tax Return provided (total income not on record)"
            itr_grid.append([Paragraph(ay, table_cell_style), Paragraph(ack_no, table_cell_style), Paragraph(filed_on, table_cell_style), Paragraph(status, table_cell_style)])
    elif manual_itr_ack_no or manual_itr_filing_date:
        # No Form 16 / ITR Acknowledgement / Computation of Income document was scanned for
        # this case, but the field agent recorded an acknowledgement no. / filing date on-site
        # (e.g. the applicant showed the e-filing portal/SMS rather than a printed copy) - that
        # verification must still appear here, not get silently overwritten by "no record".
        itr_grid = [
            [Paragraph("A.Y.", table_hdr_style), Paragraph("Acknowledgement No", table_hdr_style), Paragraph("Date of Filing", table_hdr_style), Paragraph("Total Income / Status", table_hdr_style)],
            [Paragraph(NOT_CAPTURED, table_cell_style), Paragraph(manual_itr_ack_no or NOT_CAPTURED, table_cell_style), Paragraph(manual_itr_filing_date or NOT_CAPTURED, table_cell_style), Paragraph("Income Tax Return filed - acknowledgement recorded on-site by the field agent (supporting document not scanned)", table_cell_style)],
        ]
    else:
        itr_grid = [
            [Paragraph("A.Y.", table_hdr_style), Paragraph("Acknowledgement No", table_hdr_style), Paragraph("Date of Filing", table_hdr_style), Paragraph("Total Income / Status", table_hdr_style)],
            [Paragraph(NOT_CAPTURED, table_cell_style), Paragraph(NOT_CAPTURED, table_cell_style), Paragraph(NOT_CAPTURED, table_cell_style), Paragraph("No Form No. 16 / ITR Acknowledgement / Computation of Income on record", table_cell_style)],
        ]
    t_itr = Table(itr_grid, colWidths=[1.5 * inch, 2.0 * inch, 1.8 * inch, 2.2 * inch])
    t_itr.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1E40AF")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(t_itr)
    story.append(Spacer(1, 12))

    if co_applicant_name:
        story.append(Paragraph(f"Co-Applicant: <b>{co_applicant_name}</b>", body_style))
        story.append(Spacer(1, 3))
        co_form16_ay_list = sorted(form16_rows_co.keys(), reverse=True)
        if co_form16_ay_list:
            itr_grid_co = [[Paragraph("A.Y.", table_hdr_style), Paragraph("Acknowledgement No", table_hdr_style), Paragraph("Date of Filing", table_hdr_style), Paragraph("Total Income / Status", table_hdr_style)]]
            for ay in co_form16_ay_list:
                row = form16_rows_co[ay]
                income = row["income"]
                status = f"Rs. {income}" if income else "Income Tax Return provided (total income not on record)"
                itr_grid_co.append([Paragraph(ay, table_cell_style), Paragraph(row["ack_no"] or NOT_CAPTURED, table_cell_style), Paragraph(row["filed_on"] or NOT_CAPTURED, table_cell_style), Paragraph(status, table_cell_style)])
        else:
            itr_grid_co = [
                [Paragraph("A.Y.", table_hdr_style), Paragraph("Acknowledgement No", table_hdr_style), Paragraph("Date of Filing", table_hdr_style), Paragraph("Total Income / Status", table_hdr_style)],
                [Paragraph(NOT_CAPTURED, table_cell_style), Paragraph(NOT_CAPTURED, table_cell_style), Paragraph(NOT_CAPTURED, table_cell_style), Paragraph("No Form No. 16 / ITR Acknowledgement / Computation of Income on record", table_cell_style)],
            ]
        t_itr_co = Table(itr_grid_co, colWidths=[1.5 * inch, 2.0 * inch, 1.8 * inch, 2.2 * inch])
        t_itr_co.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1E40AF")),
            ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ("TOPPADDING", (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ]))
        story.append(t_itr_co)
        story.append(Spacer(1, 12))

    # Annexure D verifies the APPLICANT'S OWN bank account (income/financial-standing evidence),
    # not which bank is granting the loan - those are very often different banks, and "Type of
    # Facility" below already states the loan itself. Per explicit CA office instruction: use the
    # bank name/branch actually printed on a scanned bank statement when one exists; otherwise
    # this row must say NA like the rest of the section, never silently fall back to the loan's
    # own bank_name/branch as a stand-in for a verification that was never actually done.
    def _verified_bank_fields(co_applicant: bool = False):
        # Bank statements are frequently filed under a business/firm name (e.g. a
        # proprietorship's own account) rather than the applicant's personal name, which the
        # AI's per-document relationship classifier doesn't know to treat as the applicant's own
        # - it tags such statements DIFFERENT_PERSON even when they are genuinely the
        # applicant's (confirmed live: a scanned bank statement with full account details was
        # hidden behind NA this way). reconcile_case_documents() (the DOCX path) never filtered
        # bank statements by relationship_to_applicant for exactly this reason - match that here:
        # prefer an explicitly SELF/untagged statement, but fall back to a DIFFERENT_PERSON-
        # tagged one rather than hide real on-file data. The co-applicant's own row still
        # requires an explicit DIFFERENT_PERSON tag, so the applicant's own statement is never
        # double-counted under the co-applicant.
        bank_docs = []
        secondary_bank_docs = []
        for d in document_items:
            od = d.get("ocr_data") or {}
            real_doc_type = od.get("llm_doc_type") or od.get("doc_type") or d.get("doc_type")
            if real_doc_type == "BANK_STATEMENT":
                bank_docs.append(od)
            elif real_doc_type in ("COMPUTATION_OF_INCOME", "ITR_ACKNOWLEDGEMENT", "SALARY_SLIP") and (od.get("account_number") or od.get("bank_name")):
                if _belongs_to(od.get("relationship_to_applicant"), co_applicant):
                    secondary_bank_docs.append(od)
        if co_applicant:
            bank_docs = [od for od in bank_docs if od.get("relationship_to_applicant") == "DIFFERENT_PERSON"]
        else:
            bank_docs.sort(key=lambda od: 0 if od.get("relationship_to_applicant") in (None, "SELF") else 1)
        all_bank_docs = bank_docs + secondary_bank_docs
        name = next((od["bank_name"] for od in all_bank_docs if od.get("bank_name")), None)
        ifsc = next((od["ifsc_code"] for od in all_bank_docs if od.get("ifsc_code")), None)
        account_no = next((od["account_number"] for od in all_bank_docs if od.get("account_number")), None)
        branch_addr = next(((od.get("extracted_address") or od.get("address")) for od in bank_docs if od.get("address_type") == "BRANCH" and (od.get("extracted_address") or od.get("address"))), None)
        branch_val = branch_addr or (f"IFSC {ifsc}" if ifsc else None)
        parts = [p for p in (name, branch_val) if p]
        name_branch = ", ".join(parts) if parts else NOT_CAPTURED
        return name_branch, (account_no or NOT_CAPTURED)

    verified_bank_name_branch, verified_account_no = _verified_bank_fields(co_applicant=False)

    story.append(Paragraph("__________Annexure ‘D’__________<br/>Bank Verification", anx_title_style))
    story.append(Spacer(1, 3))
    bank_facility_val = (
        field_form.get("bank_account_type")
        or ("Savings / Operative Account" if (verified_account_no != NOT_CAPTURED or verified_bank_name_branch != NOT_CAPTURED) else NOT_CAPTURED)
    )
    bank_grid = [
        [Paragraph("<b>Bank Name & Branch</b>", table_cell_bold), Paragraph(verified_bank_name_branch, table_cell_style)],
        [Paragraph("<b>A/C Number</b>", table_cell_bold), Paragraph(verified_account_no, table_cell_style)],
        [Paragraph("<b>A/C Holder Name</b>", table_cell_bold), Paragraph(applicant_name, table_cell_style)],
        [Paragraph("<b>Account Status</b>", table_cell_bold), Paragraph(field_form.get("bank_account_status") or NOT_CAPTURED, table_cell_style)],
        [Paragraph("<b>Type of Facility</b>", table_cell_bold), Paragraph(bank_facility_val, table_cell_style)],
    ]
    t_bank = Table(bank_grid, colWidths=[2.5 * inch, 5.0 * inch])
    t_bank.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F8FAFC")),
        ("TOPPADDING", (0, 0), (-1, -1), 3.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5),
    ]))
    story.append(t_bank)

    if co_applicant_name:
        story.append(Spacer(1, 8))
        # The co-applicant's OWN bank statement, when one was scanned for them specifically -
        # never assumed to be the same bank as the applicant's row above just because it's one
        # joint loan; two people on a loan very often bank separately.
        verified_bank_name_branch_co, verified_account_no_co = _verified_bank_fields(co_applicant=True)
        bank_grid_co = [
            [Paragraph("<b>Bank Name & Branch</b>", table_cell_bold), Paragraph(verified_bank_name_branch_co, table_cell_style)],
            [Paragraph("<b>A/C Number</b>", table_cell_bold), Paragraph(verified_account_no_co, table_cell_style)],
            [Paragraph("<b>A/C Holder Name</b>", table_cell_bold), Paragraph(co_applicant_name, table_cell_style)],
            [Paragraph("<b>Account Status</b>", table_cell_bold), Paragraph(field_form.get("bank_account_status_co") or NOT_CAPTURED, table_cell_style)],
            [Paragraph("<b>Type of Facility</b>", table_cell_bold), Paragraph(NOT_CAPTURED, table_cell_style)],
        ]
        t_bank_co = Table(bank_grid_co, colWidths=[2.5 * inch, 5.0 * inch])
        t_bank_co.setStyle(TableStyle([
            ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F8FAFC")),
            ("TOPPADDING", (0, 0), (-1, -1), 3.5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5),
        ]))
        story.append(t_bank_co)

    # ================= PAGE 7: PAN CARD VERIFICATION =================
    story.append(PageBreak())
    add_firm_header(7)
    story.append(Paragraph("Annexure ‘E’ (Part 1) — Pan card Verification Photographs:", anx_title_style))
    story.append(Spacer(1, 6))

    def _resolve_img(p: Optional[str]) -> Optional[str]:
        if not p:
            return None
        if os.path.exists(p):
            return p
        norm = str(p).replace("\\", "/").strip()
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

    # Candidate photo folders for disk fallback
    case_id_val = str(case_data.get("case_id") or case_data.get("case_uuid") or "")
    case_hex_val = str(case_data.get("case_hex") or case_id_val.replace("-", ""))
    cand_dirs = []
    if case_hex_val:
        cand_dirs.append(os.path.join("storage_uploads", f"case_{case_hex_val}"))
    if case_id_val:
        cand_dirs.append(os.path.join("storage_uploads", f"case_{case_id_val}"))
        cand_dirs.append(os.path.join("storage_uploads", case_id_val))
        cand_dirs.append(os.path.join("app", "static", "extracted_pages", case_id_val, "field_photos"))
    # NEVER add another case's folder here as a fallback - a bank-certified report must show
    # only this applicant's own evidence or honestly show nothing, never another real
    # applicant's photos picked up from an unrelated case's directory.

    field_photos_dir = None
    for cd in cand_dirs:
        if os.path.exists(cd) and os.listdir(cd):
            field_photos_dir = cd
            break

    # Sort document_items newest-first
    sorted_docs = []
    if document_items:
        def _doc_sort_key(d):
            if d.get("created_at_ts") is not None:
                try:
                    return float(d["created_at_ts"])
                except Exception:
                    pass
            dt = d.get("created_at")
            if isinstance(dt, datetime):
                return dt.timestamp()
            return 0.0
        sorted_docs = sorted(document_items, key=_doc_sort_key, reverse=True)

    # PAN Verification Report Image (Annexure E Part 1 must show the PAN Verification Report
    # printout when present, falling back to the physical PAN card only if no verification report exists)
    pan_img_path = None
    if sorted_docs:
        pan_cands = []
        for d in sorted_docs:
            dt = (d.get("doc_type") or "").upper()
            od = d.get("ocr_data") if isinstance(d.get("ocr_data"), dict) else {}
            real_dt = (od.get("llm_doc_type") or od.get("doc_type") or dt).upper()
            if dt in ("PAN_CARD", "PAN_VERIFICATION_REPORT") or real_dt in ("PAN_CARD", "PAN_VERIFICATION_REPORT"):
                cand = _resolve_img(d.get("watermarked_url") or d.get("storage_url"))
                if cand and is_valid_image(cand):
                    sub = (od.get("doc_sub_type") or "").upper()
                    meta = f"{od.get('document_title') or ''} {od.get('forensic_summary') or ''} {od.get('original_filename') or ''}".upper()
                    score = 0
                    if dt == "PAN_VERIFICATION_REPORT" or real_dt == "PAN_VERIFICATION_REPORT":
                        score += 100
                    if sub == "BACK":
                        score += 80
                    elif sub == "FRONT":
                        score -= 20
                    if any(k in meta for k in ("VERIF", "KNOW YOUR", "NSDL", "E-FILING", "EFILING", "PORTAL", "JAO", "JURISDICTION", "ACTIVE")):
                        score += 60
                    try:
                        from PIL import Image as _PilPan
                        with _PilPan.open(cand) as _im:
                            _w, _h = _im.size
                        if _h > _w * 1.05:
                            score += 35
                    except Exception:
                        pass
                    pan_cands.append((score, cand))
        if pan_cands:
            pan_cands.sort(key=lambda x: x[0], reverse=True)
            pan_img_path = pan_cands[0][1]

    if not pan_img_path and field_photos_dir:
        cand = os.path.join(field_photos_dir, "page_8_img_2.jpeg")
        if os.path.exists(cand):
            pan_img_path = cand
    # No generic/specimen image fallback here on purpose - a bank-certified report must never
    # show a stock photo as if it were this applicant's own PAN evidence. If nothing real was
    # scanned, the except branch below prints an honest text-only line instead.

    if pan_img_path and is_valid_image(pan_img_path):
        try:
            from PIL import Image as _PilPanFit
            with _PilPanFit.open(pan_img_path) as _im:
                _pw, _ph = _im.size
            _max_w, _max_h = 6.2 * inch, 6.8 * inch
            _scale = min(_max_w / max(1, _pw), _max_h / max(1, _ph))
            _img_flow = Image(pan_img_path, width=_pw * _scale, height=_ph * _scale)
            _img_flow.hAlign = "CENTER"
            story.append(_img_flow)
            story.append(Spacer(1, 4))
            story.append(Paragraph(f"<font size='7' color='#64748B'><b>Income Tax Department Know Your JAO / PAN Verification: Active status confirmed for {applicant_name}</b></font>", ParagraphStyle("PanCap", alignment=1)))
        except Exception:
            story.append(Paragraph(f"PAN Card Verification: {applicant_name} (Active)", body_style))
    else:
        story.append(Paragraph(f"PAN Card Verification: {NOT_CAPTURED} (no PAN card or NSDL/e-filing verification scanned for {applicant_name})", body_style))

    # ================= PAGE 8: RESIDENCE VISIT PHOTOGRAPHS =================
    story.append(PageBreak())
    add_firm_header(8)
    story.append(Paragraph("Annexure ‘E’ (Part 2) — Residence premises Visit photographs:", anx_title_style))
    story.append(Spacer(1, 3))

    # Residence visit photos resolution across slots 1 to 4
    slot_photos = {1: None, 2: None, 3: None, 4: None}

    # Co-applicant office photos (folder "co_work", doc_type CO_OFFICE_*) must never be treated
    # as the applicant's own work photos - "OFFICE" in dt would otherwise also match
    # "CO_OFFICE_FACADE" etc., which is exactly what let the co-applicant's office photos get
    # pulled into the applicant's own Annexure E gallery (and vice versa) whenever the
    # co-applicant's docs happened to sort earlier/match a slot first.
    def _is_co_work_doc(doc):
        if doc.get("folder") == "co_work" or (doc.get("ocr_data") or {}).get("folder") == "co_work":
            return True
        return str(doc.get("doc_type") or "").upper().startswith("CO_OFFICE")

    def _is_work_doc(doc):
        if _is_co_work_doc(doc):
            return False
        if doc.get("folder") == "work" or (doc.get("ocr_data") or {}).get("folder") == "work":
            return True
        dt = str(doc.get("doc_type") or "").upper()
        return any(w in dt for w in ["OFFICE", "WORK", "FACADE", "NAMEBOARD", "DESK"])

    # Co-applicant residence photos (folder "co_residence") reuse the applicant's own generic
    # residence doc types (PROPERTY_EXTERIOR/ELECTRICITY_METER/NEIGHBOR_VERIFICATION) - the
    # folder tag is the only signal, so without this exclusion they would land in the
    # applicant's own Annexure A gallery, the same class of bug co_work was fixed for above.
    def _is_co_residence_doc(doc):
        return doc.get("folder") == "co_residence" or (doc.get("ocr_data") or {}).get("folder") == "co_residence"

    residence_sorted_docs = [d for d in sorted_docs if not _is_work_doc(d) and not _is_co_work_doc(d) and not _is_co_residence_doc(d)]
    co_residence_sorted_docs = [d for d in sorted_docs if _is_co_residence_doc(d)]

    # A doc explicitly tagged slot_number > 4 is a genuine "Additional Photo" from the PWA's
    # unbounded extra-capture facility, not a candidate for one of the 4 mandatory slots.
    def _is_explicit_extra(doc):
        sn = doc.get("slot_number") or (doc.get("ocr_data") or {}).get("slot_number")
        try:
            return bool(sn) and int(sn) > 4
        except (TypeError, ValueError):
            return False

    # None = CA never touched the report-inclusion toggle for this doc (the overwhelming
    # majority of docs/cases) - True/False only once the CA has explicitly picked a selection
    # in the CA dashboard's "Report" checkboxes.
    def _include_flag(doc):
        ocr = doc.get("ocr_data") or {}
        if "include_in_report" in ocr:
            return bool(ocr.get("include_in_report"))
        return None

    def _apply_report_selection(candidate_docs, default_slots):
        """If the CA has explicitly curated which photos go in the report for this section
        (any doc here carries an explicit include_in_report flag), that selection wins outright
        - capped at 4, ordered by original slot number where available. Otherwise the existing
        slot-resolution result (Pass 1-4 below) is left untouched, so every case that has never
        touched the new per-photo "Report" checkboxes behaves exactly as it always has."""
        if not any(_include_flag(d) is not None for d in candidate_docs):
            return default_slots
        selected = [d for d in candidate_docs if _include_flag(d) is True]
        def _sel_key(d):
            sn = d.get("slot_number") or (d.get("ocr_data") or {}).get("slot_number")
            try:
                return int(sn)
            except (TypeError, ValueError):
                return 99
        selected.sort(key=_sel_key)
        selected = selected[:4]
        override = {1: None, 2: None, 3: None, 4: None}
        for i, d in enumerate(selected, start=1):
            p_path = _resolve_img(d.get("watermarked_url") or d.get("storage_url"))
            if p_path and os.path.exists(p_path):
                override[i] = p_path
        return override

    # Pass 1: explicit slot numbers (from newest residence docs)
    for d in residence_sorted_docs:
        s_num = d.get("slot_number") or (d.get("ocr_data") or {}).get("slot_number")
        if s_num:
            try:
                s_int = int(s_num)
                if 1 <= s_int <= 4 and slot_photos[s_int] is None:
                    p_path = _resolve_img(d.get("watermarked_url") or d.get("storage_url"))
                    if p_path and os.path.exists(p_path):
                        slot_photos[s_int] = p_path
            except (ValueError, TypeError):
                pass

    # Pass 2: map doc_type to slot
    type_to_slot = {
        "PROPERTY_EXTERIOR": 1,
        "PROPERTY_INTERIOR": 2,
        "ELECTRICITY_METER": 3,
        "SOCIETY_BOARD": 3,
        "NEIGHBOR_VERIFICATION": 4,
    }
    for d in residence_sorted_docs:
        if _is_explicit_extra(d):
            continue
        dtype = d.get("doc_type")
        target_slot = type_to_slot.get(dtype)
        if target_slot and slot_photos[target_slot] is None:
            p_path = _resolve_img(d.get("watermarked_url") or d.get("storage_url"))
            if p_path and os.path.exists(p_path):
                slot_photos[target_slot] = p_path

    # Pass 3: Fill empty slots from any remaining evidence docs
    for d in residence_sorted_docs:
        if _is_explicit_extra(d):
            continue
        dtype = d.get("doc_type")
        if dtype in ("PROPERTY_EXTERIOR", "PROPERTY_INTERIOR", "ELECTRICITY_METER", "SOCIETY_BOARD", "NEIGHBOR_VERIFICATION"):
            p_path = _resolve_img(d.get("watermarked_url") or d.get("storage_url"))
            if p_path and os.path.exists(p_path) and p_path not in slot_photos.values():
                for s in [1, 2, 3, 4]:
                    if slot_photos[s] is None:
                        slot_photos[s] = p_path
                        break

    # Pass 4: Check disk in case folder for wm_*.jpg or page_9_img_*
    if any(slot_photos[s] is None for s in [1, 2, 3, 4]) and field_photos_dir and os.path.exists(field_photos_dir):
        disk_files = [
            os.path.join(field_photos_dir, f) for f in sorted(
                os.listdir(field_photos_dir),
                key=lambda x: os.path.getmtime(os.path.join(field_photos_dir, x)),
                reverse=True
            )
            if (f.startswith("wm_") or f.startswith("page_9_img_")) and f.lower().endswith((".jpg", ".jpeg", ".png"))
        ]
        for df in disk_files:
            if df not in slot_photos.values():
                for s in [1, 2, 3, 4]:
                    if slot_photos[s] is None:
                        slot_photos[s] = df
                        break

    # No specimen/stock-photo fallback here on purpose - a bank-certified report must never show
    # generic stock photography as if it were this applicant's own site evidence. _make_cell()
    # below already handles a missing slot gracefully by printing just the caption, no image.
    slot_photos = _apply_report_selection(residence_sorted_docs, slot_photos)
    res_photos = [slot_photos[1], slot_photos[2], slot_photos[3], slot_photos[4]]

    v_caps = [
        "1. Property Exterior & Main Gate",
        "2. Living Room / Hall / Interior Assets",
        "3. Nameboard & Entrance Verification",
        "4. Street & Locality Infrastructure",
    ]

    p_height = 2.45 * inch

    # Captions below each photo, and the Field Staff Geo-Attendance selfie card that used to
    # print here, are both removed per explicit CA office instruction - only the photos
    # themselves are printed now.
    def _make_cell(idx):
        if idx < len(res_photos) and is_valid_image(res_photos[idx]):
            try:
                return [Image(res_photos[idx], width=3.3 * inch, height=p_height)]
            except Exception:
                pass
        return [Paragraph(v_caps[idx] if idx < len(v_caps) else f"Photo {idx+1}", table_cell_style)]

    photo_grid = [
        [_make_cell(0), _make_cell(1)],
        [_make_cell(2), _make_cell(3)],
    ]
    t_photos = Table(photo_grid, colWidths=[3.75 * inch, 3.75 * inch])
    t_photos.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(t_photos)

    # The Field Staff Geo-Attendance & Identity Verification selfie card that used to print
    # here is removed per explicit CA office instruction.

    # ================= PAGE 9: OFFICE PREMISES VISIT PHOTOGRAPHS (ONLY WHEN OFFICE PHOTOS EXIST) =================
    if is_working:
        office_sorted_docs = [d for d in sorted_docs if _is_work_doc(d)]
        off_slot_map = {1: None, 2: None, 3: None, 4: None}
        for d in office_sorted_docs:
            if _is_explicit_extra(d):
                continue
            s_num = d.get("slot_number") or (d.get("ocr_data") or {}).get("slot_number")
            if s_num:
                try:
                    s_int = int(s_num)
                    if 1 <= s_int <= 4 and off_slot_map[s_int] is None:
                        cand = _resolve_img(d.get("watermarked_url") or d.get("storage_url"))
                        if cand and os.path.exists(cand):
                            off_slot_map[s_int] = cand
                except (ValueError, TypeError):
                    pass

        off_type_to_slot = {
            "OFFICE_FACADE": 1,
            "OFFICE_NAMEBOARD": 2,
            "OFFICE_INTERIOR": 3,
            "OFFICE_SELFIE": 4,
            "WORK_FACADE": 1,
            "WORK_OFFICE": 2,
            "WORK_DESK": 3,
            "WORK_APPROACH": 4,
        }
        for d in office_sorted_docs:
            if _is_explicit_extra(d):
                continue
            dt = d.get("doc_type")
            t_slot = off_type_to_slot.get(dt)
            if t_slot and off_slot_map[t_slot] is None:
                cand = _resolve_img(d.get("watermarked_url") or d.get("storage_url"))
                if cand and os.path.exists(cand):
                    off_slot_map[t_slot] = cand

        off_photos = []
        for s in [1, 2, 3, 4]:
            if off_slot_map[s]:
                off_photos.append(off_slot_map[s])
        for d in office_sorted_docs:
            if _is_explicit_extra(d):
                continue
            cand = _resolve_img(d.get("watermarked_url") or d.get("storage_url"))
            if cand and os.path.exists(cand) and cand not in off_photos:
                off_photos.append(cand)

        # CA-curated report selection (dashboard "Report" checkboxes) overrides the slot
        # resolution above outright, when present - same rule as the residence gallery.
        off_slot_map = _apply_report_selection(office_sorted_docs, off_slot_map)
        off_photos = [off_slot_map[s] for s in [1, 2, 3, 4] if off_slot_map[s]]

        if not off_photos and field_photos_dir:
            off_photos = [
                os.path.join(field_photos_dir, f) for f in sorted(os.listdir(field_photos_dir))
                if f.startswith("page_10_img_") and f.endswith((".jpeg", ".jpg", ".png")) and os.path.getsize(os.path.join(field_photos_dir, f)) > 10000
            ]
        off_photos = [p for p in off_photos if is_valid_image(p)]

        # Per explicit CA office instruction: if office photos are not available, do NOT render
        # the Office Premises Visit Photographs page in the report at all.
        if off_photos:
            story.append(PageBreak())
            add_firm_header(9)
            story.append(Paragraph("Annexure ‘E’ (Part 3) — Business / Employer Premises visit photographs:", anx_title_style))
            story.append(Spacer(1, 4))

            def _make_off_cell(idx):
                if idx < len(off_photos) and is_valid_image(off_photos[idx]):
                    try:
                        return [Image(off_photos[idx], width=3.3 * inch, height=2.45 * inch)]
                    except Exception:
                        pass
                return [Paragraph("", table_cell_style)]

            off_grid = [
                [_make_off_cell(0), _make_off_cell(1)],
                [_make_off_cell(2), _make_off_cell(3)],
            ]
            t_off_photos = Table(off_grid, colWidths=[3.75 * inch, 3.75 * inch])
            t_off_photos.setStyle(TableStyle([
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 2),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]))
            story.append(t_off_photos)

    # ================= CO-APPLICANT OFFICE PREMISES VISIT PHOTOGRAPHS =================
    if co_applicant_name and is_co_working:
        co_office_docs = [d for d in sorted_docs if _is_co_work_doc(d)]
        co_off_slot_map = {1: None, 2: None, 3: None, 4: None}
        co_off_type_to_slot = {
            "CO_OFFICE_FACADE": 1,
            "CO_OFFICE_NAMEBOARD": 2,
            "CO_OFFICE_INTERIOR": 3,
            "CO_OFFICE_SELFIE": 4,
        }
        for d in co_office_docs:
            if _is_explicit_extra(d):
                continue
            s_num = d.get("slot_number") or (d.get("ocr_data") or {}).get("slot_number")
            if s_num:
                try:
                    s_int = int(s_num)
                    if 1 <= s_int <= 4 and co_off_slot_map[s_int] is None:
                        cand = _resolve_img(d.get("watermarked_url") or d.get("storage_url"))
                        if cand and os.path.exists(cand):
                            co_off_slot_map[s_int] = cand
                except (ValueError, TypeError):
                    pass
        for d in co_office_docs:
            if _is_explicit_extra(d):
                continue
            t_slot = co_off_type_to_slot.get(d.get("doc_type"))
            if t_slot and co_off_slot_map[t_slot] is None:
                cand = _resolve_img(d.get("watermarked_url") or d.get("storage_url"))
                if cand and os.path.exists(cand):
                    co_off_slot_map[t_slot] = cand

        co_off_slot_map = _apply_report_selection(co_office_docs, co_off_slot_map)
        co_off_photos = [co_off_slot_map[s] for s in [1, 2, 3, 4] if co_off_slot_map[s] and is_valid_image(co_off_slot_map[s])]

        if co_off_photos:
            story.append(PageBreak())
            add_firm_header("9A")
            story.append(Paragraph("Annexure ‘E’ (Part 4) — Co-Applicant Business / Employer Premises visit photographs:", anx_title_style))
            story.append(Spacer(1, 4))

            def _make_co_off_cell(idx):
                if idx < len(co_off_photos) and is_valid_image(co_off_photos[idx]):
                    try:
                        return [Image(co_off_photos[idx], width=3.3 * inch, height=2.45 * inch)]
                    except Exception:
                        pass
                return [Paragraph("", table_cell_style)]

            co_off_grid = [
                [_make_co_off_cell(0), _make_co_off_cell(1)],
                [_make_co_off_cell(2), _make_co_off_cell(3)],
            ]
            t_co_off_photos = Table(co_off_grid, colWidths=[3.75 * inch, 3.75 * inch])
            t_co_off_photos.setStyle(TableStyle([
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 2),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]))
            story.append(t_co_off_photos)

    # ================= CO-APPLICANT RESIDENCE PREMISES VISIT PHOTOGRAPHS =================
    # Only printed when the CA office flagged the co-applicant as living at a separate address -
    # otherwise their residence is the shared Annexure E (Part 2) gallery above.
    if co_applicant_name and co_applicant_address:
        story.append(PageBreak())
        add_firm_header("9B")
        story.append(Paragraph("Annexure ‘E’ (Part 2A) — Co-Applicant Residence premises Visit photographs:", anx_title_style))
        story.append(Spacer(1, 4))

        co_res_slot_map = {1: None, 2: None, 3: None, 4: None}
        co_res_type_to_slot = {
            "PROPERTY_EXTERIOR": 1,
            "PROPERTY_INTERIOR": 2,
            "ELECTRICITY_METER": 3,
            "SOCIETY_BOARD": 3,
            "NEIGHBOR_VERIFICATION": 4,
        }
        # Pass 1: explicit slot numbers (the PWA always tags co-residence captures this way)
        for d in co_residence_sorted_docs:
            s_num = d.get("slot_number") or (d.get("ocr_data") or {}).get("slot_number")
            if s_num:
                try:
                    s_int = int(s_num)
                    if 1 <= s_int <= 4 and co_res_slot_map[s_int] is None:
                        p_path = _resolve_img(d.get("watermarked_url") or d.get("storage_url"))
                        if p_path and os.path.exists(p_path):
                            co_res_slot_map[s_int] = p_path
                except (ValueError, TypeError):
                    pass
        # Pass 2: doc_type fallback for any doc missing an explicit slot number
        for d in co_residence_sorted_docs:
            if _is_explicit_extra(d):
                continue
            target_slot = co_res_type_to_slot.get(d.get("doc_type"))
            if target_slot and co_res_slot_map[target_slot] is None:
                p_path = _resolve_img(d.get("watermarked_url") or d.get("storage_url"))
                if p_path and os.path.exists(p_path):
                    co_res_slot_map[target_slot] = p_path

        co_res_slot_map = _apply_report_selection(co_residence_sorted_docs, co_res_slot_map)
        co_res_photos = [co_res_slot_map[s] for s in [1, 2, 3, 4]]
        co_res_caps = [
            "1. Co-Applicant Building / Society Gate",
            "2. Co-Applicant House Door & Name Plate",
            "3. Co-Applicant Living Room & Electric Meter",
            "4. Co-Applicant Person Met at Site",
        ]

        def _make_co_res_cell(idx):
            if idx < len(co_res_photos) and is_valid_image(co_res_photos[idx]):
                try:
                    return [Image(co_res_photos[idx], width=3.3 * inch, height=2.45 * inch)]
                except Exception:
                    pass
            return [Paragraph(co_res_caps[idx] if idx < len(co_res_caps) else f"Residence Photo {idx+1}", table_cell_style)]

        co_res_grid = [
            [_make_co_res_cell(0), _make_co_res_cell(1)],
            [_make_co_res_cell(2), _make_co_res_cell(3)],
        ]
        t_co_res_photos = Table(co_res_grid, colWidths=[3.75 * inch, 3.75 * inch])
        t_co_res_photos.setStyle(TableStyle([
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 2),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]))
        story.append(t_co_res_photos)

    # ================= ADDITIONAL APPLICANTS (SLOTS 3-5) =================
    # Per bank rule, applicants 3-5 require only a home visit (no office) - printed as a
    # compact additive section so it never disturbs the single/dual-applicant layout above.
    # A slot sharing another applicant's home (applicant_home_sharing) cross-references that
    # applicant's own residence gallery instead of duplicating the same photos.
    extra_slots = []
    for _slot in (3, 4, 5):
        _name = case_data.get(f"applicant_{_slot}_name")
        if _name:
            extra_slots.append((_slot, _name, case_data.get(f"applicant_{_slot}_phone") or NOT_CAPTURED))

    if extra_slots:
        home_sharing = parse_home_sharing(case_data.get("applicant_home_sharing"))
        story.append(PageBreak())
        add_firm_header("10")
        story.append(Paragraph("Annexure 'F' — Additional Applicants (Home Visit Only):", anx_title_style))
        story.append(Spacer(1, 4))

        def _is_home_slot_doc(doc, slot_no):
            folder = doc.get("folder") or (doc.get("ocr_data") or {}).get("folder")
            return folder == f"home_{slot_no}"

        extra_type_to_slot = {
            "PROPERTY_EXTERIOR": 1,
            "PROPERTY_INTERIOR": 2,
            "ELECTRICITY_METER": 3,
            "SOCIETY_BOARD": 3,
            "NEIGHBOR_VERIFICATION": 4,
        }
        extra_caps_template = [
            "Building / Society Gate",
            "House Door & Name Plate",
            "Living Room & Electric Meter",
            "Person Met at Site",
        ]

        for slot_no, slot_name, slot_phone in extra_slots:
            home_group = home_group_for_slot(slot_no, home_sharing)
            story.append(Paragraph(f"<b>Applicant {slot_no}:</b> {slot_name}", table_cell_bold))
            story.append(Spacer(1, 3))

            # KYC particulars - strictly scoped to THIS slot's own matched documents
            # (_ocr_first_for_slot), so they can never be mixed up with another applicant's.
            slot_pan = _ocr_first_for_slot("extracted_pan", slot_no, {"PAN_CARD"}) or NOT_CAPTURED
            slot_aadhaar = _ocr_first_for_slot("extracted_aadhaar", slot_no, {"AADHAAR_CARD"}) or NOT_CAPTURED
            slot_dob = _ocr_first_for_slot("date_of_birth", slot_no, {"AADHAAR_CARD", "PAN_CARD"})
            slot_gender = _ocr_first_for_slot("gender", slot_no, {"AADHAAR_CARD"})
            slot_dob_age_gender = " / ".join(filter(None, [slot_dob, slot_gender])) or NOT_CAPTURED
            # Marital Status has no document OCR source (not printed on Aadhaar/PAN) and no
            # field-visit form exists yet for applicants 3-5 - printed as NOT_CAPTURED rather
            # than silently omitted, same convention the rest of the report uses for any gap.
            slot_marital = NOT_CAPTURED
            kyc_grid = [
                [Paragraph("<b>Contact Number</b>", table_cell_bold), Paragraph(slot_phone or NOT_CAPTURED, table_cell_style),
                 Paragraph("<b>DOB / Gender</b>", table_cell_bold), Paragraph(slot_dob_age_gender, table_cell_style)],
                [Paragraph("<b>PAN No.</b>", table_cell_bold), Paragraph(slot_pan, table_cell_style),
                 Paragraph("<b>Aadhar No.</b>", table_cell_bold), Paragraph(slot_aadhaar, table_cell_style)],
                [Paragraph("<b>Marital Status</b>", table_cell_bold), Paragraph(slot_marital, table_cell_style),
                 Paragraph("", table_cell_style), Paragraph("", table_cell_style)],
            ]
            t_kyc = Table(kyc_grid, colWidths=[1.4 * inch, 2.35 * inch, 1.4 * inch, 2.35 * inch])
            t_kyc.setStyle(TableStyle([
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F8FAFC")),
                ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#F8FAFC")),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]))
            story.append(t_kyc)
            story.append(Spacer(1, 4))

            if home_group != slot_no:
                story.append(Paragraph(
                    f"Resides with Applicant {home_group} - residence verified jointly; see that applicant's "
                    f"residence photographs elsewhere in this report.",
                    body_style
                ))
                story.append(Spacer(1, 10))
                continue

            slot_address = case_data.get(f"applicant_{slot_no}_address") or target_address
            story.append(Paragraph(f"<b>Residence Address:</b> {slot_address}", body_style))
            story.append(Spacer(1, 4))

            slot_docs = [d for d in sorted_docs if _is_home_slot_doc(d, slot_no)]
            slot_map = {1: None, 2: None, 3: None, 4: None}
            for d in slot_docs:
                s_num = d.get("slot_number") or (d.get("ocr_data") or {}).get("slot_number")
                if s_num:
                    try:
                        s_int = int(s_num)
                        if 1 <= s_int <= 4 and slot_map[s_int] is None:
                            p_path = _resolve_img(d.get("watermarked_url") or d.get("storage_url"))
                            if p_path and os.path.exists(p_path):
                                slot_map[s_int] = p_path
                    except (ValueError, TypeError):
                        pass
            for d in slot_docs:
                target_slot = extra_type_to_slot.get(d.get("doc_type"))
                if target_slot and slot_map[target_slot] is None:
                    p_path = _resolve_img(d.get("watermarked_url") or d.get("storage_url"))
                    if p_path and os.path.exists(p_path):
                        slot_map[target_slot] = p_path

            photos = [slot_map[s] for s in [1, 2, 3, 4]]
            caps = [f"{i+1}. Applicant {slot_no} — {c}" for i, c in enumerate(extra_caps_template)]

            def _make_extra_cell(idx):
                if idx < len(photos) and is_valid_image(photos[idx]):
                    try:
                        return [Image(photos[idx], width=3.3 * inch, height=2.45 * inch)]
                    except Exception:
                        pass
                return [Paragraph(caps[idx] if idx < len(caps) else f"Residence Photo {idx+1}", table_cell_style)]

            extra_grid = [
                [_make_extra_cell(0), _make_extra_cell(1)],
                [_make_extra_cell(2), _make_extra_cell(3)],
            ]
            t_extra_photos = Table(extra_grid, colWidths=[3.75 * inch, 3.75 * inch])
            t_extra_photos.setStyle(TableStyle([
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 2),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]))
            story.append(t_extra_photos)
            story.append(Spacer(1, 10))

    # ================= PAGE 9: FINAL CERTIFICATE =================
    story.append(PageBreak())
    add_firm_header(9)
    story.append(Paragraph("FINAL CERTIFICATE", section_title_style))
    story.append(Spacer(1, 4))

    cert_statement = (
        "This is to certify that the above information given in this report is correct & true and we have no direct or indirect "
        "interest with the person / applicant / co-applicant / guarantor / firm / company and detailed appraisal and analysis is "
        "based on personal visit/ document submitted by customer and verification from source of documents."
    )
    story.append(Paragraph(cert_statement, body_style))
    story.append(Spacer(1, 10))

    sign_data = [
        [
            Paragraph(
                f"<b>For, NAIMISH N. SHAH & CO.</b><br/>"
                f"CHARTERED ACCOUNTANTS<br/>"
                f"<b>(F.R. No. {frn})</b><br/><br/>"
                f"<b>({partner})</b><br/>"
                f"PARTNER<br/>"
                f"M. NO.: 033747<br/>"
                f"<b>UDIN: {effective_udin}</b><br/>"
                f"<i>[Signature & Official Seal of Approved CPA Agency]</i><br/><br/>"
                f"Place: Ahmedabad<br/>"
                f"Date: {rep_date}",
                body_style
            ),
            Paragraph(
                "<b>CONFIRMATION BY BRANCH HEAD:</b><br/><br/>"
                "This is to certify that we have verified the report and found the same "
                "compiled / Not Complied with due care and all relevant details are filled "
                "in / Not Filled in.<br/><br/>"
                "Hence, the report is:<br/>"
                "<b>[&nbsp;&nbsp;] ACCEPTED</b>  /  <b>[&nbsp;&nbsp;] NOT ACCEPTED</b><br/><br/>"
                f"Place: {branch}<br/>"
                f"Date: {rep_date}<br/><br/>"
                "<b>(Signature of Branch Manager / RLP Head)</b>",
                body_style
            ),
        ]
    ]
    t_sign = Table(sign_data, colWidths=[3.75 * inch, 3.75 * inch])
    t_sign.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#1E40AF")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(KeepTogether(t_sign))
    story.append(Spacer(1, 8))

    story.append(Paragraph("<b>CRYPTOGRAPHIC TAMPER-EVIDENT FINGERPRINT:</b>", body_style))
    story.append(Paragraph(f"This document is sealed with SHA-256 integrity hash. Registered in CA Verification Database under UDIN: {effective_udin}.", firm_addr_style))

    # Build Document
    doc.build(story)

    # Calculate SHA-256
    sha256_hash = hashlib.sha256()
    with open(output_pdf_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    pdf_sha256 = sha256_hash.hexdigest()

    return {
        "pdf_path": output_pdf_path,
        "sha256": pdf_sha256,
        "udin": effective_udin,
    }
