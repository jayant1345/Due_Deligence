import os
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_ca_user, get_optional_current_user
from app.core.database import get_db
from app.models.user import User
from app.services.archive_service import (
    generate_hierarchical_monthly_zip,
    get_available_archive_months,
    purge_month_cloud_storage,
)

router = APIRouter(prefix="/archives", tags=["Monthly Archival & Cloud Offload"])


class PurgeMonthRequest(BaseModel):
    month_year: str
    confirm: bool = False
    purge_mode: str = "files_only"  # 'files_only' or 'full_delete'


@router.get("/months", response_model=List[Dict[str, Any]])
async def list_archive_months(
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    """
    List all available month-years grouped from portfolio cases,
    with bank and branch counts, disk file counts, and storage size in MB.
    """
    months = await get_available_archive_months(db)
    return months


@router.get("/download")
async def download_monthly_archive_zip(
    month: Optional[str] = Query("ALL", description="e.g. 'AUG - 2026', 'SEP - 2026', 'OCT - 2026', or 'ALL'"),
    bank: Optional[str] = Query("ALL", description="Specific bank name filter or 'ALL'"),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    """
    Generate and stream a hierarchical ZIP file organized as:
    <MONTH - YEAR> / <Bank Name> / <Branch Name> / <Case Name Wise Folder> / [Input Documents + Output Reports]
    """
    clean_month = month.strip() if month else "ALL"
    clean_bank = bank.strip() if bank else "ALL"

    try:
        zip_path, filename, total_cases = await generate_hierarchical_monthly_zip(
            session=db,
            target_month_year=clean_month,
            bank_name_filter=clean_bank,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to compile hierarchical archive ZIP: {str(e)}",
        )

    if not os.path.exists(zip_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No files found to archive for the selected period.",
        )

    return FileResponse(
        path=zip_path,
        media_type="application/zip",
        filename=filename,
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "X-Archived-Cases": str(total_cases),
            "X-Month-Year": clean_month,
        },
    )


@router.post("/purge")
async def purge_cloud_storage(
    req: PurgeMonthRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_ca_user),
):
    """
    Clean up Railway cloud storage after downloading backup to local machine.
    Deletes uploaded input PDFs, raw images, and generated reports from cloud disk.
    Decreases Railway disk usage to save cloud costs.
    """
    if not req.confirm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please confirm that you have downloaded the monthly backup to your local machine / USB drive before purging cloud storage.",
        )

    if not req.month_year or not req.month_year.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Specify the Month-Year to purge (e.g. 'SEP - 2026' or 'ALL').",
        )

    result = await purge_month_cloud_storage(
        session=db,
        target_month_year=req.month_year,
        purge_mode=req.purge_mode or "files_only",
        acting_user_id=current_user.id if current_user else None,
    )
    return result
