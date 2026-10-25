import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user, require_role
from app.core.database import get_db
from app.models.document import CaseDocument
from app.models.loan_case import CaseStatus, LoanCase
from app.models.report import AuditLog
from app.models.user import User, UserRole
from app.schemas.loan_case import CaseCreate, CaseResponse, CaseUpdate

router = APIRouter(prefix="/cases", tags=["Case Management & Allocation"])


@router.get("", response_model=List[CaseResponse])
async def list_cases(
    status_filter: Optional[CaseStatus] = Query(None, alias="status"),
    bank_name: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List loan verification cases.
    - FIELD_AGENT sees only cases assigned to them.
    - CA_VERIFIER and SUPER_ADMIN see all cases.
    """
    query = select(LoanCase).order_by(desc(LoanCase.created_at))

    if current_user.role == UserRole.FIELD_AGENT:
        query = query.where(LoanCase.assigned_agent_id == current_user.id)

    if status_filter:
        query = query.where(LoanCase.status == status_filter)

    if bank_name:
        query = query.where(LoanCase.bank_name.ilike(f"%{bank_name}%"))

    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=CaseResponse, status_code=status.HTTP_201_CREATED)
async def create_case(
    req: CaseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.CA_VERIFIER, UserRole.SUPER_ADMIN)),
):
    """Create a new CPV verification case."""
    # Check for duplicate case_no
    existing = await db.execute(select(LoanCase).where(LoanCase.case_no == req.case_no.strip()))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Case number '{req.case_no}' already exists in system.",
        )

    initial_status = CaseStatus.ASSIGNED if req.assigned_agent_id else CaseStatus.DRAFT

    loan_case = LoanCase(
        case_no=req.case_no.strip(),
        bank_name=req.bank_name.strip(),
        branch=req.branch,
        applicant_name=req.applicant_name.strip(),
        applicant_phone=req.applicant_phone.strip(),
        loan_type=req.loan_type.strip(),
        loan_amount=req.loan_amount,
        target_address=req.target_address.strip(),
        target_lat=req.target_lat,
        target_lon=req.target_lon,
        status=initial_status,
        assigned_agent_id=req.assigned_agent_id,
        created_by_id=current_user.id,
    )
    db.add(loan_case)
    await db.flush()

    # Create audit log
    audit = AuditLog(
        case_id=loan_case.id,
        user_id=current_user.id,
        action="CASE_CREATED",
        extra_metadata={
            "case_no": loan_case.case_no,
            "bank_name": loan_case.bank_name,
            "status": loan_case.status.value,
        },
    )
    db.add(audit)
    await db.commit()
    await db.refresh(loan_case)
    return loan_case


@router.get("/{case_id}", response_model=CaseResponse)
async def get_case_detail(
    case_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve details for a single loan case."""
    query = select(LoanCase).where(LoanCase.id == case_id)
    result = await db.execute(query)
    loan_case = result.scalar_one_or_none()

    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found")

    if current_user.role == UserRole.FIELD_AGENT and loan_case.assigned_agent_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to this case.")

    return loan_case


@router.patch("/{case_id}", response_model=CaseResponse)
async def update_case(
    case_id: uuid.UUID,
    req: CaseUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.CA_VERIFIER, UserRole.SUPER_ADMIN)),
):
    """Update case status, parameters, or reassign field agent."""
    query = select(LoanCase).where(LoanCase.id == case_id)
    result = await db.execute(query)
    loan_case = result.scalar_one_or_none()

    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found")

    update_data = req.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(loan_case, field, val)

    audit = AuditLog(
        case_id=loan_case.id,
        user_id=current_user.id,
        action="CASE_UPDATED",
        extra_metadata=update_data,
    )
    db.add(audit)
    await db.commit()
    await db.refresh(loan_case)
    return loan_case


@router.get("/{case_id}/documents")
async def list_case_documents(
    case_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve all uploaded physical inspection photos and documents for a loan case.
    Publicly accessible to allow real-time display and auto-sync on CA desktop portal.
    """
    query = (
        select(CaseDocument)
        .where(CaseDocument.case_id == case_id)
        .order_by(desc(CaseDocument.created_at))
    )
    result = await db.execute(query)
    docs = result.scalars().all()

    formatted = []
    for d in docs:
        raw_url = d.watermarked_url or d.storage_url or ""
        # Normalize file system paths to /storage/ public web URLs
        norm_url = raw_url.replace("\\", "/")
        if "storage_uploads/" in norm_url:
            clean_url = "/storage/" + norm_url.split("storage_uploads/")[-1]
        elif norm_url.startswith("http://") or norm_url.startswith("https://"):
            clean_url = norm_url
        elif norm_url.startswith("/"):
            clean_url = norm_url
        else:
            clean_url = f"/storage/{norm_url}"

        formatted.append({
            "id": str(d.id),
            "doc_type": d.doc_type.value if hasattr(d.doc_type, "value") else str(d.doc_type),
            "url": clean_url,
            "latitude": d.latitude,
            "longitude": d.longitude,
            "is_geofence_valid": d.is_geofence_valid,
            "verification_status": d.verification_status.value if hasattr(d.verification_status, "value") else str(d.verification_status),
            "created_at": d.created_at.strftime("%d-%b-%Y, %H:%M IST") if d.created_at else None,
            "ocr_data": d.ocr_data or {},
            "ca_remarks": d.ca_remarks,
        })
    return formatted

