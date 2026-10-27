import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class ReportGenerateRequest(BaseModel):
    case_id: uuid.UUID
    udin: Optional[str] = None
    ca_remarks: str
    checklist_identity_verified: bool = True
    checklist_property_exists: bool = True
    checklist_geofence_compliant: bool = True
    checklist_neighbor_confirmed: bool = True
    checklist_no_adverse_findings: bool = True


class CpvTemplateReportRequest(BaseModel):
    """CA inputs for the firm-template CPV report; everything else comes from the case record."""
    udin: Optional[str] = None
    overall_status: Optional[str] = None
    file_allotted_by: Optional[str] = None
    verifier_names: Optional[List[str]] = None
    include_co_applicant: Optional[bool] = None  # None = auto-detect from scanned documents


class ReportResponse(BaseModel):
    id: uuid.UUID
    case_id: uuid.UUID
    report_url: str
    docx_url: Optional[str] = None
    file_hash_sha256: str
    udin: Optional[str] = None
    generated_at: datetime
    generated_by_id: uuid.UUID

    class Config:
        from_attributes = True


class AuditLogResponse(BaseModel):
    id: uuid.UUID
    case_id: Optional[uuid.UUID] = None
    user_id: uuid.UUID
    action: str
    metadata: Optional[Dict[str, Any]] = None
    timestamp: datetime

    class Config:
        from_attributes = True
