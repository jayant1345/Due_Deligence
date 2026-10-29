import base64
import json
import logging
import mimetypes
import os
import re
import time
import uuid
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from typing import Any, Dict, List, Optional, Tuple

import httpx
from PIL import Image, ImageDraw, ImageFilter

try:
    import pymupdf as fitz
except ImportError:
    try:
        import fitz
    except ImportError:
        fitz = None

try:
    from rapidfuzz import fuzz
except ImportError:
    fuzz = None

try:
    import pytesseract
    _WINDOWS_TESSERACT = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    if os.name == "nt" and os.path.exists(_WINDOWS_TESSERACT):
        pytesseract.pytesseract.tesseract_cmd = _WINDOWS_TESSERACT
except ImportError:
    pytesseract = None

from app.core.config import settings
from app.models.document import DocumentType

logger = logging.getLogger(__name__)

LLM_TO_DOCUMENT_TYPE = {
    "AADHAAR_CARD": DocumentType.AADHAAR_CARD,
    "PAN_CARD": DocumentType.PAN_CARD,
    "UTILITY_BILL": DocumentType.UTILITY_BILL,
    "SALARY_SLIP": DocumentType.SALARY_SLIP,
    "FORM_16": DocumentType.SALARY_SLIP,
    "BANK_STATEMENT": DocumentType.OTHER,
    "EMPLOYEE_ID_CARD": DocumentType.OTHER,
    "PROPERTY_DOCUMENT": DocumentType.PROPERTY_TITLE_DEED,
    "APPLICATION_FORM": DocumentType.OTHER,
    "OTHER": DocumentType.OTHER,
}
ALLOWED_DOC_TYPES = set(LLM_TO_DOCUMENT_TYPE.keys())

PAN_FORMAT = re.compile(r"^[A-Z]{5}[0-9]{4}[A-Z]$")
TAN_FORMAT = re.compile(r"^[A-Z]{4}[0-9]{5}[A-Z]$")
IFSC_FORMAT = re.compile(r"^[A-Z]{4}0[A-Z0-9]{6}$")
# 12-digit Aadhaar and 16-digit VID as printed (optionally grouped in 4s)
AADHAAR_IN_TEXT = re.compile(r"(?<!\d)(\d{4})[ -]?(\d{4})[ -]?(\d{4})(?![ -]?\d)")
VID_IN_TEXT = re.compile(r"(?<!\d)\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}(?!\d)")

PAGE_SCAN_WORKERS = 6
REQUEST_TIMEOUT_SECONDS = 180.0
MAX_ATTEMPTS = 2


def map_llm_doc_type_to_document_type(llm_doc_type: str) -> DocumentType:
    return LLM_TO_DOCUMENT_TYPE.get((llm_doc_type or "").upper(), DocumentType.OTHER)


# ---------------------------------------------------------------------------
# Deterministic validation — the model's output is never trusted blindly. A value
# that fails its official format is dropped and reported, rather than shown on a
# bank-certified dossier as if it were verified.
# ---------------------------------------------------------------------------

def _clean(value: Any) -> Any:
    if isinstance(value, str):
        v = value.strip()
        if v.lower() in {"", "null", "none", "n/a", "na", "-", "not available", "not found"}:
            return None
        return v
    return value


def _mask_text(text: str) -> str:
    """UIDAI: never let a full Aadhaar number or VID survive in any stored string."""
    text = VID_IN_TEXT.sub("XXXX-XXXX-XXXX-XXXX", text)
    return AADHAAR_IN_TEXT.sub(lambda m: f"XXXX-XXXX-{m.group(3)}", text)


# Structured identifiers that legitimately carry long digit runs (a 12-digit teacher code,
# a 16-digit account number) and are already format-validated — not Aadhaar.
_STRUCTURED_ID_KEYS = {
    "account_number", "employee_code", "consumer_number", "meter_number", "ifsc_code",
    "mobile_number", "extracted_pan", "employer_tan", "extracted_aadhaar",
}


def _deep_mask(obj: Any, key: Optional[str] = None) -> Any:
    if key in _STRUCTURED_ID_KEYS:
        return obj
    if isinstance(obj, str):
        return _mask_text(obj)
    if isinstance(obj, list):
        return [_deep_mask(x) for x in obj]
    if isinstance(obj, dict):
        return {k: _deep_mask(v, k) for k, v in obj.items()}
    return obj


def _validate_pan(value: Any) -> Tuple[Optional[str], Optional[str]]:
    v = _clean(value)
    if not v:
        return None, None
    norm = re.sub(r"[\s-]", "", str(v)).upper()
    if PAN_FORMAT.match(norm):
        return norm, None
    return None, f"Rejected unreadable/invalid PAN '{v}' (does not match AAAAA9999A format)."


def _validate_tan(value: Any) -> Optional[str]:
    v = _clean(value)
    if not v:
        return None
    norm = re.sub(r"[\s-]", "", str(v)).upper()
    return norm if TAN_FORMAT.match(norm) else None


def _validate_ifsc(value: Any) -> Optional[str]:
    v = _clean(value)
    if not v:
        return None
    norm = re.sub(r"\s", "", str(v)).upper()
    return norm if IFSC_FORMAT.match(norm) else None


def _validate_aadhaar(value: Any) -> Tuple[Optional[str], Optional[str]]:
    v = _clean(value)
    if not v:
        return None, None
    digits = re.sub(r"\D", "", str(v))
    if len(digits) >= 4 and (len(digits) == 4 or len(digits) == 12):
        return f"XXXX-XXXX-{digits[-4:]}", None
    return None, f"Rejected unreadable Aadhaar value '{_mask_text(str(v))}'."


def _normalize_date(value: Any) -> Optional[str]:
    """Normalize to DD/MM/YYYY; returns None if not a real calendar date."""
    v = _clean(value)
    if not v:
        return None
    m = re.match(r"^\s*(\d{1,2})[./-](\d{1,2})[./-](\d{4})\s*$", str(v))
    if not m:
        return None
    d, mo, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
    try:
        date(y, mo, d)
    except ValueError:
        return None
    return f"{d:02d}/{mo:02d}/{y:04d}"


def _validate_dob(value: Any) -> Tuple[Optional[str], Optional[str]]:
    norm = _normalize_date(value)
    if not norm:
        return None, (f"Rejected unreadable date of birth '{value}'." if _clean(value) else None)
    year = int(norm[-4:])
    if not (1920 <= year <= date.today().year - 17):
        return None, f"Rejected implausible date of birth '{norm}' (applicant must be an adult)."
    return norm, None


def _to_amount(value: Any) -> Optional[str]:
    v = _clean(value)
    if v is None:
        return None
    if isinstance(v, (int, float)):
        return f"{v:.2f}".rstrip("0").rstrip(".")
    cleaned = re.sub(r"[^\d.\-()]", "", str(v))
    negative = cleaned.startswith("(") and cleaned.endswith(")")
    cleaned = cleaned.strip("()")
    try:
        num = float(cleaned)
    except ValueError:
        return None
    num = -num if negative else num
    return f"{num:.2f}".rstrip("0").rstrip(".")


def _name_score(extracted: Optional[str], reference: Optional[str]) -> Optional[float]:
    if not extracted or not reference:
        return None
    a, b = extracted.upper(), reference.upper()
    if fuzz is not None:
        return float(round(fuzz.token_set_ratio(a, b), 1))
    ta, tb = set(a.split()), set(b.split())
    return round(100.0 * len(ta & tb) / max(1, min(len(ta), len(tb))), 1)


# ---------------------------------------------------------------------------
# Gemini extraction
# ---------------------------------------------------------------------------

EXTRACTION_PROMPT = """You are a meticulous document-verification officer at an Indian Chartered Accountant firm
performing loan Contact Point Verification (CPV) for a bank. Your output feeds a bank-certified
due-diligence report, so ACCURACY IS MANDATORY and guessing is forbidden.

Today's date is {today}. Dates up to today are NOT in the future — do not flag them.

The loan applicant on file is: "{applicant_name}". Other people (co-applicant, spouse, guarantor,
bill holder) may also appear in the bundle — report whose document this actually is.

STRICT RULES
1. Read every value EXACTLY as printed. If a value is not printed or not clearly legible, return null.
   Never infer, complete, or "correct" a value. Never return the string "null".
2. Classify the page as exactly one of:
   AADHAAR_CARD, PAN_CARD, UTILITY_BILL, SALARY_SLIP, FORM_16, BANK_STATEMENT,
   EMPLOYEE_ID_CARD, PROPERTY_DOCUMENT, APPLICATION_FORM, OTHER.
   A Form 16 Part-B / Annexure page is FORM_16 (not SALARY_SLIP). A page that only continues a
   previous document (e.g. a verification block, more ledger rows) keeps that document's type.
3. holder_name = the person the document BELONGS TO (card holder, employee, account holder,
   electricity consumer). It is NEVER the issuing officer, the signatory (e.g. a T.P.O. who
   signs a Form 16), the employer, or the bank.
4. PAN: the holder's 10-character PAN only (format AAAAA9999A). On a Form 16 the EMPLOYEE's PAN —
   never the "PAN of the Deductor", never the TAN (format AAAA99999A, e.g. AHMT04764E).
5. Aadhaar (UIDAI Rule): return ONLY the last 4 digits, as "XXXX-XXXX-1234". Never output the
   full 12-digit number or the 16-digit VID anywhere in your response.
6. date_of_birth is the holder's birth date (DD/MM/YYYY). It is NOT the Aadhaar issue date,
   "Details as on" date, enrolment date, bill date or statement date.
   father_or_spouse_name only if printed with that meaning (e.g. the second name on a PAN card,
   "S/O", "W/O", "D/O"). Never derive it from someone's middle name.
7. Money: digits only, no commas or currency symbols (e.g. "45057"). Salary slip figures are
   MONTHLY. Form 16 figures are ANNUAL — never put an annual figure in a monthly field.
   opening_balance / closing_balance ONLY from rows explicitly labelled "OPENING BALANCE" /
   "CLOSING BALANCE" — never the balance of the last row on a page.
8. address_type: RESIDENTIAL for the holder's home address, WORKPLACE for an employer/school
   address, BRANCH for a bank branch address.
9. observations: only MATERIAL red flags (name/address mismatch, bounced cheques or EMIs,
   large unexplained cash movements, signs of alteration, inconsistent figures). Do not report
   that a page is a photocopy, carries a scanner-app watermark, or is a continuation page.

Return ONLY a JSON object with exactly these keys:
{{
  "doc_type": "...",
  "doc_sub_type": "FRONT | BACK | COMPLETE | PART_A | PART_B | CONTINUATION | null",
  "document_title": "short descriptive title",
  "holder_name": "string or null",
  "father_or_spouse_name": "string or null",
  "date_of_birth": "DD/MM/YYYY or null",
  "gender": "MALE | FEMALE | OTHER | null",
  "pan_number": "string or null",
  "aadhaar_last4_masked": "XXXX-XXXX-1234 or null",
  "address": "string or null",
  "address_type": "RESIDENTIAL | WORKPLACE | BRANCH | null",
  "mobile_number": "string or null",
  "document_date": "issue / bill / statement date as printed, or null",
  "document_period": "e.g. 'May-2026', 'FY 2024-25', '01-01-2026 to 17-08-2026', or null",
  "employer_name": "string or null",
  "employee_code": "string or null",
  "designation": "job title / position as printed, or null",
  "date_of_joining": "DD/MM/YYYY or null",
  "pay_month": "string or null",
  "gross_salary_monthly": "string or null",
  "total_deductions_monthly": "string or null",
  "net_salary_monthly": "string or null",
  "assessment_year": "string or null",
  "employer_tan": "string or null",
  "annual_gross_salary": "string or null",
  "annual_taxable_income": "string or null",
  "annual_tax_payable": "string or null",
  "bank_name": "string or null",
  "account_number": "string or null",
  "ifsc_code": "string or null",
  "opening_balance": "string or null",
  "closing_balance": "string or null",
  "utility_provider": "MGVCL | UGVCL | PGVCL | DGVCL | TORRENT | other name | null",
  "consumer_number": "string or null",
  "meter_number": "string or null",
  "bill_month": "string or null",
  "bill_amount": "string or null",
  "is_tampered_or_suspicious": false,
  "observations": ["factual red flags a CA should note, e.g. bounced cheques, name mismatch"],
  "forensic_summary": "1-2 factual sentences"
}}"""


def _scan_failed_result(reason: str) -> Dict[str, Any]:
    """
    Honest failure: when Gemini cannot be reached the page is marked NOT SCANNED instead of
    being filled with keyword-guessed values. Nothing here may be shown as verified data.
    """
    return {
        "doc_type": "OTHER",
        "doc_sub_type": None,
        "document_title": "Not scanned — AI extraction unavailable",
        "scan_status": "FAILED",
        "scan_error": reason,
        "is_tampered_or_suspicious": False,
        "discrepancies": [f"AI scan failed: {reason}. Re-run the scan before relying on this page."],
        "forensic_summary": "This page has not been read by Gemini. No data was extracted.",
        "scanned_by": "NOT SCANNED",
    }


def _parse_model_json(content: str) -> Dict[str, Any]:
    text = (content or "").strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.DOTALL)
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("model returned no JSON object")
    return json.loads(text[start:end + 1])


def _normalize_extraction(raw: Dict[str, Any], applicant_name: str, target_address: str) -> Dict[str, Any]:
    r = {k: _clean(v) for k, v in raw.items()}
    discrepancies: List[str] = []

    doc_type = (r.get("doc_type") or "OTHER").upper().replace(" ", "_")
    if doc_type not in ALLOWED_DOC_TYPES:
        doc_type = "OTHER"

    pan, pan_err = _validate_pan(r.get("pan_number"))
    tan = _validate_tan(r.get("employer_tan"))
    if pan and tan and pan == tan:
        pan = None
    if pan_err:
        discrepancies.append(pan_err)

    aadhaar, aadhaar_err = _validate_aadhaar(r.get("aadhaar_last4_masked"))
    if aadhaar_err:
        discrepancies.append(aadhaar_err)

    dob, dob_err = _validate_dob(r.get("date_of_birth"))
    if dob_err:
        discrepancies.append(dob_err)

    holder = r.get("holder_name")
    name_score = _name_score(holder, applicant_name)
    if holder is None:
        relationship = "UNKNOWN"
    elif name_score is not None and name_score >= 85:
        relationship = "SELF"
    else:
        relationship = "DIFFERENT_PERSON"

    address = r.get("address")
    address_type = (r.get("address_type") or "").upper() or None
    address_score = None
    if address and target_address and address_type == "RESIDENTIAL" and fuzz is not None:
        address_score = float(round(fuzz.token_set_ratio(address.upper(), target_address.upper()), 1))

    if relationship == "DIFFERENT_PERSON":
        discrepancies.append(
            f"Document belongs to '{holder}', not the applicant '{applicant_name}' "
            f"(name match {name_score}%). Confirm relationship (co-applicant / spouse / guarantor)."
        )

    gender = (r.get("gender") or "").upper() or None
    if gender not in {None, "MALE", "FEMALE", "OTHER"}:
        gender = None

    observations = raw.get("observations") or []
    if not isinstance(observations, list):
        observations = [str(observations)]

    net_monthly = _to_amount(r.get("net_salary_monthly"))

    result = {
        "doc_type": doc_type,
        "doc_sub_type": r.get("doc_sub_type"),
        "document_title": r.get("document_title") or doc_type.replace("_", " ").title(),
        "scan_status": "OK",
        "holder_name": holder,
        "relationship_to_applicant": relationship,
        "father_or_spouse_name": r.get("father_or_spouse_name"),
        "date_of_birth": dob,
        "gender": gender,
        "mobile_number": r.get("mobile_number"),
        "address_type": address_type,
        "document_period": r.get("document_period"),
        "employer_name": r.get("employer_name"),
        "employee_code": r.get("employee_code"),
        "designation": r.get("designation"),
        "date_of_joining": _normalize_date(r.get("date_of_joining")),
        "pay_month": r.get("pay_month"),
        "gross_salary_monthly": _to_amount(r.get("gross_salary_monthly")),
        "total_deductions_monthly": _to_amount(r.get("total_deductions_monthly")),
        "net_salary_monthly": net_monthly,
        "assessment_year": r.get("assessment_year"),
        "employer_tan": tan,
        "annual_gross_salary": _to_amount(r.get("annual_gross_salary")),
        "annual_taxable_income": _to_amount(r.get("annual_taxable_income")),
        "annual_tax_payable": _to_amount(r.get("annual_tax_payable")),
        "bank_name": r.get("bank_name"),
        "account_number": r.get("account_number"),
        "ifsc_code": _validate_ifsc(r.get("ifsc_code")),
        "opening_balance": _to_amount(r.get("opening_balance")),
        "closing_balance": _to_amount(r.get("closing_balance")),
        "bill_month": r.get("bill_month"),
        "bill_amount": _to_amount(r.get("bill_amount")),
        # Backward-compatible keys consumed by the CA portal and field PWA
        "extracted_name": holder,
        "extracted_pan": pan,
        "extracted_aadhaar": aadhaar,
        "extracted_address": address,
        "document_date": r.get("document_date"),
        "net_salary_credit": net_monthly,
        "utility_provider": r.get("utility_provider"),
        "consumer_number": r.get("consumer_number"),
        "meter_number": r.get("meter_number"),
        "name_match_score": name_score,
        "address_match_score": address_score,
        "is_tampered_or_suspicious": bool(raw.get("is_tampered_or_suspicious")),
        "discrepancies": discrepancies + [str(o) for o in observations if _clean(o)],
        "forensic_summary": r.get("forensic_summary") or "",
    }
    return result


def call_openrouter_gemini_page_classifier(
    image_path: str,
    raw_page_text: str,
    applicant_name: str = "",
    target_address: str = "",
) -> Dict[str, Any]:
    """Classify and extract one page with Gemini (Pro by default). Never guesses on failure."""
    api_key = settings.OPENROUTER_API_KEY
    model = settings.OPENROUTER_EXTRACTION_MODEL or "google/gemini-2.5-flash"
    base_url = settings.OPENROUTER_BASE_URL or "https://openrouter.ai/api/v1"

    if not api_key:
        return _scan_failed_result("OPENROUTER_API_KEY is not configured on the server")

    mime_type, _ = mimetypes.guess_type(image_path)
    with open(image_path, "rb") as f:
        b64_img = base64.b64encode(f.read()).decode("utf-8")

    payload = {
        "model": model,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "text", "text": EXTRACTION_PROMPT.format(
                    applicant_name=applicant_name or "unknown",
                    today=date.today().strftime("%d/%m/%Y"),
                )},
                {"type": "image_url", "image_url": {"url": f"data:{mime_type or 'image/jpeg'};base64,{b64_img}"}},
            ],
        }],
        "response_format": {"type": "json_object"},
        "temperature": 0,
        # Gemini 2.5 Pro spends tokens on internal reasoning before answering; a small cap
        # truncates the JSON mid-object.
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
                content = resp.json()["choices"][0]["message"]["content"]
                raw = _parse_model_json(content)
                result = _normalize_extraction(raw, applicant_name, target_address)
                result["scanned_by"] = f"OpenRouter ({model})"
                return _deep_mask(result)
        except Exception as e:  # network error, malformed JSON, missing keys
            last_error = f"{type(e).__name__}: {e}"
        logger.warning("Gemini page scan attempt %d failed for %s: %s", attempt, image_path, last_error)
        time.sleep(2 * attempt)

    return _scan_failed_result(last_error)


def _ocr_digit_groups(im: Image.Image) -> List[Dict[str, Any]]:
    """Locate every printed 4-digit group on the page with Tesseract (exact pixel boxes)."""
    if pytesseract is None:
        return []
    groups: List[Dict[str, Any]] = []
    seen = set()
    for psm in (11, 6):  # sparse text, then uniform block — union catches what one pass misses
        data = pytesseract.image_to_data(im, config=f"--psm {psm}", output_type=pytesseract.Output.DICT)
        for i, raw in enumerate(data["text"]):
            digits = re.sub(r"\D", "", raw or "")
            if len(digits) not in (4, 8, 12, 16):
                continue
            x, y, w, h = data["left"][i], data["top"][i], data["width"][i], data["height"][i]
            # Split a merged token ("50912128") into its 4-digit groups proportionally
            n = len(digits) // 4
            for k in range(n):
                gx = x + int(w * k / n)
                key = (digits[4 * k:4 * k + 4], gx // 8, y // 8)
                if key in seen:
                    continue
                seen.add(key)
                groups.append({"d": digits[4 * k:4 * k + 4], "x": gx, "y": y, "w": int(w / n), "h": h})
    return groups


def _aadhaar_sequences(groups: List[Dict[str, Any]], last4: Optional[str]) -> Tuple[List[List[Dict]], List[List[Dict]]]:
    """Return (aadhaar_sequences, vid_sequences): runs of 4-digit groups on the same text line."""
    lines: List[List[Dict[str, Any]]] = []
    for g in sorted(groups, key=lambda g: (g["y"], g["x"])):
        for line in lines:
            ref = line[-1]
            if abs((g["y"] + g["h"] / 2) - (ref["y"] + ref["h"] / 2)) < 0.6 * max(g["h"], ref["h"]):
                line.append(g)
                break
        else:
            lines.append([g])

    aadhaar_runs, vid_runs = [], []
    for line in lines:
        line.sort(key=lambda g: g["x"])
        run = [line[0]]
        for g in line[1:]:
            gap = g["x"] - (run[-1]["x"] + run[-1]["w"])
            if 0 <= gap < 2.5 * max(g["h"], run[-1]["h"]) and abs(g["x"] - run[-1]["x"]) > 4:
                run.append(g)
            else:
                aadhaar_runs, vid_runs = _classify_run(run, last4, aadhaar_runs, vid_runs)
                run = [g]
        aadhaar_runs, vid_runs = _classify_run(run, last4, aadhaar_runs, vid_runs)
    return aadhaar_runs, vid_runs


def _classify_run(run, last4, aadhaar_runs, vid_runs):
    if len(run) >= 4:
        vid_runs.append(run[:4])
    elif len(run) == 3 and (last4 is None or run[2]["d"] == last4):
        aadhaar_runs.append(run)
    return aadhaar_runs, vid_runs


def _box(groups: List[Dict[str, Any]], pad: int) -> List[int]:
    return [
        min(g["x"] for g in groups) - pad,
        min(g["y"] for g in groups) - pad,
        max(g["x"] + g["w"] for g in groups) + pad,
        max(g["y"] + g["h"] for g in groups) + pad,
    ]


def redact_aadhaar_in_image(image_path: str, last4: Optional[str]) -> Dict[str, Any]:
    """
    UIDAI masking on the stored page image: black out the first 8 digits of every printed
    Aadhaar number (last 4 stay visible) and every 16-digit VID, at OCR-exact positions.
    A verification OCR pass then re-reads the page; if any full number is still legible the
    whole image is blurred instead, so an unmasked Aadhaar is never published.
    """
    with Image.open(image_path) as src:
        im = src.convert("RGB")
    groups = _ocr_digit_groups(im)
    aadhaar_runs, vid_runs = _aadhaar_sequences(groups, last4)

    draw = ImageDraw.Draw(im)
    for run in aadhaar_runs:
        pad = max(4, run[0]["h"] // 3)
        draw.rectangle(_box(run[:2], pad), fill="black")
    for run in vid_runs:
        pad = max(4, run[0]["h"] // 3)
        draw.rectangle(_box(run, pad), fill="black")

    residual_a, residual_v = _aadhaar_sequences(_ocr_digit_groups(im), None)
    residual = [r for r in residual_a if not (last4 and r[0]["d"] == last4)] + residual_v
    blurred = False
    if pytesseract is None or residual or (not aadhaar_runs and not vid_runs):
        im = im.filter(ImageFilter.GaussianBlur(radius=18))
        blurred = True
    im.save(image_path, "JPEG", quality=92)
    return {"aadhaar_masked": len(aadhaar_runs), "vid_masked": len(vid_runs), "image_blurred": blurred}


def _finalize_page_item(
    analysis: Dict[str, Any],
    page_idx: Optional[int],
    total_pages: Optional[int],
    relative_web_url: str,
    image_paths: List[str],
) -> Dict[str, Any]:
    redaction: Dict[str, Any] = {}
    if analysis.get("doc_type") == "AADHAAR_CARD":
        last4 = (analysis.get("extracted_aadhaar") or "")[-4:] or None
        for path in image_paths:
            redaction = redact_aadhaar_in_image(path, last4 if last4 and last4.isdigit() else None)
        if redaction.get("image_blurred"):
            analysis.setdefault("discrepancies", []).append(
                "Aadhaar number could not be reliably masked on the page image, so the image has "
                "been blurred (UIDAI). Extracted data is unaffected; view the original offline."
            )
    item = _build_item_from_llm_analysis(analysis, page_idx, total_pages, relative_web_url, image_paths[0],
                                         redaction.get("aadhaar_masked", 0) + redaction.get("vid_masked", 0))
    item["image_blurred"] = bool(redaction.get("image_blurred"))
    return item


def _build_item_from_llm_analysis(
    llm_analysis: Dict[str, Any],
    page_idx: Optional[int],
    total_pages: Optional[int],
    relative_web_url: str,
    static_img_path: str,
    aadhaar_regions_masked: int = 0,
) -> Dict[str, Any]:
    item = dict(llm_analysis)
    item.update({
        "page_number": page_idx,
        "total_pages": total_pages,
        "image_url": relative_web_url,
        "local_path": static_img_path,
        "aadhaar_regions_masked": aadhaar_regions_masked,
    })
    item.setdefault("doc_type", "OTHER")
    item.setdefault("document_title", "Scanned Document")
    item.setdefault("discrepancies", [])
    item.setdefault("scan_status", "OK")
    return item


PLACEHOLDER_APPLICANT_NAMES = {"", "PENDING AI IDENTIFICATION", "UNKNOWN", "APPLICANT"}
_BELONGS_PREFIX = "Document belongs to '"


def identify_applicant_name(items: List[Dict[str, Any]], applicant_name: str = "") -> Optional[str]:
    """
    Decide who the applicant is at case level. The name on file wins only if it matches the
    holder of at least one identity document; otherwise (blank/placeholder name, or a typo)
    the holder of the Aadhaar card — failing that the PAN card, then the most frequent
    holder — is the applicant, because a bank's KYC folder is built around the borrower.
    """
    holders = [it for it in items if it.get("holder_name") and it.get("scan_status") != "FAILED"]
    if not holders:
        return applicant_name or None
    identity = [it for it in holders if it.get("doc_type") in ("AADHAAR_CARD", "PAN_CARD")]
    on_file = (applicant_name or "").strip()
    if on_file.upper() not in PLACEHOLDER_APPLICANT_NAMES:
        if any((_name_score(it["holder_name"], on_file) or 0) >= 85 for it in (identity or holders)):
            return on_file
    for doc_type in ("AADHAAR_CARD", "PAN_CARD"):
        hit = next((it for it in identity if it.get("doc_type") == doc_type), None)
        if hit:
            return hit["holder_name"]
    counts: Dict[str, int] = {}
    for it in holders:
        counts[it["holder_name"]] = counts.get(it["holder_name"], 0) + 1
    return max(counts.items(), key=lambda kv: kv[1])[0]


def assign_relationships(items: List[Dict[str, Any]], applicant_name: str = "") -> Optional[str]:
    """Re-evaluate SELF / DIFFERENT_PERSON for every page against the case-level applicant (in place)."""
    reference = identify_applicant_name(items, applicant_name)
    for it in items:
        it["discrepancies"] = [d for d in (it.get("discrepancies") or []) if not str(d).startswith(_BELONGS_PREFIX)]
        holder = it.get("holder_name")
        if it.get("scan_status") == "FAILED":
            continue
        score = _name_score(holder, reference) if holder and reference else None
        it["name_match_score"] = score
        if not holder:
            it["relationship_to_applicant"] = "UNKNOWN"
        elif score is not None and score >= 85:
            it["relationship_to_applicant"] = "SELF"
        else:
            it["relationship_to_applicant"] = "DIFFERENT_PERSON"
            it["discrepancies"].insert(0,
                f"{_BELONGS_PREFIX}{holder}', not the applicant '{reference}' "
                f"(name match {score}%). Confirm relationship (co-applicant / spouse / guarantor).")
    return reference


def reconcile_case_documents(items: List[Dict[str, Any]], applicant_name: str = "") -> Dict[str, Any]:
    """
    Cross-check identity fields across every scanned page of a case. A PAN or DOB that
    differs between documents of the SAME person is a red flag the CA must see, so
    conflicts are listed rather than silently resolved.
    """
    items = [dict(it) for it in items]
    applicant_name = assign_relationships(items, applicant_name) or applicant_name

    def _collect(field: str, pages: List[Dict[str, Any]]) -> Dict[str, List[int]]:
        seen: Dict[str, List[int]] = {}
        for it in pages:
            v = it.get(field)
            if v:
                seen.setdefault(str(v), []).append(it.get("page_number") or 0)
        return seen

    def _consensus(values: Dict[str, List[int]]) -> Optional[str]:
        return max(values.items(), key=lambda kv: len(kv[1]))[0] if values else None

    applicant_pages = [it for it in items if it.get("relationship_to_applicant") == "SELF"]
    other_pages = [it for it in items if it.get("relationship_to_applicant") == "DIFFERENT_PERSON"]

    # Identity attributes are only authoritative on identity documents; a payslip or ledger
    # page must not override the father's name printed on the PAN card.
    identity_sources = {
        "extracted_pan": None,
        "extracted_aadhaar": {"AADHAAR_CARD"},
        "date_of_birth": {"AADHAAR_CARD", "PAN_CARD", "EMPLOYEE_ID_CARD"},
        "gender": {"AADHAAR_CARD"},
        "father_or_spouse_name": {"PAN_CARD", "AADHAAR_CARD"},
    }
    conflicts: List[str] = []
    applicant: Dict[str, Any] = {}
    for field, sources in identity_sources.items():
        pages = [it for it in applicant_pages if sources is None or it.get("doc_type") in sources]
        values = _collect(field, pages)
        applicant[field] = _consensus(values)
        if len(values) > 1:
            detail = "; ".join(f"'{v}' on page(s) {pgs}" for v, pgs in values.items())
            conflicts.append(f"Applicant {field.replace('extracted_', '').upper()} differs across documents: {detail}")

    residential = [it for it in applicant_pages if it.get("address_type") == "RESIDENTIAL" and it.get("extracted_address")]
    aadhaar_addr = next((it["extracted_address"] for it in residential if it.get("doc_type") == "AADHAAR_CARD"), None)
    applicant["residential_address"] = aadhaar_addr or (residential[0]["extracted_address"] if residential else None)
    applicant["name"] = next((it["holder_name"] for it in applicant_pages if it.get("doc_type") in ("AADHAAR_CARD", "PAN_CARD")), None) \
        or (applicant_pages[0]["holder_name"] if applicant_pages else applicant_name or None)

    salary = sorted(
        (it for it in applicant_pages if it.get("doc_type") == "SALARY_SLIP" and it.get("net_salary_monthly")),
        key=lambda it: it.get("page_number") or 0,
    )
    applicant["net_salary_monthly"] = [{"month": it.get("pay_month") or it.get("document_period"), "net": it["net_salary_monthly"]} for it in salary]
    applicant["employer_name"] = next((it["employer_name"] for it in applicant_pages if it.get("employer_name")), None)

    bank_pages = sorted((it for it in items if it.get("doc_type") == "BANK_STATEMENT"), key=lambda it: it.get("page_number") or 0)
    if bank_pages:
        applicant["bank_account"] = {
            "bank_name": next((p["bank_name"] for p in bank_pages if p.get("bank_name")), None),
            "account_number": next((p["account_number"] for p in bank_pages if p.get("account_number")), None),
            "ifsc_code": next((p["ifsc_code"] for p in bank_pages if p.get("ifsc_code")), None),
            "statement_period": next((p["document_period"] for p in bank_pages if p.get("document_period")), None),
            "opening_balance": next((p["opening_balance"] for p in bank_pages if p.get("opening_balance")), None),
            "closing_balance": next((p["closing_balance"] for p in reversed(bank_pages) if p.get("closing_balance")), None),
        }

    # Group the same other person across spelling variants / OCR slips
    # ("BAMANIYA BALVANTSINH", "BALVANTSINH BAMANIA", "BALVANTSINH RAMANIA").
    others: List[Dict[str, Any]] = []
    for it in other_pages:
        name = it.get("holder_name") or "Unknown"
        entry = next((o for o in others if (_name_score(name, o["name"]) or 0) >= 80), None)
        if entry is None:
            entry = {"name": name, "pan": None, "name_variants": [], "pages": [], "documents": []}
            others.append(entry)
        if name not in entry["name_variants"]:
            entry["name_variants"].append(name)
        entry["pan"] = entry["pan"] or it.get("extracted_pan")
        entry["pages"].append(it.get("page_number"))
        entry["documents"].append(it.get("doc_type"))
    for o in others:
        # Word order differs between document types; only a different SPELLING is a red flag
        spellings = {tuple(sorted(re.sub(r"[^A-Z ]", "", v.upper()).split())) for v in o["name_variants"]}
        if len(spellings) > 1:
            conflicts.append(f"Name spelled differently across documents: {o['name_variants']} (pages {o['pages']}).")

    utility = [it for it in items if it.get("doc_type") == "UTILITY_BILL"]
    for it in utility:
        if it.get("relationship_to_applicant") == "DIFFERENT_PERSON":
            conflicts.append(
                f"Electricity bill (page {it.get('page_number')}) is in the name of '{it.get('holder_name')}', "
                f"not the applicant — residence proof needs the holder's relationship confirmed."
            )

    failed = [it.get("page_number") for it in items if it.get("scan_status") == "FAILED"]
    if failed:
        conflicts.append(f"Pages {failed} were NOT scanned by AI — re-run the scan.")

    return {
        "applicant": applicant,
        "other_persons": others,
        "conflicts": conflicts,
        "pages_total": len(items),
        "pages_failed": failed,
    }


def classify_and_store_single_image(
    image_path: str,
    case_id: str,
    applicant_name: str,
    target_address: str,
) -> Dict[str, Any]:
    """Classify one standalone document image with the same Gemini pipeline as PDF pages."""
    storage_dir = os.path.join("storage_uploads", "separated_docs", str(case_id))
    static_dir = os.path.join("app", "static", "extracted_pages", str(case_id))
    os.makedirs(storage_dir, exist_ok=True)
    os.makedirs(static_dir, exist_ok=True)

    img_name = f"img_{uuid.uuid4().hex[:10]}.jpg"
    storage_img_path = os.path.join(storage_dir, img_name)
    static_img_path = os.path.join(static_dir, img_name)

    with Image.open(image_path) as im:
        im.convert("RGB").save(storage_img_path, "JPEG", quality=92)
        im.convert("RGB").save(static_img_path, "JPEG", quality=92)

    analysis = call_openrouter_gemini_page_classifier(
        image_path=storage_img_path,
        raw_page_text="",
        applicant_name=applicant_name,
        target_address=target_address,
    )
    relative_web_url = f"/storage/separated_docs/{case_id}/{img_name}"
    return _finalize_page_item(analysis, None, None, relative_web_url, [storage_img_path, static_img_path])


def burst_and_separate_pdf_with_llm(
    pdf_path: str,
    case_id: str,
    applicant_name: str,
    target_address: str,
) -> List[Dict[str, Any]]:
    """
    Burst a PDF into 200 DPI page images and have Gemini classify/extract every page
    (in parallel). Each page image is stored for display, with Aadhaar numbers masked.
    Saved to persistent volume storage_uploads/separated_docs/<case_id> for 100% redeployment survival.
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found at: {pdf_path}")
    if fitz is None:
        raise RuntimeError("PyMuPDF (fitz) is not installed.")

    storage_dir = os.path.join("storage_uploads", "separated_docs", str(case_id))
    static_dir = os.path.join("app", "static", "extracted_pages", str(case_id))
    os.makedirs(storage_dir, exist_ok=True)
    os.makedirs(static_dir, exist_ok=True)

    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    logger.info("Bursting PDF '%s' (%d pages) for case %s", pdf_path, total_pages, case_id)

    pdf_base = os.path.splitext(os.path.basename(pdf_path))[0]
    safe_slug = re.sub(r'[^a-zA-Z0-9_-]', '_', pdf_base)[:20]

    pages = []
    for page_num in range(total_pages):
        page = doc.load_page(page_num)
        page_idx = page_num + 1
        img_name = f"{safe_slug}_page_{page_idx}.jpg"
        storage_img_path = os.path.join(storage_dir, img_name)
        static_img_path = os.path.join(static_dir, img_name)
        pix = page.get_pixmap(dpi=200)
        pix.save(storage_img_path)
        pix.save(static_img_path)
        pages.append((page_idx, page.get_text(), storage_img_path, static_img_path, f"/storage/separated_docs/{case_id}/{img_name}"))
    doc.close()

    def _scan(entry):
        page_idx, raw_text, storage_img_path, static_img_path, web_url = entry
        analysis = call_openrouter_gemini_page_classifier(
            image_path=storage_img_path,
            raw_page_text=raw_text,
            applicant_name=applicant_name,
            target_address=target_address,
        )
        return _finalize_page_item(analysis, page_idx, total_pages, web_url, [storage_img_path, static_img_path])

    with ThreadPoolExecutor(max_workers=PAGE_SCAN_WORKERS) as pool:
        separated_results = list(pool.map(_scan, pages))

    # Persist manifest to both persistent volume and static directory
    for dest_dir in [storage_dir, static_dir]:
        try:
            with open(os.path.join(dest_dir, "manifest.json"), "w", encoding="utf-8") as mf:
                json.dump(separated_results, mf, indent=2, ensure_ascii=False)
        except Exception:
            pass

    return separated_results
