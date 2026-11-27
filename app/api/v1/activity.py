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


def _clean_public_doc_url(raw_url: Optional[str]) -> str:
    if not raw_url:
        return ""
    norm_url = str(raw_url).replace("\\", "/").strip()
    if "/static/extracted_pages/" in norm_url:
        norm_url = norm_url.replace("/static/extracted_pages/", "/storage/separated_docs/")
    if "storage_uploads/" in norm_url:
        return "/storage/" + norm_url.split("storage_uploads/")[-1]
    if norm_url.startswith("http://") or norm_url.startswith("https://") or norm_url.startswith("/"):
        return norm_url
    return f"/storage/{norm_url}"


@router.get("/agent-wise-trace")
async def get_agent_wise_activity_trace(
    agent_id: Optional[uuid.UUID] = Query(None, description="Optional field agent UUID filter"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_ca_user),
) -> Dict[str, Any]:
    """
    Purely additive Field Agent-wise Activity Trace endpoint.
    Returns:
    1. agents: summary metrics per Field Agent (cases taken, visits completed vs pending,
       forms submitted, site photos & selfies uploaded, online status, last active time).
    2. cases_trace: per-case trace showing which agent took the case, whether attendance selfie
       was uploaded, exact Residence/Office photo slots uploaded (with preview URLs & timestamps),
       and what Due Diligence Form answers were submitted.
    3. agent_events: chronological audit trail scoped to field agents (assignments, check-ins,
       photo uploads, form submissions, logins).
    """
    from app.api.v1.cases import (
        ALL_FIELD_VISIT_DOC_TYPES,
        _field_visit_photo_exists_on_disk,
        _has_meaningful_field_form_answers,
    )
    from app.models.document import CaseDocument, DocumentType
    from app.models.user import UserRole

    # 1. Load all users (to map agent UUIDs & usernames -> full names)
    users_res = await db.execute(select(User).order_by(User.full_name))
    all_users = users_res.scalars().all()
    user_by_id: Dict[uuid.UUID, User] = {u.id: u for u in all_users}
    agent_by_alias: Dict[str, User] = {}
    field_agents: List[User] = []
    for u in all_users:
        if u.role == UserRole.FIELD_AGENT:
            field_agents.append(u)
        uname_prefix = (u.email or "").split("@")[0].strip().lower()
        if uname_prefix:
            agent_by_alias[uname_prefix] = u
        if u.full_name:
            agent_by_alias[u.full_name.strip().lower()] = u
            first_tok = u.full_name.strip().split()[0].lower()
            if first_tok not in agent_by_alias:
                agent_by_alias[first_tok] = u

    # Check active PWA sessions for online indicator
    active_sessions = _load_shared_sessions(time.time())
    online_agent_names = {
        str(s.get("user_name") or "").strip().lower()
        for s in active_sessions.values()
        if s.get("surface") == "PWA" and s.get("user_name")
    }

    # 2. Load all cases
    cases_res = await db.execute(select(LoanCase).order_by(desc(LoanCase.updated_at), desc(LoanCase.created_at)))
    all_cases = cases_res.scalars().all()
    case_by_id: Dict[uuid.UUID, LoanCase] = {c.id: c for c in all_cases}

    # 3. Load all field visit photos & attendance selfies across all cases
    case_ids = [c.id for c in all_cases]
    docs_by_case: Dict[uuid.UUID, List[CaseDocument]] = {}
    if case_ids:
        docs_res = await db.execute(
            select(CaseDocument)
            .where(
                CaseDocument.case_id.in_(case_ids),
                CaseDocument.doc_type.in_(ALL_FIELD_VISIT_DOC_TYPES),
            )
            .order_by(CaseDocument.created_at.asc())
        )
        for d in docs_res.scalars().all():
            raw_url = d.watermarked_url or d.storage_url or ""
            if not _field_visit_photo_exists_on_disk(raw_url):
                continue
            docs_by_case.setdefault(d.case_id, []).append(d)

    # 4. Load recent AuditLog entries (up to 600) to trace exact assignment, upload, and form submission times
    logs_res = await db.execute(
        select(AuditLog).order_by(desc(AuditLog.timestamp)).limit(600)
    )
    all_logs = logs_res.scalars().all()

    ACTION_LABELS = {
        "USER_LOGIN": "Logged in",
        "CASE_CREATED": "Case created",
        "CASE_UPDATED": "Case details updated",
        "CASE_DELETED": "Case deleted",
        "CASE_ASSIGNED": "Assigned case to agent",
        "FIELD_FORM_PDF_INGESTED": "Imported Google Form PDF",
        "DOCUMENT_UPLOADED": "Uploaded visit photo (PWA)",
        "AGENT_CHECK_IN": "Checked in on-site (PWA)",
        "AGENT_CHECK_OUT": "Checked out on-site (PWA)",
        "FIELD_FORM_SUBMITTED": "Submitted field visit form (PWA)",
        "APPLICANT_LOCATION_SHARED": "Shared applicant location",
    }

    def _to_utc_ts(dt_val: Optional[datetime]) -> float:
        if not dt_val:
            return 0.0
        try:
            if dt_val.tzinfo is None:
                return dt_val.replace(tzinfo=timezone.utc).timestamp()
            return dt_val.timestamp()
        except Exception:
            return 0.0

    assigned_time_by_case: Dict[uuid.UUID, datetime] = {}
    form_submit_time_by_case: Dict[uuid.UUID, datetime] = {}
    last_event_time_by_case: Dict[uuid.UUID, datetime] = {}
    latest_agent_by_case: Dict[uuid.UUID, User] = {}
    events_by_case: Dict[uuid.UUID, List[Dict[str, Any]]] = {}
    agent_events: List[Dict[str, Any]] = []
    last_active_by_agent: Dict[uuid.UUID, tuple] = {}  # agent_id -> (datetime, case_no)

    def _resolve_target_agent_from_log(log_row: AuditLog, lc: Optional[LoanCase]) -> Optional[User]:
        u = user_by_id.get(log_row.user_id)
        if u and u.role == UserRole.FIELD_AGENT:
            return u
        meta = log_row.extra_metadata if isinstance(log_row.extra_metadata, dict) else {}
        if log_row.action == "CASE_ASSIGNED":
            aid_str = str(meta.get("agent_id") or "").strip()
            if aid_str:
                try:
                    au = user_by_id.get(uuid.UUID(aid_str))
                    if au:
                        return au
                except ValueError:
                    pass
            ag_alias = str(meta.get("agent") or "").strip().lower()
            if ag_alias and ag_alias in agent_by_alias:
                return agent_by_alias[ag_alias]
        ag_name_meta = str(meta.get("agent_name") or "").strip().lower()
        if ag_name_meta and ag_name_meta in agent_by_alias:
            return agent_by_alias[ag_name_meta]
        if lc and lc.assigned_agent_id and lc.assigned_agent_id in user_by_id:
            return user_by_id[lc.assigned_agent_id]
        return None

    for log_row in all_logs:
        lc = case_by_id.get(log_row.case_id) if log_row.case_id else None
        meta = log_row.extra_metadata if isinstance(log_row.extra_metadata, dict) else {}
        actor = user_by_id.get(log_row.user_id)
        actor_name = actor.full_name if actor else (meta.get("agent_name") or "System")
        target_agent = _resolve_target_agent_from_log(log_row, lc)

        if log_row.case_id:
            if log_row.case_id not in last_event_time_by_case:
                last_event_time_by_case[log_row.case_id] = log_row.timestamp
            if target_agent and log_row.case_id not in latest_agent_by_case:
                latest_agent_by_case[log_row.case_id] = target_agent
            if log_row.action == "CASE_ASSIGNED" and log_row.case_id not in assigned_time_by_case:
                assigned_time_by_case[log_row.case_id] = log_row.timestamp
            if log_row.action in ("FIELD_FORM_SUBMITTED", "FIELD_FORM_PDF_INGESTED") and log_row.case_id not in form_submit_time_by_case:
                form_submit_time_by_case[log_row.case_id] = log_row.timestamp

        # Build human-readable details string
        if log_row.action == "CASE_ASSIGNED":
            ag_disp = target_agent.full_name if target_agent else (meta.get("agent") or "Field Agent")
            detail_str = f"Allotted to Field Agent: {ag_disp}"
        elif log_row.action == "DOCUMENT_UPLOADED":
            fname = meta.get("filename") or "photo.jpg"
            lat_v = meta.get("lat")
            lon_v = meta.get("lon")
            dist_v = meta.get("distance_m")
            gps_part = f" • GPS: {float(lat_v):.4f}°N, {float(lon_v):.4f}°E" if isinstance(lat_v, (int, float)) and isinstance(lon_v, (int, float)) else ""
            dist_part = f" ({round(float(dist_v))}m)" if isinstance(dist_v, (int, float)) else ""
            detail_str = f"Photo: {fname}{gps_part}{dist_part}"
        elif log_row.action == "FIELD_FORM_SUBMITTED":
            ag_disp = meta.get("agent_name") or actor_name
            detail_str = f"Due Diligence Questionnaire submitted by {ag_disp}"
        elif log_row.action in ("AGENT_CHECK_IN", "AGENT_CHECK_OUT"):
            lat_v = meta.get("lat")
            lon_v = meta.get("lon")
            gps_part = f" at ({float(lat_v):.4f}°N, {float(lon_v):.4f}°E)" if isinstance(lat_v, (int, float)) and isinstance(lon_v, (int, float)) else ""
            detail_str = f"{ACTION_LABELS.get(log_row.action, log_row.action)} by {actor_name}{gps_part}"
        elif log_row.action == "USER_LOGIN":
            detail_str = f"{meta.get('full_name') or actor_name} ({meta.get('role') or ''})"
        else:
            keys = [k for k in meta.keys() if k not in ("agent_id", "case_id")][:3]
            detail_str = " • ".join(f"{k}: {meta[k]}" for k in keys)

        when_str = format_ist(log_row.timestamp)
        c_no_str = (lc.case_no if lc else None) or meta.get("case_no") or "—"

        if log_row.case_id and len(events_by_case.get(log_row.case_id, [])) < 12:
            events_by_case.setdefault(log_row.case_id, []).append({
                "when_ist": when_str,
                "action": log_row.action,
                "action_label": ACTION_LABELS.get(log_row.action, log_row.action),
                "by": actor_name,
                "details": detail_str,
            })

        # Record in agent_events if performed by or assigned to a field agent
        if target_agent:
            if agent_id is None or target_agent.id == agent_id:
                agent_events.append({
                    "id": str(log_row.id),
                    "agent_id": str(target_agent.id),
                    "agent_name": target_agent.full_name,
                    "when_ist": when_str,
                    "timestamp_iso": log_row.timestamp.isoformat() if log_row.timestamp else None,
                    "action": log_row.action,
                    "action_label": ACTION_LABELS.get(log_row.action, log_row.action),
                    "by_user": actor_name,
                    "case_id": str(log_row.case_id) if log_row.case_id else None,
                    "case_no": c_no_str,
                    "applicant_name": lc.applicant_name if lc else (meta.get("applicant_name") or ""),
                    "bank_name": lc.bank_name if lc else (meta.get("bank_name") or ""),
                    "branch": lc.branch if lc else "",
                    "details": detail_str,
                })
            if target_agent.id not in last_active_by_agent:
                last_active_by_agent[target_agent.id] = (log_row.timestamp, c_no_str if c_no_str != "—" else None)

    # 5. Build per-case trace and aggregate per-agent counters
    agent_stats: Dict[uuid.UUID, Dict[str, Any]] = {}
    for ag in field_agents:
        is_on = (ag.full_name or "").strip().lower() in online_agent_names
        last_tup = last_active_by_agent.get(ag.id)
        agent_stats[ag.id] = {
            "agent_id": str(ag.id),
            "agent_name": ag.full_name,
            "username": (ag.email or "").split("@")[0],
            "designation": getattr(ag, "designation", None) or "Field Verification Officer",
            "is_online_now": is_on,
            "total_cases_taken": 0,
            "visits_completed": 0,
            "visits_pending": 0,
            "forms_submitted": 0,
            "total_photos_uploaded": 0,
            "total_selfies_uploaded": 0,
            "last_active_ist": format_ist(last_tup[0]) if last_tup and last_tup[0] else "—",
            "latest_case_no": last_tup[1] if last_tup and last_tup[1] else "—",
            "_last_ts": _to_utc_ts(last_tup[0]) if last_tup else 0.0,
        }

    cases_trace: List[Dict[str, Any]] = []

    for c in all_cases:
        # Resolve which agent owns/worked on this case
        c_agent = (user_by_id.get(c.assigned_agent_id) if c.assigned_agent_id else None) or latest_agent_by_case.get(c.id)
        ff_dict: Dict[str, Any] = {}
        if c.field_form_data:
            try:
                parsed_ff = json.loads(c.field_form_data)
                if isinstance(parsed_ff, dict):
                    ff_dict = parsed_ff
            except Exception:
                ff_dict = {}

        if not c_agent and ff_dict:
            exec_raw = str(ff_dict.get("verifier_agent_name") or ff_dict.get("executive") or "").strip().lower()
            if exec_raw:
                c_agent = agent_by_alias.get(exec_raw) or agent_by_alias.get(exec_raw.split()[0])

        c_docs = docs_by_case.get(c.id, [])

        # Separate selfie vs residence vs office vs co_office photos (deduplicated by latest slot)
        selfie_doc: Optional[CaseDocument] = None
        res_slot_map: Dict[int, CaseDocument] = {}
        work_slot_map: Dict[int, CaseDocument] = {}
        co_work_slot_map: Dict[int, CaseDocument] = {}
        res_extras: List[CaseDocument] = []
        work_extras: List[CaseDocument] = []

        for idx_d, d in enumerate(c_docs, start=1):
            dt_str = d.doc_type.value if hasattr(d.doc_type, "value") else str(d.doc_type)
            if dt_str == "AGENT_SELFIE":
                selfie_doc = d
                continue
            ocr_d = d.ocr_data if isinstance(d.ocr_data, dict) else {}
            fld = str(ocr_d.get("folder") or "").strip().lower()
            if not fld:
                if dt_str.startswith("CO_OFFICE"):
                    fld = "co_work"
                elif any(w in dt_str for w in ("OFFICE", "WORK", "FACADE", "NAMEBOARD", "DESK")):
                    fld = "work"
                else:
                    fld = "residence"
            sn_raw = ocr_d.get("slot_number")
            try:
                sn = int(sn_raw) if sn_raw is not None else None
            except (TypeError, ValueError):
                sn = None

            if fld == "co_work":
                target_slot = sn if (sn and 1 <= sn <= 4) else min(4, len(co_work_slot_map) + 1)
                co_work_slot_map[target_slot] = d
            elif fld == "work":
                if sn and sn > 4:
                    work_extras.append(d)
                else:
                    target_slot = sn if (sn and 1 <= sn <= 4) else min(4, len(work_slot_map) + 1)
                    work_slot_map[target_slot] = d
            else:
                if sn and sn > 4:
                    res_extras.append(d)
                else:
                    target_slot = sn if (sn and 1 <= sn <= 4) else min(4, len(res_slot_map) + 1)
                    res_slot_map[target_slot] = d

        def _fmt_slot_item(slot_no: int, doc_obj: CaseDocument, folder_label: str) -> Dict[str, Any]:
            ocr_d = doc_obj.ocr_data if isinstance(doc_obj.ocr_data, dict) else {}
            url_clean = _clean_public_doc_url(doc_obj.watermarked_url or doc_obj.storage_url)
            return {
                "slot": slot_no,
                "folder": folder_label,
                "doc_type": doc_obj.doc_type.value if hasattr(doc_obj.doc_type, "value") else str(doc_obj.doc_type),
                "url": url_clean,
                "thumb_url": f"/api/v1/cases/thumb?u={url_clean}&w=160" if url_clean.startswith("/storage/") else url_clean,
                "filename": ocr_d.get("original_filename") or os.path.basename(url_clean) or f"Slot_{slot_no}.jpg",
                "captured_at_ist": format_ist(doc_obj.created_at),
                "distance_m": round(doc_obj.distance_from_target) if isinstance(doc_obj.distance_from_target, (int, float)) else None,
                "geofence_valid": doc_obj.is_geofence_valid,
            }

        res_slots_list = [_fmt_slot_item(s, res_slot_map[s], "Residence") for s in sorted(res_slot_map.keys())]
        work_slots_list = [_fmt_slot_item(s, work_slot_map[s], "Office") for s in sorted(work_slot_map.keys())]
        co_work_slots_list = [_fmt_slot_item(s, co_work_slot_map[s], "Co-App Office") for s in sorted(co_work_slot_map.keys())]

        total_site_photos = (
            len(res_slots_list)
            + len(work_slots_list)
            + len(co_work_slots_list)
            + len(res_extras)
            + len(work_extras)
        )
        latest_photo_doc = c_docs[-1] if c_docs else None

        # Form submission details
        has_form = _has_meaningful_field_form_answers(ff_dict)
        off_d = ff_dict.get("office_details") if isinstance(ff_dict.get("office_details"), dict) else {}
        neigh_list = [str(ff_dict.get("neighbour_1") or "").strip(), str(ff_dict.get("neighbour_2") or "").strip()]
        neigh_joined = " • ".join([n for n in neigh_list if n])
        fam_list = ff_dict.get("family_members") if isinstance(ff_dict.get("family_members"), list) else []
        form_dt = form_submit_time_by_case.get(c.id) or (c.updated_at if has_form else None)
        form_source = "Google Form PDF" if ff_dict.get("form_person_name") or ff_dict.get("_forms_merged_count") else "PWA Field Form"

        selfie_url = _clean_public_doc_url(selfie_doc.watermarked_url or selfie_doc.storage_url) if selfie_doc else ""
        selfie_info = {
            "uploaded": bool(selfie_doc),
            "url": selfie_url,
            "thumb_url": f"/api/v1/cases/thumb?u={selfie_url}&w=160" if selfie_url.startswith("/storage/") else selfie_url,
            "captured_at_ist": format_ist(selfie_doc.created_at) if selfie_doc else None,
            "latitude": selfie_doc.latitude if selfie_doc else None,
            "longitude": selfie_doc.longitude if selfie_doc else None,
            "distance_m": round(selfie_doc.distance_from_target) if (selfie_doc and isinstance(selfie_doc.distance_from_target, (int, float))) else None,
        }

        st_val = c.status.value if hasattr(c.status, "value") else str(c.status or "DRAFT")
        is_visit_done = (total_site_photos > 0) or (st_val == "CERTIFIED")

        # Update per-agent summary counters
        if c_agent and c_agent.id in agent_stats:
            st_ag = agent_stats[c_agent.id]
            st_ag["total_cases_taken"] += 1
            if is_visit_done:
                st_ag["visits_completed"] += 1
            else:
                st_ag["visits_pending"] += 1
            if has_form:
                st_ag["forms_submitted"] += 1
            st_ag["total_photos_uploaded"] += total_site_photos
            if selfie_doc:
                st_ag["total_selfies_uploaded"] += 1

            cand_dt = (
                (latest_photo_doc.created_at if latest_photo_doc else None)
                or last_event_time_by_case.get(c.id)
                or c.updated_at
                or c.created_at
            )
            cand_ts = _to_utc_ts(cand_dt)
            prev_ts = float(st_ag.get("_last_ts") or 0.0)
            if cand_dt and cand_ts > prev_ts:
                st_ag["_last_ts"] = cand_ts
                st_ag["last_active_ist"] = format_ist(cand_dt)
                st_ag["latest_case_no"] = c.case_no

        # Filter cases_trace by agent_id if requested
        if agent_id is not None:
            if not c_agent or c_agent.id != agent_id:
                continue

        assigned_dt = assigned_time_by_case.get(c.id) or c.created_at
        last_act_dt = (
            (latest_photo_doc.created_at if latest_photo_doc else None)
            or last_event_time_by_case.get(c.id)
            or c.updated_at
            or c.created_at
        )

        cases_trace.append({
            "case_id": str(c.id),
            "case_no": c.case_no,
            "applicant_name": c.applicant_name,
            "co_applicant_name": c.co_applicant_name or "",
            "bank_name": c.bank_name,
            "branch": c.branch or "",
            "loan_type": c.loan_type or "Loan",
            "loan_amount": c.loan_amount,
            "target_address": c.target_address or "",
            "status": st_val,
            "is_visit_done": is_visit_done,
            "agent_id": str(c_agent.id) if c_agent else None,
            "agent_name": c_agent.full_name if c_agent else "Not Yet Allotted",
            "assigned_at_ist": format_ist(assigned_dt) if c_agent else "Not Allotted",
            "last_activity_ist": format_ist(last_act_dt),
            "last_activity_ts": _to_utc_ts(last_act_dt),
            "selfie": selfie_info,
            "photos": {
                "total_site_photos": total_site_photos,
                "residence_count": len(res_slots_list),
                "residence_extra_count": len(res_extras),
                "work_count": len(work_slots_list),
                "work_extra_count": len(work_extras),
                "co_work_count": len(co_work_slots_list),
                "residence_slots": res_slots_list,
                "work_slots": work_slots_list,
                "co_work_slots": co_work_slots_list,
                "latest_photo_at_ist": format_ist(latest_photo_doc.created_at) if latest_photo_doc else None,
            },
            "form": {
                "submitted": has_form,
                "submitted_at_ist": format_ist(form_dt) if (has_form and form_dt) else None,
                "source": form_source if has_form else None,
                "person_met": str(ff_dict.get("person_met") or "").strip() if has_form else "",
                "period_of_stay": str(ff_dict.get("period_of_stay") or "").strip() if has_form else "",
                "ownership": str(ff_dict.get("ownership") or "").strip() if has_form else "",
                "building_type": str(ff_dict.get("building_type") or "").strip() if has_form else "",
                "neighbours": neigh_joined if has_form else "",
                "occupation": str(ff_dict.get("occupation") or off_d.get("occupation") or "").strip() if has_form else "",
                "firm_name": str(off_d.get("firm_name") or "").strip() if has_form else "",
                "designation": str(off_d.get("position") or off_d.get("designation") or "").strip() if has_form else "",
                "office_address": str(off_d.get("address") or c.office_address or "").strip() if has_form else "",
                "family_count": len(fam_list) if has_form else 0,
            },
            "recent_events": events_by_case.get(c.id, []),
        })

    cases_trace.sort(key=lambda x: x.get("last_activity_ts") or 0, reverse=True)
    agents_out = []
    for ag_info in agent_stats.values():
        ag_copy = dict(ag_info)
        ag_copy.pop("_last_ts", None)
        agents_out.append(ag_copy)
    agents_out.sort(key=lambda a: (a["total_cases_taken"], a["total_photos_uploaded"]), reverse=True)

    return {
        "agents": agents_out,
        "cases_trace": cases_trace,
        "agent_events": agent_events,
    }

