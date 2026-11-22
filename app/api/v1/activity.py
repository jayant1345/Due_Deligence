import time
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, Query, Request
from pydantic import BaseModel
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_ca_user, get_optional_current_user
from app.core.database import get_db
from app.core.timezone import format_ist
from app.models.loan_case import LoanCase
from app.models.report import AuditLog
from app.models.user import User

router = APIRouter(prefix="/activity-log", tags=["Activity & Audit Log"])

# Purely additive in-memory active session registry (Dashboard & Mobile PWA).
# Keyed by unique browser/device session_id; automatically expires entries idle > 120 seconds.
_ACTIVE_SESSIONS: Dict[str, Dict[str, Any]] = {}
SESSION_TTL_SECONDS = 120.0


def _extract_client_ip(request: Request) -> str:
    xff = request.headers.get("x-forwarded-for")
    if xff:
        first_ip = xff.split(",")[0].strip()
        if first_ip:
            return first_ip
    xri = request.headers.get("x-real-ip")
    if xri and xri.strip():
        return xri.strip()
    if request.client and request.client.host:
        return request.client.host
    return "127.0.0.1"


def _prune_stale_sessions(now_ts: float) -> None:
    stale_keys = [
        sid for sid, info in list(_ACTIVE_SESSIONS.items())
        if (now_ts - float(info.get("last_active_ts") or 0.0)) > SESSION_TTL_SECONDS
    ]
    for sid in stale_keys:
        _ACTIVE_SESSIONS.pop(sid, None)


class SessionHeartbeatRequest(BaseModel):
    session_id: str
    surface: str = "DASHBOARD"  # "DASHBOARD" or "PWA"
    user_name: Optional[str] = None
    role: Optional[str] = None
    active_case_no: Optional[str] = None
    started_at_iso: Optional[str] = None


@router.post("/heartbeat")
async def record_session_heartbeat(
    req: SessionHeartbeatRequest,
    request: Request,
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    """
    Lightweight, non-blocking heartbeat from open CA Dashboard and Field Agent PWA tabs.
    Tracks active connected sessions, IP address, session start time, and last active time.
    """
    now_ts = time.time()
    now_dt = datetime.now(timezone.utc)
    _prune_stale_sessions(now_ts)

    sid = (req.session_id or "").strip()[:80] or str(uuid.uuid4())
    surface = "PWA" if (req.surface or "").upper() == "PWA" else "DASHBOARD"
    ip_addr = _extract_client_ip(request)

    resolved_name = (
        (current_user.full_name if current_user else None)
        or (req.user_name or "").strip()
        or ("Field Agent (PWA)" if surface == "PWA" else "CA Pranav N. Shah (Sr. Partner)")
    )
    resolved_role = (
        (current_user.role.value if current_user and hasattr(current_user.role, "value") else None)
        or (req.role or "").strip()
        or ("FIELD_AGENT" if surface == "PWA" else "SUPER_ADMIN")
    )

    existing = _ACTIVE_SESSIONS.get(sid)
    if existing:
        started_dt = existing["started_dt"]
        started_ts = existing["started_ts"]
    else:
        started_dt = now_dt
        if req.started_at_iso:
            try:
                parsed = datetime.fromisoformat(req.started_at_iso.replace("Z", "+00:00"))
                if parsed.tzinfo is None:
                    parsed = parsed.replace(tzinfo=timezone.utc)
                started_dt = parsed
            except Exception:
                started_dt = now_dt
        started_ts = started_dt.timestamp()

    _ACTIVE_SESSIONS[sid] = {
        "session_id": sid,
        "surface": surface,
        "user_name": resolved_name,
        "role": resolved_role,
        "ip_address": ip_addr,
        "active_case_no": (req.active_case_no or "").strip() or None,
        "started_dt": started_dt,
        "started_ts": started_ts,
        "last_active_dt": now_dt,
        "last_active_ts": now_ts,
    }
    return {
        "status": "ok",
        "active_count": len(_ACTIVE_SESSIONS),
    }


@router.get("/active-sessions")
async def get_active_sessions(
    request: Request,
    session_id: Optional[str] = Query(None, description="Caller's session_id to highlight with 'You' badge"),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    """
    Return all currently connected Dashboard & Mobile PWA sessions, ordered by login start time.
    """
    now_ts = time.time()
    now_dt = datetime.now(timezone.utc)
    _prune_stale_sessions(now_ts)

    caller_ip = _extract_client_ip(request)
    caller_sid = (session_id or "").strip()

    # If the caller hasn't registered a heartbeat yet, register their current dashboard session immediately
    if caller_sid and caller_sid not in _ACTIVE_SESSIONS:
        _ACTIVE_SESSIONS[caller_sid] = {
            "session_id": caller_sid,
            "surface": "DASHBOARD",
            "user_name": current_user.full_name if current_user else "CA Pranav N. Shah (Sr. Partner)",
            "role": current_user.role.value if (current_user and hasattr(current_user.role, "value")) else "SUPER_ADMIN",
            "ip_address": caller_ip,
            "active_case_no": None,
            "started_dt": now_dt,
            "started_ts": now_ts,
            "last_active_dt": now_dt,
            "last_active_ts": now_ts,
        }

    ordered = sorted(_ACTIVE_SESSIONS.values(), key=lambda x: x.get("started_ts", 0.0))
    sessions_out = []
    dashboard_count = 0
    pwa_count = 0

    for idx, s in enumerate(ordered, start=1):
        surf = s.get("surface", "DASHBOARD")
        if surf == "PWA":
            pwa_count += 1
        else:
            dashboard_count += 1
        is_you = (bool(caller_sid) and s.get("session_id") == caller_sid)
        sessions_out.append({
            "index": idx,
            "session_id": s.get("session_id"),
            "surface": surf,
            "user_name": s.get("user_name"),
            "role": s.get("role"),
            "ip_address": s.get("ip_address") or caller_ip,
            "active_case_no": s.get("active_case_no"),
            "logged_in_at": format_ist(s.get("started_dt"), "%d %b %Y %I:%M %p"),
            "last_active": format_ist(s.get("last_active_dt"), "%I:%M:%S %p"),
            "is_you": is_you,
        })

    return {
        "total_active": len(sessions_out),
        "dashboard_active": dashboard_count,
        "pwa_active": pwa_count,
        "sessions": sessions_out,
    }


class ActivityLogEntry(BaseModel):
    id: uuid.UUID
    timestamp: datetime
    action: str
    user_id: uuid.UUID
    user_name: Optional[str] = None
    case_id: Optional[uuid.UUID] = None
    case_no: Optional[str] = None
    extra_metadata: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


@router.get("", response_model=List[ActivityLogEntry])
async def list_activity_log(
    case_id: Optional[uuid.UUID] = Query(None, description="Filter to one case"),
    user_id: Optional[uuid.UUID] = Query(None, description="Filter to one user/agent"),
    action: Optional[str] = Query(None, description="Filter to one action type, e.g. CASE_DELETED"),
    limit: int = Query(200, ge=1, le=1000),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_ca_user),
):
    """
    Real activity/audit trail across both the CA dashboard and the field agent PWA - every
    login, case create/update/delete/assign, document ingest/upload/delete, field visit
    check-in/out and form submission is recorded here with who did it and when, regardless of
    which surface (dashboard or PWA) the action came from.
    """
    query = select(AuditLog, LoanCase.case_no, User.full_name).join(
        User, AuditLog.user_id == User.id, isouter=True
    ).join(
        LoanCase, AuditLog.case_id == LoanCase.id, isouter=True
    ).order_by(desc(AuditLog.timestamp)).limit(limit)

    if case_id:
        query = query.where(AuditLog.case_id == case_id)
    if user_id:
        query = query.where(AuditLog.user_id == user_id)
    if action:
        query = query.where(AuditLog.action == action)

    result = await db.execute(query)
    rows = result.all()

    entries = []
    for log, case_no, user_name in rows:
        # A deleted case's own case_no no longer joins (the row is gone) - fall back to what
        # was captured in extra_metadata at the moment of deletion, so the trail stays readable.
        resolved_case_no = case_no or (log.extra_metadata or {}).get("case_no")
        entries.append(ActivityLogEntry(
            id=log.id,
            timestamp=log.timestamp,
            action=log.action,
            user_id=log.user_id,
            user_name=user_name,
            case_id=log.case_id,
            case_no=resolved_case_no,
            extra_metadata=log.extra_metadata,
        ))
    return entries
