"""Shared IST (Asia/Kolkata) time helpers.

Every stored timestamp in this app is UTC (TimestampMixin uses
datetime.now(timezone.utc)). Several display spots used to call
dt.strftime("...IST") directly on that raw UTC value - correct digits,
wrong label, off by the +5:30 offset. Use format_ist() everywhere a
timestamp is shown to a CA/agent as IST.
"""
from datetime import datetime, timedelta, timezone

try:
    import zoneinfo
    IST = zoneinfo.ZoneInfo("Asia/Kolkata")
except Exception:
    IST = timezone(timedelta(hours=5, minutes=30))


def to_ist(dt: datetime) -> datetime:
    """Convert a (naive-UTC or tz-aware) datetime to Asia/Kolkata."""
    if dt is None:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(IST)


def format_ist(dt: datetime, fmt: str = "%d-%b-%Y, %H:%M") -> str:
    """Format a datetime in IST, appending ' IST'. Returns None if dt is None."""
    if dt is None:
        return None
    return to_ist(dt).strftime(fmt) + " IST"
