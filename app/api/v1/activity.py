import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_ca_user
from app.core.database import get_db
from app.models.loan_case import LoanCase
from app.models.report import AuditLog
from app.models.user import User

router = APIRouter(prefix="/activity-log", tags=["Activity & Audit Log"])


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
