import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from app.models.loan_case import CaseStatus


class CaseCreate(BaseModel):
    case_no: str
    bank_name: str
    branch: Optional[str] = None
    applicant_name: str
    applicant_phone: str
    loan_type: str  # e.g., HOME_LOAN, LAP, COMMERCIAL
    loan_amount: Optional[float] = None
    target_address: str
    target_lat: float
    target_lon: float
    assigned_agent_id: Optional[uuid.UUID] = None


class CaseUpdate(BaseModel):
    status: Optional[CaseStatus] = None
    assigned_agent_id: Optional[uuid.UUID] = None
    branch: Optional[str] = None
    loan_amount: Optional[float] = None
    target_address: Optional[str] = None
    target_lat: Optional[float] = None
    target_lon: Optional[float] = None


class CaseResponse(BaseModel):
    id: uuid.UUID
    case_no: str
    bank_name: str
    branch: Optional[str] = None
    applicant_name: str
    applicant_phone: str
    loan_type: str
    loan_amount: Optional[float] = None
    target_address: str
    target_lat: float
    target_lon: float
    status: CaseStatus
    field_form_data: Optional[str] = None
    assigned_agent_id: Optional[uuid.UUID] = None
    created_by_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class FieldFormDataRequest(BaseModel):
    form_data: dict


class VisitCheckInRequest(BaseModel):
    case_id: uuid.UUID
    current_lat: float
    current_lon: float
    notes: Optional[str] = None


class VisitCheckOutRequest(BaseModel):
    visit_id: uuid.UUID
    notes: Optional[str] = None


class VisitResponse(BaseModel):
    id: uuid.UUID
    case_id: uuid.UUID
    agent_id: uuid.UUID
    check_in_time: datetime
    check_out_time: Optional[datetime] = None
    start_lat: float
    start_lon: float
    notes: Optional[str] = None

    class Config:
        from_attributes = True
