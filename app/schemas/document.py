import uuid
from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel
from app.models.document import DocumentType, VerificationStatus


class DocumentUploadResponse(BaseModel):
    document_id: uuid.UUID
    task_id: str
    case_id: uuid.UUID
    doc_type: DocumentType
    status: str = "ACCEPTED"
    message: str = "File queued for background watermarking, EXIF parsing, and OCR scrutiny."


class DocumentScrutinyUpdate(BaseModel):
    verification_status: VerificationStatus
    ca_remarks: Optional[str] = None


class DocumentResponse(BaseModel):
    id: uuid.UUID
    case_id: uuid.UUID
    visit_id: Optional[uuid.UUID] = None
    doc_type: DocumentType
    storage_url: str
    thumbnail_url: Optional[str] = None
    watermarked_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    distance_from_target: Optional[float] = None
    is_geofence_valid: Optional[bool] = None
    captured_at: Optional[datetime] = None
    ocr_data: Optional[Dict[str, Any]] = None
    verification_status: VerificationStatus
    ca_remarks: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
