import base64
import json
import mimetypes
import os
import re
from typing import Any, Dict, Optional
import httpx
from PIL import Image
from app.core.config import settings

try:
    from rapidfuzz import fuzz
except ImportError:
    import difflib
    class FuzzFallback:
        @staticmethod
        def token_set_ratio(s1, s2):
            t1 = set(re.findall(r"\w+", str(s1).lower()))
            t2 = set(re.findall(r"\w+", str(s2).lower()))
            if not t1 or not t2:
                return 0.0
            intersection = t1 & t2
            diff1 = t1 - intersection
            diff2 = t2 - intersection
            if intersection == t1 or intersection == t2:
                return 100.0
            s_inter = " ".join(sorted(intersection))
            s1_sorted = (s_inter + " " + " ".join(sorted(diff1))).strip()
            s2_sorted = (s_inter + " " + " ".join(sorted(diff2))).strip()
            r1 = difflib.SequenceMatcher(None, s_inter, s1_sorted).ratio()
            r2 = difflib.SequenceMatcher(None, s_inter, s2_sorted).ratio()
            r3 = difflib.SequenceMatcher(None, s1_sorted, s2_sorted).ratio()
            return max(r1, r2, r3) * 100.0
    fuzz = FuzzFallback()

try:
    import pytesseract
except ImportError:
    pytesseract = None


AADHAAR_REGEX = re.compile(r"\b(\d{4})[ -]?(\d{4})[ -]?(\d{4})\b")
PAN_REGEX = re.compile(r"\b([A-Z]{5}[0-9]{4}[A-Z]{1})\b")
ELECTRICITY_METER_REGEX = re.compile(r"\b(?:MTR|METER|CA|CONS|CONSUMER)[^\d]{0,5}(\d{8,12})\b", re.IGNORECASE)


def mask_aadhaar_text(text: str) -> str:
    """
    UIDAI Compliance: Mask the first 8 digits of any 12-digit Aadhaar number.
    e.g. '1234 5678 9012' -> 'XXXX-XXXX-9012'
    """
    def _mask_repl(match):
        last_4 = match.group(3)
        return f"XXXX-XXXX-{last_4}"

    return AADHAAR_REGEX.sub(_mask_repl, text)


def scan_with_gemini_openrouter(
    image_path: str,
    master_applicant_name: str,
    master_target_address: str,
    doc_type: str = "OTHER",
) -> Optional[Dict[str, Any]]:
    """
    Scan and analyze documents using OpenRouter with cost-effective, high-accuracy
    Google Gemini (e.g., google/gemini-2.0-flash-001).
    Performs forensic OCR, UIDAI 8-digit Aadhaar masking, and fuzzy matching.
    """
    if not settings.OPENROUTER_API_KEY:
        return None

    try:
        mime_type, _ = mimetypes.guess_type(image_path)
        if not mime_type:
            mime_type = "image/jpeg"

        with open(image_path, "rb") as img_file:
            base64_image = base64.b64encode(img_file.read()).decode("utf-8")

        data_uri = f"data:{mime_type};base64,{base64_image}"

        prompt = f"""
You are a forensic document scrutiny specialist for a Chartered Accountant (CA) firm conducting bank loan Contact Point Verification (CPV).
Analyze the provided document or physical property image.

MASTER APPLICANT DATA TO VERIFY:
- Applicant Name: "{master_applicant_name}"
- Target Property Address: "{master_target_address}"
- Expected Category: "{doc_type}"

UIDAI COMPLIANCE MANDATE:
- If this is an Aadhaar card, the first 8 digits MUST BE MASKED: format 'XXXX-XXXX-1234'. NEVER return full 12 digits!

INSTRUCTIONS:
1. Identify the document type (e.g. AADHAAR_CARD, PAN_CARD, UTILITY_BILL, SALARY_SLIP, PROPERTY_EXTERIOR, PROPERTY_INTERIOR, ELECTRICITY_METER, OTHER).
2. Extract the name on the document and calculate a match score (0-100) against the master applicant name.
3. Extract the address (if present) and calculate a match score (0-100) against the master target address.
4. Extract unique identifiers (Masked Aadhaar, PAN Number, Meter Number, Consumer Number).
5. Note any signs of photo tampering, font mismatch, or discrepancies.

Return ONLY a valid JSON object with the following keys:
{{
  "detected_doc_type": "string",
  "extracted_name": "string or null",
  "extracted_aadhaar": "XXXX-XXXX-1234 or null",
  "is_uidai_masked": true,
  "extracted_pan": "string or null",
  "extracted_meter_no": "string or null",
  "extracted_address": "string or null",
  "fuzzy_match_scores": {{
    "applicant_name_score": 98.5,
    "address_score": 94.0
  }},
  "is_discrepancy": false,
  "discrepancy_reasons": [],
  "confidence_score": 0.98,
  "summary": "1-2 sentence forensic summary of the document"
}}
"""

        headers = {
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "HTTP-Referer": "https://railway.app",
            "X-Title": settings.PROJECT_NAME,
            "Content-Type": "application/json",
        }

        payload = {
            "model": settings.OPENROUTER_MODEL,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {"url": data_uri}
                        }
                    ]
                }
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.1,
            "max_tokens": 1000,
        }

        with httpx.Client(timeout=30.0) as client:
            response = client.post(
                f"{settings.OPENROUTER_BASE_URL}/chat/completions",
                headers=headers,
                json=payload,
            )

        if response.status_code == 200:
            result = response.json()
            content = result["choices"][0]["message"]["content"]
            parsed_json = json.loads(content)
            parsed_json["scanned_by"] = f"OpenRouter ({settings.OPENROUTER_MODEL})"
            return parsed_json

    except Exception:
        # Fall back to local parsing if OpenRouter call fails or network times out
        pass

    return None


def extract_text_from_image(image_path: str) -> str:
    """Extract raw text from an image using pytesseract with fallback."""
    if pytesseract is None:
        return ""
    try:
        with Image.open(image_path) as img:
            text = pytesseract.image_to_string(img)
            return text.strip()
    except Exception:
        return ""


def parse_document_ocr(
    image_path: str,
    master_applicant_name: str,
    master_target_address: str,
    doc_type: str = "OTHER",
) -> Dict[str, Any]:
    """
    Primary document scrutiny pipeline:
    1. Attempts high-accuracy, cost-effective Gemini Vision via OpenRouter.
    2. Seamlessly falls back to local Tesseract OCR + RapidFuzz matching if needed.
    """
    # 1. Try Gemini Vision via OpenRouter
    gemini_result = scan_with_gemini_openrouter(
        image_path=image_path,
        master_applicant_name=master_applicant_name,
        master_target_address=master_target_address,
        doc_type=doc_type,
    )
    if gemini_result:
        return gemini_result

    # 2. Local Fallback Engine (Tesseract + Regex + RapidFuzz)
    raw_text = extract_text_from_image(image_path)
    masked_text = mask_aadhaar_text(raw_text)

    extracted_aadhaar = None
    aadhaar_match = AADHAAR_REGEX.search(raw_text)
    if aadhaar_match:
        extracted_aadhaar = f"XXXX-XXXX-{aadhaar_match.group(3)}"

    extracted_pan = None
    pan_match = PAN_REGEX.search(raw_text)
    if pan_match:
        extracted_pan = pan_match.group(1)

    extracted_meter_no = None
    meter_match = ELECTRICITY_METER_REGEX.search(raw_text)
    if meter_match:
        extracted_meter_no = meter_match.group(1)

    name_score = 0.0
    if master_applicant_name and raw_text:
        name_score = float(fuzz.token_set_ratio(master_applicant_name.lower(), raw_text.lower()))

    address_score = 0.0
    if master_target_address and raw_text:
        address_score = float(fuzz.token_set_ratio(master_target_address.lower(), raw_text.lower()))

    is_discrepancy = False
    discrepancy_reasons = []

    if doc_type in ["AADHAAR_CARD", "PAN_CARD"] and name_score < 75.0 and len(raw_text) > 20:
        is_discrepancy = True
        discrepancy_reasons.append(f"Name fuzzy match is low ({name_score:.1f}%)")

    if doc_type == "UTILITY_BILL" and address_score < 60.0 and len(raw_text) > 30:
        is_discrepancy = True
        discrepancy_reasons.append(f"Property address fuzzy match is low ({address_score:.1f}%)")

    return {
        "scanned_by": "Local OCR + RapidFuzz Engine",
        "raw_text_length": len(raw_text),
        "masked_text": masked_text[:2000],
        "extracted_aadhaar": extracted_aadhaar,
        "is_uidai_masked": bool(extracted_aadhaar),
        "extracted_pan": extracted_pan,
        "extracted_meter_no": extracted_meter_no,
        "fuzzy_match_scores": {
            "applicant_name_score": round(name_score, 1),
            "address_score": round(address_score, 1),
        },
        "is_discrepancy": is_discrepancy,
        "discrepancy_reasons": discrepancy_reasons,
        "summary": "Document processed via local OCR fallback engine with UIDAI Aadhaar masking.",
    }
