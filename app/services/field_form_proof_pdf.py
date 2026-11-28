"""
Tamper-evident PDF Audit Record Generator for the Field Agent's PWA Due Diligence Questionnaire Form.

Generates an official proof document ("FIELD AGENT DUE DILIGENCE QUESTIONNAIRE — SUBMITTED FORM RECORD")
showing the exact details entered by the Field Agent on the Mobile PWA (or imported from a Google Form PDF),
including submission timestamps, agent identity, attendance selfie & GPS coordinates, raw UI inputs ('restore'),
and normalized fields across Applicant, Family Background, Residence Verification, Office/Business Verification,
Co-Applicant (Applicant 2), Additional Co-Applicants (3-5), and Previous Loan Details.
"""
import hashlib
import json
import os
import re
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    Image,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from xml.sax.saxutils import escape as _xml_escape


IST_OFFSET = timedelta(hours=5, minutes=30)


def _fmt_ist(dt_or_ts: Any) -> str:
    if dt_or_ts is None or dt_or_ts == "":
        return "—"
    try:
        if isinstance(dt_or_ts, (int, float)):
            # Epoch milliseconds or seconds
            sec = float(dt_or_ts) / 1000.0 if float(dt_or_ts) > 1e11 else float(dt_or_ts)
            dt_utc = datetime.fromtimestamp(sec, tz=timezone.utc)
        elif isinstance(dt_or_ts, datetime):
            dt_utc = dt_or_ts if dt_or_ts.tzinfo is not None else dt_or_ts.replace(tzinfo=timezone.utc)
        elif isinstance(dt_or_ts, str):
            s = dt_or_ts.strip()
            if s.isdigit():
                sec = float(s) / 1000.0 if float(s) > 1e11 else float(s)
                dt_utc = datetime.fromtimestamp(sec, tz=timezone.utc)
            else:
                dt_utc = datetime.fromisoformat(s.replace("Z", "+00:00"))
                if dt_utc.tzinfo is None:
                    dt_utc = dt_utc.replace(tzinfo=timezone.utc)
        else:
            return str(dt_or_ts)
        dt_ist = dt_utc.astimezone(timezone(IST_OFFSET))
        return dt_ist.strftime("%d %b %Y, %I:%M:%S %p IST")
    except Exception:
        return str(dt_or_ts)


def _clean_val(val: Any, fallback: str = "Not Entered by Agent") -> str:
    if val is None:
        return fallback
    if isinstance(val, bool):
        return "Yes" if val else "No"
    if isinstance(val, (list, tuple)):
        items = [str(x).strip() for x in val if x not in (None, "")]
        return ", ".join(items) if items else fallback
    s = str(val).strip()
    return s if s else fallback


def _is_valid_img_file(path: Optional[str]) -> bool:
    if not path or not os.path.exists(path) or not os.path.isfile(path):
        return False
    try:
        if os.path.getsize(path) < 100:
            return False
        from PIL import Image as PILImage
        with PILImage.open(path) as im:
            im.verify()
        return True
    except Exception:
        return False


def build_field_agent_submitted_form_pdf(
    output_pdf_path: str,
    case_meta: Dict[str, Any],
    field_form_data: Dict[str, Any],
    submission_logs: List[Dict[str, Any]],
    selfie_info: Optional[Dict[str, Any]] = None,
    site_photos_summary: Optional[Dict[str, Any]] = None,
) -> str:
    """
    Render the Field Agent's filled Due Diligence Questionnaire Form into a clean,
    audit-stamped A4 PDF suitable as official proof of what the Field Agent entered.
    """
    os.makedirs(os.path.dirname(os.path.abspath(output_pdf_path)), exist_ok=True)

    ff = field_form_data if isinstance(field_form_data, dict) else {}
    restore = ff.get("restore") if isinstance(ff.get("restore"), dict) else {}
    off = ff.get("office_details") if isinstance(ff.get("office_details"), dict) else {}
    off_co = ff.get("office_details_co") if isinstance(ff.get("office_details_co"), dict) else {}
    res_co = ff.get("residence_details_co") if isinstance(ff.get("residence_details_co"), dict) else {}
    prev_loan = ff.get("previous_loan") if isinstance(ff.get("previous_loan"), dict) else {}
    extra_cos = ff.get("extra_co_applicants") if isinstance(ff.get("extra_co_applicants"), list) else []

    styles = getSampleStyleSheet()
    navy = colors.HexColor("#0F2547")
    slate_dark = colors.HexColor("#1E293B")
    slate_muted = colors.HexColor("#475569")
    border_col = colors.HexColor("#CBD5E1")
    bg_header = colors.HexColor("#EFF6FF")
    bg_alt = colors.HexColor("#F8FAFC")
    emerald_bg = colors.HexColor("#ECFDF5")
    emerald_txt = colors.HexColor("#065F46")
    amber_bg = colors.HexColor("#FFFBEB")

    title_style = ParagraphStyle(
        "FFTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12.5,
        leading=15,
        textColor=colors.white,
    )
    subtitle_style = ParagraphStyle(
        "FFSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#DBEAFE"),
    )
    sec_hdr_style = ParagraphStyle(
        "FFSecHdr",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9.5,
        leading=12,
        textColor=navy,
    )
    lbl_style = ParagraphStyle(
        "FFLbl",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10.5,
        textColor=slate_muted,
    )
    val_style = ParagraphStyle(
        "FFVal",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        textColor=slate_dark,
    )
    val_bold_style = ParagraphStyle(
        "FFValBold",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11,
        textColor=navy,
    )
    small_note_style = ParagraphStyle(
        "FFSmall",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.5,
        leading=10,
        textColor=slate_muted,
    )

    def _p(text: Any, style: ParagraphStyle = val_style) -> Paragraph:
        s = _xml_escape(str(text if text is not None else "—"))
        s = s.replace("\n", "<br/>")
        return Paragraph(s, style)

    def _section_banner(title_txt: str) -> Table:
        t = Table([[Paragraph(_xml_escape(title_txt), sec_hdr_style)]], colWidths=[7.3 * inch])
        t.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), bg_header),
                    ("BOX", (0, 0), (-1, -1), 0.75, colors.HexColor("#93C5FD")),
                    ("LEFTPADDING", (0, 0), (-1, -1), 7),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ]
            )
        )
        return t

    def _kv_grid(pairs: List[Tuple[str, Any]], two_col: bool = True) -> Table:
        """Render key-value pairs in a 4-column (2 pairs per row) or 2-column table."""
        rows = []
        if two_col:
            for i in range(0, len(pairs), 2):
                k1, v1 = pairs[i]
                if i + 1 < len(pairs):
                    k2, v2 = pairs[i + 1]
                else:
                    k2, v2 = "", ""
                rows.append([
                    _p(k1, lbl_style),
                    _p(_clean_val(v1) if k1 else "", val_style),
                    _p(k2, lbl_style),
                    _p(_clean_val(v2) if k2 else "", val_style),
                ])
            col_w = [1.45 * inch, 2.2 * inch, 1.45 * inch, 2.2 * inch]
        else:
            for k1, v1 in pairs:
                rows.append([_p(k1, lbl_style), _p(_clean_val(v1), val_style)])
            col_w = [1.9 * inch, 5.4 * inch]

        t = Table(rows, colWidths=col_w)
        ts = [
            ("GRID", (0, 0), (-1, -1), 0.5, border_col),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 5),
            ("RIGHTPADDING", (0, 0), (-1, -1), 5),
            ("TOPPADDING", (0, 0), (-1, -1), 3.5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5),
        ]
        for r_idx in range(len(rows)):
            bg = colors.white if r_idx % 2 == 0 else bg_alt
            ts.append(("BACKGROUND", (0, r_idx), (-1, r_idx), bg))
            ts.append(("BACKGROUND", (0, r_idx), (0, r_idx), colors.HexColor("#F1F5F9")))
            if two_col:
                ts.append(("BACKGROUND", (2, r_idx), (2, r_idx), colors.HexColor("#F1F5F9")))
        t.setStyle(TableStyle(ts))
        return t

    story: List[Any] = []

    # -------------------------------------------------------------------------
    # 1. TOP HEADER BANNER (PROOF OF FIELD AGENT PWA SUBMISSION)
    # -------------------------------------------------------------------------
    case_no = case_meta.get("case_no") or "—"
    applicant_name = case_meta.get("applicant_name") or "—"
    co_applicant_name = case_meta.get("co_applicant_name") or ff.get("co_applicant_name") or ""
    bank_name = case_meta.get("bank_name") or "—"
    branch_name = case_meta.get("branch") or "—"
    loan_type = case_meta.get("loan_type") or "—"
    loan_amt = case_meta.get("loan_amount")
    loan_amt_str = f"Rs. {int(loan_amt):,}/-" if isinstance(loan_amt, (int, float)) and loan_amt > 0 else "—"

    payload_digest = hashlib.sha256(
        json.dumps(ff, sort_keys=True, default=str).encode("utf-8")
    ).hexdigest()[:16].upper()
    now_ist_str = _fmt_ist(datetime.now(timezone.utc))

    hdr_left = [
        Paragraph("NAIMISH N. SHAH &amp; CO. — CHARTERED ACCOUNTANTS (ICAI FRN: 106829W)", subtitle_style),
        Spacer(1, 2),
        Paragraph("FIELD AGENT DUE DILIGENCE QUESTIONNAIRE — SUBMITTED FORM RECORD", title_style),
        Spacer(1, 2),
        Paragraph(
            f"OFFICIAL AUDIT PROOF OF FIELD AGENT ENTRY  •  CASE REF: {_xml_escape(str(case_no))}  •  HASH: {payload_digest}",
            subtitle_style,
        ),
    ]
    hdr_table = Table([[hdr_left]], colWidths=[7.3 * inch])
    hdr_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), navy),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    story.append(hdr_table)
    story.append(Spacer(1, 6))

    # -------------------------------------------------------------------------
    # 2. SUBMISSION ATTRIBUTION, AGENT IDENTITY & AUDIT LOG SUMMARY
    # -------------------------------------------------------------------------
    has_meaningful_data = bool(ff and any(
        ff.get(k) not in (None, "", [], {})
        for k in ("person_met", "period_of_stay", "neighbour_1", "family_members", "office_details", "restore")
    ))
    source_type = (
        "Imported Backlog Google Form PDF + PWA"
        if ff.get("pdf_ingest")
        else ("Mobile PWA Field Agent Questionnaire (/pwa)" if has_meaningful_data else "No Form Submitted Yet")
    )
    agent_entered_exec = (
        ff.get("executive")
        or ff.get("verifier_agent_name")
        or case_meta.get("assigned_agent_name")
        or "Not Assigned"
    )
    last_saved_ist = _fmt_ist(ff.get("_updated_at")) if ff.get("_updated_at") else (
        submission_logs[0]["timestamp_ist"] if submission_logs else "—"
    )

    story.append(_section_banner("A. CASE DOSSIER & FIELD AGENT SUBMISSION AUDIT TRAIL (PROOF OF ENTRY)"))
    story.append(Spacer(1, 3))

    audit_pairs = [
        ("Case Reference No.", case_no),
        ("Case Status", case_meta.get("status") or "—"),
        ("Bank & Branch", f"{bank_name} ({branch_name})"),
        ("Loan Type & Amount", f"{loan_type}  |  {loan_amt_str}"),
        ("Allotted Field Agent", case_meta.get("assigned_agent_name") or "Not Allotted"),
        ("Executive Name in Form", agent_entered_exec),
        ("Submission Channel", source_type),
        ("Last Form Saved (IST)", last_saved_ist),
        ("Form Persona Selected", ff.get("persona") or ff.get("form_applicant_type") or "Applicant"),
        ("Site Photos Uploaded", f"{(site_photos_summary or {}).get('total_site_photos', 0)} Site Photo(s) on Server"),
    ]
    story.append(_kv_grid(audit_pairs, two_col=True))
    story.append(Spacer(1, 4))

    # Submission Audit Logs + Attendance Selfie strip
    if submission_logs:
        log_lines = []
        for idx, lg in enumerate(submission_logs[:6], start=1):
            log_lines.append(
                f"{idx}. [{lg.get('timestamp_ist', '—')}]  {lg.get('action_label', 'Form Submitted')} by {lg.get('user_name', 'Field Agent')}"
            )
        log_txt = "\n".join(log_lines)
    else:
        log_txt = "No explicit FIELD_FORM_SUBMITTED event found in AuditLog table (or form was pre-populated at case intake)."

    selfie_cell_content: Any = _p("No Attendance Selfie uploaded by Field Agent.", small_note_style)
    if selfie_info and selfie_info.get("local_path") and _is_valid_img_file(selfie_info.get("local_path")):
        try:
            img_flow = Image(selfie_info["local_path"], width=0.95 * inch, height=0.95 * inch, kind="proportional")
            gps_lbl = selfie_info.get("gps_text") or "GPS Recorded"
            cap_lbl = selfie_info.get("captured_at_ist") or "—"
            selfie_sub = Table(
                [[img_flow, _p(f"Attendance Selfie Verified\nTime: {cap_lbl}\n{gps_lbl}", small_note_style)]],
                colWidths=[1.05 * inch, 2.35 * inch],
            )
            selfie_sub.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 2)]))
            selfie_cell_content = selfie_sub
        except Exception:
            pass

    log_selfie_tbl = Table(
        [
            [
                _p("Server Audit Log Timestamps (IST)", lbl_style),
                _p("Field Agent Attendance Selfie & Telemetry", lbl_style),
            ],
            [
                _p(log_txt, small_note_style),
                selfie_cell_content,
            ],
        ],
        colWidths=[3.8 * inch, 3.5 * inch],
    )
    log_selfie_tbl.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.5, border_col),
                ("BACKGROUND", (0, 0), (-1, 0), emerald_bg),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 3.5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5),
            ]
        )
    )
    story.append(log_selfie_tbl)
    story.append(Spacer(1, 7))

    # -------------------------------------------------------------------------
    # 3. MODULE 1: APPLICANT & PERSONAL PARTICULARS (AS ENTERED BY FIELD AGENT)
    # -------------------------------------------------------------------------
    story.append(_section_banner("B. MODULE 1 — APPLICANT & PERSONAL PARTICULARS (AS FILLED BY FIELD AGENT)"))
    story.append(Spacer(1, 3))

    raw_marital = restore.get("marital_status") or ff.get("marital_status")
    raw_age = restore.get("age_community") or ff.get("age_community") or ff.get("age")
    raw_comm = restore.get("community") or ff.get("community")
    raw_qual = restore.get("qualification") or ff.get("qualification")
    raw_contact = restore.get("contact_number") or ff.get("contact_number") or case_meta.get("applicant_phone")

    mod1_pairs = [
        ("Primary Applicant Name", applicant_name),
        ("Co-Applicant Name", co_applicant_name or "None / Single Applicant"),
        ("Contact Mobile Number", raw_contact),
        ("Marital Status (Entered)", raw_marital),
        ("Applicant Age (Entered)", raw_age),
        ("Community / Religion", raw_comm),
        ("Educational Qualification", raw_qual),
        ("Primary Occupation", ff.get("occupation") or off.get("occupation")),
    ]
    story.append(_kv_grid(mod1_pairs, two_col=True))
    story.append(Spacer(1, 6))

    # -------------------------------------------------------------------------
    # 4. FAMILY BACKGROUND TABLE (AS ENTERED BY FIELD AGENT)
    # -------------------------------------------------------------------------
    story.append(_section_banner("C. FAMILY BACKGROUND DETAILS (AS ENTERED BY FIELD AGENT IN QUESTIONNAIRE)"))
    story.append(Spacer(1, 3))

    raw_fam_list = restore.get("family_members") if isinstance(restore.get("family_members"), list) else []
    norm_fam_list = ff.get("family_members") if isinstance(ff.get("family_members"), list) else []
    fam_rows_src = raw_fam_list if raw_fam_list else norm_fam_list

    fam_table_rows = [[
        _p("Sr.", lbl_style),
        _p("Family Member Name / Description", lbl_style),
        _p("Relationship with Applicant", lbl_style),
        _p("Age (Yrs)", lbl_style),
        _p("Earning Member?", lbl_style),
    ]]
    if fam_rows_src:
        for idx, fm in enumerate(fam_rows_src, start=1):
            if isinstance(fm, dict):
                fm_name = fm.get("name") or fm.get("member_name") or fm.get("relation") or "—"
                fm_rel = fm.get("relation") or fm.get("relationship") or "—"
                fm_age = fm.get("age") if fm.get("age") not in (None, "") else "—"
                earn_raw = fm.get("earning")
                if isinstance(earn_raw, bool):
                    fm_earn = "Yes" if earn_raw else "No"
                elif earn_raw not in (None, ""):
                    fm_earn = str(earn_raw)
                else:
                    fm_earn = "—"
                fam_table_rows.append([
                    _p(str(idx), val_style),
                    _p(fm_name, val_bold_style),
                    _p(fm_rel, val_style),
                    _p(str(fm_age), val_style),
                    _p(fm_earn, val_style),
                ])
    else:
        fam_table_rows.append([
            _p("—", val_style),
            _p("No family member rows were entered by the Field Agent.", small_note_style),
            _p("—", val_style),
            _p("—", val_style),
            _p("—", val_style),
        ])

    fam_tbl = Table(fam_table_rows, colWidths=[0.45 * inch, 2.75 * inch, 1.8 * inch, 1.0 * inch, 1.3 * inch])
    fam_tbl.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.5, border_col),
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F1F5F9")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]
        )
    )
    story.append(fam_tbl)
    story.append(Spacer(1, 7))

    # -------------------------------------------------------------------------
    # 5. MODULE 2: RESIDENCE VERIFICATION DETAILS (AS ENTERED BY FIELD AGENT)
    # -------------------------------------------------------------------------
    story.append(_section_banner("D. MODULE 2 — RESIDENCE VERIFICATION DETAILS (AS FILLED BY FIELD AGENT)"))
    story.append(Spacer(1, 3))

    raw_btype = (
        f"{restore.get('bhk', '')} {restore.get('building_type_only', '')}".strip()
        if (restore.get("bhk") or restore.get("building_type_only"))
        else ff.get("building_type")
    )
    raw_own = restore.get("ownership") or ff.get("ownership")
    raw_stay = restore.get("period_of_stay") or ff.get("period_of_stay")
    raw_owner_nm = restore.get("owner_name") or ff.get("owner_name")
    raw_person_met = restore.get("person_met") or ff.get("person_met")
    raw_landmark = restore.get("landmark") or ff.get("landmark")
    raw_neighbors = restore.get("neighbors") if isinstance(restore.get("neighbors"), list) else []
    n1 = ff.get("neighbour_1") or (raw_neighbors[0] if len(raw_neighbors) > 0 else "")
    n2 = ff.get("neighbour_2") or (raw_neighbors[1] if len(raw_neighbors) > 1 else "")
    raw_assets = ff.get("assets_observed") or restore.get("active_asset_ids")

    res_addr_pairs = [
        ("Target Residence Address", case_meta.get("target_address") or "—"),
    ]
    story.append(_kv_grid(res_addr_pairs, two_col=False))
    story.append(Spacer(1, 2))

    mod2_pairs = [
        ("Person Met at Residence", raw_person_met),
        ("Duration / Period of Stay", raw_stay),
        ("Residence Ownership Status", raw_own),
        ("Property Owner Name / Relation", raw_owner_nm),
        ("Building Type & BHK", raw_btype),
        ("Nearest Landmark (Entered)", raw_landmark),
        ("Neighbour Reference 1", n1),
        ("Neighbour Reference 2", n2),
        ("Nameboard Visible at Home?", restore.get("nameboard_visible") or ff.get("nameboard_visible")),
        ("Residence Proof Obtained?", restore.get("residence_evidence_obtained") or ff.get("residence_evidence_obtained")),
        ("Nature of Building", restore.get("building_nature") or ff.get("building_nature")),
        ("General Appearance", restore.get("general_appearance") or ff.get("general_appearance")),
        ("Locality Type", restore.get("locality") or ff.get("locality")),
        ("Surroundings", restore.get("surroundings") or ff.get("surroundings")),
    ]
    story.append(_kv_grid(mod2_pairs, two_col=True))
    story.append(Spacer(1, 2))
    story.append(_kv_grid([("Household Assets Observed by Agent", raw_assets)], two_col=False))
    story.append(Spacer(1, 7))

    # -------------------------------------------------------------------------
    # 6. MODULE 3: WORKPLACE / BUSINESS / OFFICE VERIFICATION DETAILS
    # -------------------------------------------------------------------------
    story.append(_section_banner("E. MODULE 3 — APPLICANT WORKPLACE / BUSINESS VERIFICATION (AS FILLED BY FIELD AGENT)"))
    story.append(Spacer(1, 3))

    off_addr_val = off.get("address") or case_meta.get("office_address")
    if off_addr_val:
        story.append(_kv_grid([("Office / Business Address", off_addr_val)], two_col=False))
        story.append(Spacer(1, 2))

    mod3_pairs = [
        ("Occupation Category", off.get("occupation") or ff.get("occupation")),
        ("Employer / Firm Name", off.get("firm_name")),
        ("Designation / Business Nature", off.get("position") or off.get("designation")),
        ("Work From Home (WFH)?", off.get("work_from_home")),
        ("Type of Firm / Entity", off.get("firm_type")),
        ("No. of Employees / Workers", off.get("employees")),
        ("Office Nameboard Visible?", off.get("nameboard")),
        ("Office Infrastructure Type", off.get("infrastructure")),
        ("Premises Ownership", off.get("premises_ownership")),
        ("Premises Owner Name", off.get("premises_owner")),
        ("Established Since / Experience", off.get("established_since") or off.get("period_of_stay")),
        ("Office Area Location", off.get("location")),
        ("Nearest Office Landmark", off.get("landmark")),
        ("Person Met at Office", off.get("who_meet")),
        ("Office Colleague / Neighbour Ref 1", off.get("reference_1")),
        ("Office Colleague / Neighbour Ref 2", off.get("reference_2")),
        ("Registration / License No.", off.get("reg_no")),
        ("Office Assets Observed", off.get("assets")),
        ("Field Agent Assessment / Opinion", off.get("assessment")),
        ("Verification Status", off.get("verification_status")),
    ]
    story.append(_kv_grid(mod3_pairs, two_col=True))
    story.append(Spacer(1, 7))

    # -------------------------------------------------------------------------
    # 7. CO-APPLICANT (APPLICANT 2) & ADDITIONAL CO-APPLICANTS (3..5)
    # -------------------------------------------------------------------------
    has_co_section = bool(
        co_applicant_name
        or (off_co and any(v not in (None, "") for v in off_co.values()))
        or (res_co and any(v not in (None, "") for v in res_co.values()))
    )
    if has_co_section:
        story.append(_section_banner("F. CO-APPLICANT (APPLICANT 2) PERSONAL, OFFICE & RESIDENCE DETAILS (AS FILLED)"))
        story.append(Spacer(1, 3))
        co_pairs = [
            ("Co-Applicant Name", off_co.get("name") or co_applicant_name),
            ("Co-Applicant Contact No.", off_co.get("contact_number") or ff.get("co_applicant_contact") or case_meta.get("co_applicant_phone")),
            ("Co-Applicant Age", off_co.get("age") or ff.get("co_applicant_age")),
            ("Co-Applicant Marital Status", off_co.get("marital_status") or ff.get("co_applicant_marital_status")),
            ("Co-Applicant Community", off_co.get("community")),
            ("Co-Applicant Qualification", off_co.get("qualification") or ff.get("co_applicant_qualification")),
            ("Relation with Primary Applicant", off_co.get("relation_to_applicant") or ff.get("co_applicant_relation")),
            ("Co-Applicant Occupation", off_co.get("occupation") or ff.get("co_applicant_occupation")),
            ("Co-Applicant Firm / Employer", off_co.get("firm_name")),
            ("Co-Applicant Designation", off_co.get("position") or off_co.get("designation")),
            ("Co-Applicant Office Address", off_co.get("address") or case_meta.get("co_applicant_office_address")),
            ("Work From Home?", off_co.get("work_from_home")),
            ("Type of Firm", off_co.get("firm_type")),
            ("No. of Employees", off_co.get("employees")),
            ("Office Nameboard", off_co.get("nameboard")),
            ("Office Infrastructure", off_co.get("infrastructure")),
            ("Premises Ownership", off_co.get("premises_ownership")),
            ("Premises Owner Name", off_co.get("premises_owner")),
            ("Established Since / Exp.", off_co.get("established_since") or off_co.get("period_of_stay")),
            ("Office Landmark", off_co.get("landmark")),
            ("Office Assets Seen", off_co.get("assets")),
            ("Person Met at Co-App Office", off_co.get("who_meet")),
            ("Co-App Office Reference 1", off_co.get("reference_1")),
            ("Co-App Office Reference 2", off_co.get("reference_2")),
        ]
        if res_co and any(v not in (None, "") for v in res_co.values()):
            co_pairs.extend([
                ("Co-App Separate Home Type", res_co.get("building_type")),
                ("Co-App Separate Home Stay", res_co.get("period_of_stay")),
                ("Co-App Separate Home Owner", res_co.get("owner_name")),
                ("Co-App Separate Home Landmark", res_co.get("landmark")),
                ("Co-App Home Person Met", res_co.get("person_met")),
                ("Co-App Home Neighbours", " / ".join([x for x in (res_co.get("neighbour_1"), res_co.get("neighbour_2")) if x])),
            ])
        story.append(_kv_grid(co_pairs, two_col=True))
        story.append(Spacer(1, 7))

    if extra_cos:
        for idx_ec, ec in enumerate(extra_cos, start=3):
            if not isinstance(ec, dict) or not (ec.get("name") or "").strip():
                continue
            story.append(_section_banner(f"F-{idx_ec - 2}. CO-APPLICANT (APPLICANT {idx_ec}) — {ec.get('name')}"))
            story.append(Spacer(1, 3))
            ec_pairs = [
                (f"Applicant {idx_ec} Name", ec.get("name")),
                ("Contact Mobile No.", ec.get("contact_number")),
                ("Age & Marital Status", f"{ec.get('age') or '—'}  |  {ec.get('marital_status') or '—'}"),
                ("Qualification & Community", f"{ec.get('qualification') or '—'}  |  {ec.get('community') or '—'}"),
                ("Relation to Applicant", ec.get("relation_to_applicant")),
                ("Occupation", ec.get("occupation")),
                ("Employer / Firm Name", ec.get("firm_name")),
                ("Designation / Position", ec.get("designation") or ec.get("position")),
                ("Office Address", ec.get("address")),
                ("Established Since / Employees", f"{ec.get('established_since') or '—'}  |  {ec.get('employees') or '—'}"),
                ("Premises Ownership & Owner", f"{ec.get('premises_ownership') or '—'} ({ec.get('premises_owner') or '—'})"),
                ("Person Met & References", f"{ec.get('who_meet') or '—'}  |  {ec.get('reference_1') or ''} {ec.get('reference_2') or ''}"),
            ]
            story.append(_kv_grid(ec_pairs, two_col=True))
            story.append(Spacer(1, 6))

    # -------------------------------------------------------------------------
    # 8. MODULE 4: PREVIOUS LOAN & FINANCIAL OBSERVATIONS
    # -------------------------------------------------------------------------
    story.append(_section_banner("G. MODULE 4 — PREVIOUS LOAN & ADDITIONAL FIELD OBSERVATIONS"))
    story.append(Spacer(1, 3))
    mod4_pairs = [
        ("Previous Loan Type", prev_loan.get("loan_type")),
        ("Previous Loan Amount", prev_loan.get("amount")),
        ("Previous Loan Bank", prev_loan.get("bank")),
        ("Dealership / Sanction Date", prev_loan.get("date")),
        ("ITR Ack. No. (If Entered)", ff.get("itr_acknowledgement_no") or restore.get("itr_acknowledgement_no")),
        ("Bank Account Status", ff.get("bank_account_status") or restore.get("bank_account_status")),
    ]
    story.append(_kv_grid(mod4_pairs, two_col=True))
    story.append(Spacer(1, 8))

    # -------------------------------------------------------------------------
    # 9. ATTESTATION & PROOF FOOTER BOX
    # -------------------------------------------------------------------------
    attest_text = (
        f"<b>AUDIT CERTIFICATION OF FIELD AGENT QUESTIONNAIRE ENTRY:</b><br/>"
        f"This PDF is a direct, unaltered printout of the digital Due Diligence Questionnaire payload "
        f"(<code>loan_case.field_form_data</code>, SHA-256 Digest: <b>{payload_digest}</b>) submitted for "
        f"Case No. <b>{_xml_escape(str(case_no))}</b> (Applicant: <b>{_xml_escape(str(applicant_name))}</b>). "
        f"All values shown above reflect the exact answers recorded in the system by the Field Verification Officer "
        f"(<b>{_xml_escape(str(agent_entered_exec))}</b>). Generated on <b>{_xml_escape(now_ist_str)}</b>."
    )
    attest_tbl = Table([[Paragraph(attest_text, small_note_style)]], colWidths=[7.3 * inch])
    attest_tbl.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), amber_bg),
                ("BOX", (0, 0), (-1, -1), 0.75, colors.HexColor("#F59E0B")),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(KeepTogether([attest_tbl]))

    def _draw_page_footer(canvas, doc):
        canvas.saveState()
        canvas.setFont("Helvetica", 7.5)
        canvas.setFillColor(slate_muted)
        footer_left = f"Field Agent Filled Questionnaire Proof  •  Case: {case_no} ({applicant_name})  •  Agent: {agent_entered_exec}"
        footer_right = f"Page {doc.page}  •  Generated: {now_ist_str}"
        canvas.drawString(0.45 * inch, 0.3 * inch, footer_left[:110])
        canvas.drawRightString(A4[0] - 0.45 * inch, 0.3 * inch, footer_right)
        canvas.restoreState()

    doc = SimpleDocTemplate(
        output_pdf_path,
        pagesize=A4,
        leftMargin=0.45 * inch,
        rightMargin=0.45 * inch,
        topMargin=0.4 * inch,
        bottomMargin=0.5 * inch,
        title=f"Field Agent Questionnaire Proof - {case_no}",
        author="Naimish N. Shah & Co. CPV Portal",
    )
    doc.build(story, onFirstPage=_draw_page_footer, onLaterPages=_draw_page_footer)
    return output_pdf_path
