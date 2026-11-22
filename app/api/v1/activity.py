import json
import os
import re
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

# Shared file-backed active session registry across all Gunicorn worker processes (WEB_CONCURRENCY=4).
# Storing in a single JSON file on disk ensures Worker 1..4 all see every connected Dashboard & PWA user,
# and passive API requests (from already-open tabs before a refresh) are also captured automatically.
_SESSIONS_FILE_PATH = os.path.join("storage_uploads", "_live_active_sessions.json")
SESSION_TTL_SECONDS = 300.0  # 5 minutes active window


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


def _load_shared_sessions(now_ts: float) -> Dict[str, Dict[str, Any]]:
    data: Dict[str, Dict[str, Any]] = {}
    try:
        if os.path.exists(_SESSIONS_FILE_PATH):
            with open(_SESSIONS_FILE_PATH, "r", encoding="utf-8") as f:
                raw = json.load(f)
                if isinstance(raw, dict):
                    data = raw
    except Exception:
        data = {}
    # Prune sessions idle longer than SESSION_TTL_SECONDS
    valid: Dict[str, Dict[str, Any]] = {}
    for sid, info in data.items():
        if not isinstance(info, dict):
            continue
        last_ts = float(info.get("last_active_ts") or 0.0)
        if (now_ts - last_ts) <= SESSION_TTL_SECONDS:
            valid[sid] = info
    return valid


def _save_shared_sessions(sessions: Dict[str, Dict[str, Any]]) -> None:
    try:
        os.makedirs(os.path.dirname(_SESSIONS_FILE_PATH), exist_ok=True)
        tmp_path = f"{_SESSIONS_FILE_PATH}.{os.getpid()}.tmp"
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(sessions, f)
        os.replace(tmp_path, _SESSIONS_FILE_PATH)
    except Exception:
        pass


def touch_passive_request_session(request: Request) -> None:
    """
    Called passively on any /api/v1/* request so even a colleague or field agent whose browser
    tab was opened BEFORE this deploy (and hasn't refreshed their page yet) immediately shows up
    in Live Active Sessions with their IP address, surface (Dashboard vs PWA), and last active time.
    """
    try:
        path = request.url.path or ""
        if path.endswith("/heartbeat") or path.endswith("/active-sessions"):
            return
        if not path.startswith("/api/v1/"):
            return

        now_ts = time.time()
        now_dt = datetime.now(timezone.utc)
        ip_addr = _extract_client_ip(request)
        ua = (request.headers.get("user-agent") or "")[:120]
        referer = (request.headers.get("referer") or "").lower()

        is_pwa = ("/pwa" in referer) or ("/visits" in path) or ("/agent" in path) or ("mobile" in ua.lower() and "/portal" not in referer)
        surface = "PWA" if is_pwa else "DASHBOARD"

        # If this IP already has an explicit heartbeat session for the same surface, update its last_active
        sessions = _load_shared_sessions(now_ts)
        matched_sid = None
        for sid, info in sessions.items():
            if info.get("ip_address") == ip_addr and info.get("surface") == surface:
                matched_sid = sid
                break

        # Extract case ID/number hint if present in path
        m_case = re.search(r"/cases/([^/?#]+)", path)
        case_hint = m_case.group(1)[:24] if m_case else None

        if matched_sid:
            entry = sessions[matched_sid]
            entry["last_active_ts"] = now_ts
            entry["last_active_iso"] = now_dt.isoformat()
            if case_hint and not entry.get("active_case_no") and not re.fullmatch(r"[0-9a-f\-]{32,36}", case_hint, re.I):
                entry["active_case_no"] = case_hint
        else:
            passive_sid = f"ip-{surface.lower()}-{ip_addr}"
            existing = sessions.get(passive_sid)
            started_iso = existing.get("started_iso") if existing else now_dt.isoformat()
            started_ts = float(existing.get("started_ts") or now_ts) if existing else now_ts
            sessions[passive_sid] = {
                "session_id": passive_sid,
                "surface": surface,
                "user_name": existing.get("user_name") if existing else ("Field Agent (PWA)" if surface == "PWA" else "CA Pranav N. Shah (Sr. Partner)"),
                "role": existing.get("role") if existing else ("FIELD_AGENT" if surface == "PWA" else "SUPER_ADMIN"),
                "ip_address": ip_addr,
                "active_case_no": existing.get("active_case_no") if existing else None,
                "started_iso": started_iso,
                "started_ts": started_ts,
                "last_active_iso": now_dt.isoformat(),
                "last_active_ts": now_ts,
            }
        _save_shared_sessions(sessions)
    except Exception:
        pass


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
    Shared across all Gunicorn workers via storage_uploads/_live_active_sessions.json.
    """
    now_ts = time.time()
    now_dt = datetime.now(timezone.utc)
    sessions = _load_shared_sessions(now_ts)

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

    # Remove any passive IP placeholder for this same IP + surface once real heartbeat arrives
    passive_sid = f"ip-{surface.lower()}-{ip_addr}"
    passive_entry = sessions.pop(passive_sid, None) if sid != passive_sid else None

    existing = sessions.get(sid) or passive_entry
    if existing and existing.get("started_iso"):
        started_iso = existing["started_iso"]
        started_ts = float(existing.get("started_ts") or now_ts)
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
        started_iso = started_dt.isoformat()
        started_ts = started_dt.timestamp()

    sessions[sid] = {
        "session_id": sid,
        "surface": surface,
        "user_name": resolved_name,
        "role": resolved_role,
        "ip_address": ip_addr,
        "active_case_no": (req.active_case_no or "").strip() or (existing.get("active_case_no") if existing else None),
        "started_iso": started_iso,
        "started_ts": started_ts,
        "last_active_iso": now_dt.isoformat(),
        "last_active_ts": now_ts,
    }
    _save_shared_sessions(sessions)
    return {
        "status": "ok",
        "active_count": len(sessions),
    }


def _parse_iso_dt(iso_str: Optional[str]) -> datetime:
    if iso_str:
        try:
            dt = datetime.fromisoformat(str(iso_str).replace("Z", "+00:00"))
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except Exception:
            pass
    return datetime.now(timezone.utc)


@router.get("/active-sessions")
async def get_active_sessions(
    request: Request,
    session_id: Optional[str] = Query(None, description="Caller's session_id to highlight with 'You' badge"),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    """
    Return all currently connected Dashboard & Mobile PWA sessions across all Gunicorn worker processes.
    """
    now_ts = time.time()
    now_dt = datetime.now(timezone.utc)
    sessions = _load_shared_sessions(now_ts)

    caller_ip = _extract_client_ip(request)
    caller_sid = (session_id or "").strip()

    if caller_sid and caller_sid not in sessions:
        sessions[caller_sid] = {
            "session_id": caller_sid,
            "surface": "DASHBOARD",
            "user_name": current_user.full_name if current_user else "CA Pranav N. Shah (Sr. Partner)",
            "role": current_user.role.value if (current_user and hasattr(current_user.role, "value")) else "SUPER_ADMIN",
            "ip_address": caller_ip,
            "active_case_no": None,
            "started_iso": now_dt.isoformat(),
            "started_ts": now_ts,
            "last_active_iso": now_dt.isoformat(),
            "last_active_ts": now_ts,
        }
        _save_shared_sessions(sessions)

    ordered = sorted(sessions.values(), key=lambda x: float(x.get("started_ts") or 0.0))
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
        s_dt = _parse_iso_dt(s.get("started_iso"))
        l_dt = _parse_iso_dt(s.get("last_active_iso"))
        sessions_out.append({
            "index": idx,
            "session_id": s.get("session_id"),
            "surface": surf,
            "user_name": s.get("user_name"),
            "role": s.get("role"),
            "ip_address": s.get("ip_address") or caller_ip,
            "active_case_no": s.get("active_case_no"),
            "logged_in_at": format_ist(s_dt, "%d %b %Y %I:%M %p"),
            "last_active": format_ist(l_dt, "%I:%M:%S %p"),
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
