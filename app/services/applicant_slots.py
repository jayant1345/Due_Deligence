"""Single source of truth for the fixed multi-applicant business rule.

Bank rule (confirmed against all CA-office example cases, 2/3/4/5 applicants):
- Applicants 1 & 2 always require a home visit AND an office visit.
- Applicants 3, 4, 5 (whichever exist) require only a home visit - no office.
"""
import json
from typing import Dict, List, Optional

MAX_APPLICANT_SLOTS = 5


def office_required(slot: int) -> bool:
    return slot in (1, 2)


def parse_home_sharing(raw: Optional[str]) -> Dict[int, int]:
    """Parses applicant_home_sharing JSON text into {slot: shares_with_slot}."""
    if not raw:
        return {}
    try:
        data = json.loads(raw)
        return {int(k): int(v) for k, v in data.items()}
    except (ValueError, TypeError, AttributeError):
        return {}


def serialize_home_sharing(mapping: Dict[int, int]) -> Optional[str]:
    if not mapping:
        return None
    return json.dumps({str(k): str(v) for k, v in mapping.items()})


def home_group_for_slot(slot: int, sharing: Dict[int, int]) -> int:
    """Resolves which slot's home-visit/photo set this slot actually uses (follows chains)."""
    seen = set()
    cur = slot
    while cur in sharing and cur not in seen:
        seen.add(cur)
        cur = sharing[cur]
    return cur


def applicant_slots_for_case(case) -> List[dict]:
    """Returns configured applicant slots (name/phone present) for a LoanCase ORM object.

    Slot 1 and 2 read from the existing applicant_name/co_applicant_name columns (no
    rename, to avoid touching every other file that already reads those names).
    """
    sharing = parse_home_sharing(getattr(case, "applicant_home_sharing", None))
    raw_slots = [
        (1, getattr(case, "applicant_name", None), getattr(case, "applicant_phone", None)),
        (2, getattr(case, "co_applicant_name", None), getattr(case, "co_applicant_phone", None)),
        (3, getattr(case, "applicant_3_name", None), getattr(case, "applicant_3_phone", None)),
        (4, getattr(case, "applicant_4_name", None), getattr(case, "applicant_4_phone", None)),
        (5, getattr(case, "applicant_5_name", None), getattr(case, "applicant_5_phone", None)),
    ]
    slots = []
    for slot, name, phone in raw_slots:
        if not name or not str(name).strip():
            continue
        slots.append({
            "slot": slot,
            "name": name,
            "phone": phone,
            "office_required": office_required(slot),
            "home_group": home_group_for_slot(slot, sharing),
        })
    return slots
