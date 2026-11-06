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
    office_address: Optional[str] = None
    target_lat: float
    target_lon: float
    assigned_agent_id: Optional[uuid.UUID] = None
    co_applicant_name: Optional[str] = None
    co_applicant_phone: Optional[str] = None
    co_applicant_address: Optional[str] = None
    co_applicant_office_address: Optional[str] = None
    applicant_3_name: Optional[str] = None
    applicant_3_phone: Optional[str] = None
    applicant_4_name: Optional[str] = None
    applicant_4_phone: Optional[str] = None
    applicant_5_name: Optional[str] = None
    applicant_5_phone: Optional[str] = None
    applicant_home_sharing: Optional[str] = None
    applicant_3_address: Optional[str] = None
    applicant_4_address: Optional[str] = None
    applicant_5_address: Optional[str] = None


class CaseUpdate(BaseModel):
    case_no: Optional[str] = None
    status: Optional[CaseStatus] = None
    assigned_agent_id: Optional[uuid.UUID] = None
    applicant_name: Optional[str] = None
    applicant_phone: Optional[str] = None
    bank_name: Optional[str] = None
    branch: Optional[str] = None
    loan_amount: Optional[float] = None
    target_address: Optional[str] = None
    office_address: Optional[str] = None
    co_applicant_name: Optional[str] = None
    co_applicant_phone: Optional[str] = None
    co_applicant_address: Optional[str] = None
    co_applicant_office_address: Optional[str] = None
    applicant_3_name: Optional[str] = None
    applicant_3_phone: Optional[str] = None
    applicant_4_name: Optional[str] = None
    applicant_4_phone: Optional[str] = None
    applicant_5_name: Optional[str] = None
    applicant_5_phone: Optional[str] = None
    applicant_home_sharing: Optional[str] = None
    applicant_3_address: Optional[str] = None
    applicant_4_address: Optional[str] = None
    applicant_5_address: Optional[str] = None
    target_lat: Optional[float] = None
    target_lon: Optional[float] = None


class CaseAssignRequest(BaseModel):
    agent_username: str


class ReassignDocumentsRequest(BaseModel):
    # Data-repair tool: moves specific documents to a different case record - for the rare
    # case where documents ended up attached to the wrong case (e.g. a case_no collision
    # silently merged two different applicants' uploads into one case id).
    document_ids: List[uuid.UUID]


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
    office_address: Optional[str] = None
    target_lat: float
    target_lon: float
    status: CaseStatus
    field_form_data: Optional[str] = None
    co_applicant_name: Optional[str] = None
    co_applicant_phone: Optional[str] = None
    co_applicant_address: Optional[str] = None
    co_applicant_office_address: Optional[str] = None
    applicant_3_name: Optional[str] = None
    applicant_3_phone: Optional[str] = None
    applicant_4_name: Optional[str] = None
    applicant_4_phone: Optional[str] = None
    applicant_5_name: Optional[str] = None
    applicant_5_phone: Optional[str] = None
    applicant_home_sharing: Optional[str] = None
    applicant_3_address: Optional[str] = None
    applicant_4_address: Optional[str] = None
    applicant_5_address: Optional[str] = None
    assigned_agent_id: Optional[uuid.UUID] = None
    created_by_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    # Computed, not stored columns - the most recent geotagged photo's own capture location and
    # its distance from the benchmark (target_lat/lon), attached onto the ORM object by the list
    # endpoint. None until at least one geotagged photo has been uploaded for this case.
    capture_lat: Optional[float] = None
    capture_lon: Optional[float] = None
    distance_m: Optional[float] = None

    class Config:
        from_attributes = True


class FieldFormDataRequest(BaseModel):
    form_data: dict


class ApplicantLocationRequest(BaseModel):
    # Pasted WhatsApp / Google Maps / Apple Maps link, or "lat, long" text.
    text: str = Field(..., min_length=3, max_length=2000)


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
