import os
import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user, get_optional_current_user, require_role
from app.core.config import settings
from app.core.database import get_db
from app.models.loan_case import LoanCase
from app.models.report import CertifiedReport
from app.models.user import User, UserRole
from app.schemas.report import CpvTemplateReportRequest, ReportGenerateRequest, ReportResponse
from starlette.concurrency import run_in_threadpool
from app.services.cpv_report_builder import build_cpv_report
from app.services.cpv_report_data import assemble_cpv_report_data
from app.workers.celery_tasks import generate_report_pdf_task

router = APIRouter(prefix="/reports", tags=["Certified Bank Dossiers & UDIN Reports"])

DOCX_MEDIA_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"


@router.post("/cpv-template/{case_id}")
async def generate_cpv_template_report(
    case_id: str,
    req: CpvTemplateReportRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.CA_VERIFIER, UserRole.SUPER_ADMIN)),
):
    """
    Generate the CPV report in the firm's own Word template (single or dual applicant,
    chosen automatically from the scanned documents) filled with this case's data.
    """
    from app.api.v1.cases import _ai_ingested_pages, resolve_loan_case

    loan_case = await resolve_loan_case(db, case_id)
    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan case not found")

    pages = await _ai_ingested_pages(db, loan_case)
    data = await assemble_cpv_report_data(
        db, loan_case, pages,
        udin=req.udin, overall_status=req.overall_status, file_allotted_by=req.file_allotted_by,
        verifier_names=req.verifier_names, include_co_applicant=req.include_co_applicant,
    )
    safe_no = "".join(ch if ch.isalnum() or ch in "-_" else "_" for ch in loan_case.case_no)
    out = os.path.join("reports_generated", f"CPV_Report_{safe_no}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.docx")
    result = await run_in_threadpool(build_cpv_report, data, out)
    return FileResponse(
        path=out,
        media_type=DOCX_MEDIA_TYPE,
        filename=f"CPV_Report_{safe_no}.docx",
        headers={"X-Report-Template": result["template"]},
    )


@router.post("/generate", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def generate_report(
    req: ReportGenerateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    """
    Trigger compilation of certified, bank-ready PDF report with UDIN and SHA-256 fingerprint.
    Runs synchronously and persists certified report record.
    """
    case_res = await db.execute(select(LoanCase).where(LoanCase.id == req.case_id))
    loan_case = case_res.scalar_one_or_none()
    
    # A certified report can only be generated for a case that really exists — never
    # substituted with another applicant's data.
    if not loan_case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan case not found")

    user_id_str = str(current_user.id) if current_user else str(uuid.uuid4())

    # Generate the report
    result = generate_report_pdf_task(
        case_id_str=str(req.case_id),
        ca_remarks=req.ca_remarks,
        user_id_str=user_id_str,
        udin=req.udin,
    )

    if result.get("status") != "success":
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Report generation error: {result.get('message', 'Unknown error')}",
        )

    # Fetch newly created report
    rep_res = await db.execute(
        select(CertifiedReport)
        .where(CertifiedReport.id == uuid.UUID(result["report_id"]))
    )
    report = rep_res.scalar_one()
    return report


@router.get("/case/{case_id}", response_model=List[ReportResponse])
async def get_case_reports(
    case_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    """List all certified reports generated for a loan case."""
    rep_res = await db.execute(
        select(CertifiedReport)
        .where(CertifiedReport.case_id == case_id)
        .order_by(desc(CertifiedReport.generated_at))
    )
    return rep_res.scalars().all()


@router.get("/{report_id}/download")
async def download_report_pdf(
    report_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Download the certified bank-ready PDF report by ID.
    Direct link (no login) — only the exact report ID is served.
    """
    # 1. Try resolving as UUID from database
    report = None
    try:
        report_uuid = uuid.UUID(report_id)
        rep_res = await db.execute(select(CertifiedReport).where(CertifiedReport.id == report_uuid))
        report = rep_res.scalar_one_or_none()
    except ValueError:
        pass

    if report and os.path.exists(report.report_url):
        filename = os.path.basename(report.report_url)
        return FileResponse(
            path=report.report_url,
            media_type="application/pdf",
            filename=filename,
            headers={
                "X-SHA256-Fingerprint": report.file_hash_sha256,
                "X-UDIN": report.udin or "",
            },
        )

    # No fallback: serving "the latest PDF" or a sample dossier would hand one customer's
    # certified report to whoever asked for another (and this link needs no login).
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Report not found or its file is no longer on the server — regenerate it.",
    )


@router.get("/{report_id}/download-docx")
async def download_report_docx(
    report_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Download the specimen-matching Word (.docx) CPV dossier by ID.
    Direct link (no login) — only the exact report ID is served.
    """
    report = None
    try:
        report_uuid = uuid.UUID(report_id)
        rep_res = await db.execute(select(CertifiedReport).where(CertifiedReport.id == report_uuid))
        report = rep_res.scalar_one_or_none()
    except ValueError:
        pass

    if report and report.docx_url and os.path.exists(report.docx_url):
        filename = os.path.basename(report.docx_url)
        return FileResponse(
            path=report.docx_url,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=filename,
        )

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Report not found or its file is no longer on the server — regenerate it.",
    )
