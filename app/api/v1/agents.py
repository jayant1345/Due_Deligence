import re
import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import hash_password
from app.models.loan_case import LoanCase
from app.models.user import User, UserRole

router = APIRouter(prefix="/agents", tags=["Field Staff & Agent Management"])


class QuickAgentCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150, description="Full Name of Field Agent")
    phone: str = Field(..., min_length=8, max_length=20, description="WhatsApp or Mobile Number")
    username: Optional[str] = Field(None, max_length=50, description="Optional custom login username")
    password: Optional[str] = Field(None, min_length=4, max_length=50, description="Optional custom password")
    designation: Optional[str] = Field("Field Verification Officer", max_length=100)


class AgentItemResponse(BaseModel):
    id: str
    full_name: str
    phone: Optional[str] = ""
    username: str
    designation: str = "Field Staff"
    active_cases_count: int = 0
    is_dummy: bool = False
    created_at: Optional[str] = None


@router.get("", response_model=List[AgentItemResponse])
async def list_field_agents(db: AsyncSession = Depends(get_db)):
    """List all active field agents registered in the system with their active case load."""
    query = (
        select(User)
        .where(User.role == UserRole.FIELD_AGENT, User.is_active == True)
        .order_by(User.created_at.desc())
    )
    result = await db.execute(query)
    agents = result.scalars().all()

    response = []
    for agent in agents:
        # Count active assigned cases
        cnt_res = await db.execute(
            select(func.count(LoanCase.id)).where(LoanCase.assigned_agent_id == agent.id)
        )
        case_cnt = cnt_res.scalar() or 0

        is_dummy = (
            agent.email.lower() in ["agent1", "agent2", "agent.rajesh@valuexca.com", "agent1@valuexca.com"]
            or "rajesh varma" in (agent.full_name or "").lower()
        )

        response.append(
            AgentItemResponse(
                id=str(agent.id),
                full_name=agent.full_name,
                phone=agent.phone or "",
                username=agent.email,
                designation="Field Verification Officer",
                active_cases_count=case_cnt,
                is_dummy=is_dummy,
                created_at=agent.created_at.strftime("%d-%m-%Y") if agent.created_at else None,
            )
        )
    return response


@router.post("/quick-register")
async def quick_register_field_agent(
    req: QuickAgentCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    1-Click Registration for Real Field Agents.
    Takes minimal information (Full Name & WhatsApp Number).
    Auto-generates clean username and simple password if not provided.
    """
    raw_name = req.full_name.strip()
    raw_phone = req.phone.strip()

    # Format phone with +91 if 10-digit Indian number
    digits = re.sub(r"\D", "", raw_phone)
    if len(digits) == 10:
        formatted_phone = f"+91 {digits[:5]} {digits[5:]}"
    elif raw_phone.startswith("+"):
        formatted_phone = raw_phone
    else:
        formatted_phone = f"+91 {digits}"

    # Determine username
    if req.username and req.username.strip():
        base_username = re.sub(r"[^a-zA-Z0-9_.-]", "", req.username.strip().lower())
    else:
        # Auto-generate from first name or phone
        name_parts = re.sub(r"[^a-zA-Z0-9]", "", raw_name.split()[0].lower())
        base_username = name_parts if len(name_parts) >= 3 else f"agent{digits[-4:] if len(digits)>=4 else '01'}"

    # Ensure uniqueness of username (User.email)
    candidate_username = base_username
    suffix = 1
    while True:
        existing = await db.execute(select(User).where(User.email == candidate_username))
        if not existing.scalar_one_or_none():
            break
        suffix += 1
        candidate_username = f"{base_username}{suffix}"

    final_username = candidate_username

    # Determine password
    if req.password and req.password.strip():
        final_password = req.password.strip()
    else:
        # Super easy standard login password for field staff: e.g. 'ramesh@123'
        final_password = f"{final_username}@123"

    new_agent = User(
        email=final_username,
        hashed_password=hash_password(final_password),
        full_name=raw_name,
        phone=formatted_phone,
        role=UserRole.FIELD_AGENT,
        is_active=True,
    )
    db.add(new_agent)
    await db.commit()
    await db.refresh(new_agent)

    return {
        "success": True,
        "id": str(new_agent.id),
        "full_name": new_agent.full_name,
        "phone": new_agent.phone,
        "username": final_username,
        "password": final_password,
        "message": f"Field Agent '{raw_name}' registered successfully!",
    }


@router.delete("/{agent_id}")
async def delete_field_agent(
    agent_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Remove or deactivate a field agent (e.g. remove dummy seeded agent1/Rajesh Varma).
    Unassigns any cases assigned to them so case records remain safe.
    """
    # Find agent by UUID or username
    agent = None
    try:
        agent_uuid = uuid.UUID(agent_id)
        res = await db.execute(select(User).where(User.id == agent_uuid))
        agent = res.scalar_one_or_none()
    except (ValueError, AttributeError):
        pass

    if not agent:
        res = await db.execute(select(User).where(User.email == agent_id.strip()))
        agent = res.scalar_one_or_none()

    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Field Agent '{agent_id}' not found",
        )

    target_id = agent.id
    target_name = agent.full_name

    # 1. Unassign any cases assigned to this agent
    await db.execute(
        update(LoanCase)
        .where(LoanCase.assigned_agent_id == target_id)
        .values(assigned_agent_id=None)
    )

    # 2. Safely deactivate agent and change email so username is freed up
    # Direct SQL update guarantees no foreign key errors from past audit logs
    ts = int(datetime.utcnow().timestamp())
    await db.execute(
        update(User)
        .where(User.id == target_id)
        .values(
            is_active=False,
            email=f"removed_{str(target_id)[:8]}_{ts}",
        )
    )
    await db.commit()

    return {
        "success": True,
        "message": f"Agent '{target_name}' was removed successfully.",
    }


@router.post("/{agent_id}/reset-password")
async def reset_agent_password(
    agent_id: str,
    db: AsyncSession = Depends(get_db),
):
    """1-Click Reset agent password to default <username>@123."""
    agent = None
    try:
        agent_uuid = uuid.UUID(agent_id)
        res = await db.execute(select(User).where(User.id == agent_uuid))
        agent = res.scalar_one_or_none()
    except Exception:
        pass

    if not agent:
        res = await db.execute(select(User).where(User.email == agent_id.strip()))
        agent = res.scalar_one_or_none()

    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    new_pass = f"{agent.email}@123"
    agent.hashed_password = hash_password(new_pass)
    await db.commit()

    return {
        "success": True,
        "username": agent.email,
        "new_password": new_pass,
        "message": f"Password for {agent.full_name} reset to: {new_pass}",
    }
