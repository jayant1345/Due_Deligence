import os
import tempfile
import pytest
from app.services.pdf_generator import generate_certified_cpv_report


def test_pdf_report_generation_and_sha256():
    with tempfile.TemporaryDirectory() as tmpdir:
        output_pdf = os.path.join(tmpdir, "Certified_Report.pdf")

        case_data = {
            "case_no": "SBI-HL-2024-8841",
            "bank_name": "State Bank of India",
            "branch": "Bandra West",
            "loan_type": "Home Loan Facility",
            "applicant_name": "Vikramaditya Sengupta",
            "applicant_phone": "+91 98200 88410",
            "target_address": "Flat 402, 4th Floor, Imperial Heights, Bandra West, Mumbai 400050",
            "target_lat": 19.0596,
            "target_lon": 72.8295,
        }

        visit_data = {
            "check_in_time": "24-Oct-2026 14:15:00 IST",
            "start_lat": 19.0592,
            "start_lon": 72.8298,
        }

        document_items = [
            {
                "doc_type": "PROPERTY_EXTERIOR",
                "ocr_data": {"fuzzy_match_scores": {"applicant_name_score": 99.8, "address_score": 95.0}},
            },
            {
                "doc_type": "AADHAAR_CARD",
                "ocr_data": {"is_uidai_masked": True, "fuzzy_match_scores": {"applicant_name_score": 99.8}},
            }
        ]

        result = generate_certified_cpv_report(
            output_pdf_path=output_pdf,
            case_data=case_data,
            visit_data=visit_data,
            document_items=document_items,
            ca_remarks="Physical inspection completed within permissible geofence limits. Recommended for underwriting clearance.",
            udin="24128490AAAAAA8841",
        )

        assert os.path.exists(output_pdf)
        assert os.path.getsize(output_pdf) > 1000
        assert len(result["sha256"]) == 64  # Valid SHA-256 hex string
        assert result["udin"] == "24128490AAAAAA8841"


def test_docx_report_generation():
    from app.services.docx_generator import generate_certified_cpv_docx

    with tempfile.TemporaryDirectory() as tmpdir:
        output_docx = os.path.join(tmpdir, "Certified_Report.docx")

        case_data = {
            "case_no": "UBI-HL-2026-20L",
            "bank_name": "Union Bank of India",
            "branch": "Amrapura Branch",
            "loan_type": "Home Loan",
            "applicant_name": "Mrs. Rajkunvarba Pradeepsinh Vaghela",
            "applicant_phone": "8160166900",
            "target_address": "31, Siddhi Vinayak Bunglows, Pethapur, Gandhinagar-382610",
        }

        result = generate_certified_cpv_docx(
            output_docx_path=output_docx,
            case_data=case_data,
            udin="26033747WJZXZM6737",
        )

        assert os.path.exists(output_docx)
        assert os.path.getsize(output_docx) > 1000
        assert result["udin"] == "26033747WJZXZM6737"

