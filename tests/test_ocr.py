from app.services.ocr_parser import mask_aadhaar_text, fuzz


def test_aadhaar_masking_standard():
    raw_text = "Applicant Aadhaar Number: 4321 8765 9812 verified by UIDAI"
    masked = mask_aadhaar_text(raw_text)
    assert "4321" not in masked
    assert "8765" not in masked
    assert "XXXX-XXXX-9812" in masked


def test_aadhaar_masking_hyphenated():
    raw_text = "Resident ID: 9876-5432-1234 on card"
    masked = mask_aadhaar_text(raw_text)
    assert "9876" not in masked
    assert "XXXX-XXXX-1234" in masked


def test_fuzzy_cross_match_score():
    master_name = "Vikramaditya Sengupta"
    ocr_extracted = "VIKRAMADITYA SENGUPTA S/O R SENGUPTA"
    score = fuzz.token_set_ratio(master_name.lower(), ocr_extracted.lower())
    assert score >= 90.0
