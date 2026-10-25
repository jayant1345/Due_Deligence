import uuid
from typing import Any, Dict, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user, require_role
from app.core.database import get_db
from app.models.document import CaseDocument, VerificationStatus
from app.models.loan_case import CaseStatus, LoanCase, VisitRecord
from app.models.report import AuditLog
from app.models.user import User, UserRole
from app.schemas.document import DocumentResponse, DocumentScrutinyUpdate

router = APIRouter(prefix="/scrutiny", tags=["CA Scrutiny & Verification Desk"])


@router.get("/cases/{case_id}/dossier")
async def get_case_scrutiny_dossier(
    case_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.CA_VERIFIER, UserRole.SUPER_ADMIN)),
) -> Dict[str, Any]:
    """
    Retrieve comprehensive CPV & Scrutiny dossier for a loan case:
    - Master applicant records
    - Geofence & GNSS audit trail
    - Watermarked photos & EXIF validation
    - OCR extraction results, UIDAI masked Aadhaar, and RapidFuzz alignment scores
    """
    case_res = await db.execute(select(LoanCase).where(LoanCase.id == case_id))
    loan_case = case_res.scalar_one_or_none()
    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan case not found")

    # Fetch visits
    visit_res = await db.execute(
        select(VisitRecord).where(VisitRecord.case_id == case_id).order_by(VisitRecord.check_in_time.desc())
    )
    visits = visit_res.scalars().all()

    # Fetch documents
    doc_res = await db.execute(
        select(CaseDocument).where(CaseDocument.case_id == case_id).order_by(CaseDocument.created_at.asc())
    )
    docs = doc_res.scalars().all()

    # Format documents with response model
    doc_list = [DocumentResponse.model_validate(d).model_dump() for d in docs]

    # Calculate overall dossier health
    discrepancies = [d for d in docs if d.verification_status == VerificationStatus.DISCREPANCY_FLAGGED]
    geofence_breaches = [d for d in docs if d.is_geofence_valid is False]

    return {
        "case": {
            "id": str(loan_case.id),
            "case_no": loan_case.case_no,
            "bank_name": loan_case.bank_name,
            "branch": loan_case.branch,
            "applicant_name": loan_case.applicant_name,
            "applicant_phone": loan_case.applicant_phone,
            "loan_type": loan_case.loan_type,
            "loan_amount": loan_case.loan_amount,
            "target_address": loan_case.target_address,
            "target_lat": loan_case.target_lat,
            "target_lon": loan_case.target_lon,
            "status": loan_case.status.value,
        },
        "visits": [
            {
                "id": str(v.id),
                "check_in_time": v.check_in_time,
                "check_out_time": v.check_out_time,
                "start_lat": v.start_lat,
                "start_lon": v.start_lon,
                "notes": v.notes,
            }
            for v in visits
        ],
        "documents": doc_list,
        "audit_summary": {
            "total_documents": len(docs),
            "discrepancies_count": len(discrepancies),
            "geofence_breaches_count": len(geofence_breaches),
            "is_clean_audit": len(discrepancies) == 0 and len(geofence_breaches) == 0,
        },
    }


@router.patch("/documents/{document_id}", response_model=DocumentResponse)
async def update_document_scrutiny(
    document_id: uuid.UUID,
    req: DocumentScrutinyUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.CA_VERIFIER, UserRole.SUPER_ADMIN)),
):
    """CA updates verification status and adds clinical remarks to a document."""
    query = select(CaseDocument).where(CaseDocument.id == document_id)
    result = await db.execute(query)
    doc = result.scalar_one_or_none()

    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    doc.verification_status = req.verification_status
    if req.ca_remarks:
        doc.ca_remarks = req.ca_remarks

    audit = AuditLog(
        case_id=doc.case_id,
        user_id=current_user.id,
        action="DOCUMENT_SCRUTINIZED",
        extra_metadata={
            "document_id": str(doc.id),
            "status": doc.verification_status.value,
            "remarks": doc.ca_remarks,
        },
    )
    db.add(audit)
    await db.commit()
    await db.refresh(doc)
    return doc


@router.get("/metrics")
async def get_scrutiny_metrics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.CA_VERIFIER, UserRole.SUPER_ADMIN)),
):
    """Retrieve aggregate case status metrics for CA Firm Dashboard."""
    cases_by_status = await db.execute(
        select(LoanCase.status, func.count(LoanCase.id)).group_by(LoanCase.status)
    )
    counts = {s.value: 0 for s in CaseStatus}
    for status_val, count in cases_by_status.all():
        counts[status_val.value] = count

    total_cases = sum(counts.values())
    return {
        "total_cases": total_cases,
        "metrics": counts,
    }
