import enum
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional
from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, JSON, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin


class DocumentType(str, enum.Enum):
    # Physical Property Inspection Photos
    PROPERTY_EXTERIOR = "PROPERTY_EXTERIOR"
    PROPERTY_INTERIOR = "PROPERTY_INTERIOR"
    ELECTRICITY_METER = "ELECTRICITY_METER"
    SOCIETY_BOARD = "SOCIETY_BOARD"
    NEIGHBOR_VERIFICATION = "NEIGHBOR_VERIFICATION"
    AGENT_SELFIE = "AGENT_SELFIE"

    # Workplace & Office Inspection Photos
    OFFICE_FACADE = "OFFICE_FACADE"
    OFFICE_NAMEBOARD = "OFFICE_NAMEBOARD"
    OFFICE_INTERIOR = "OFFICE_INTERIOR"
    OFFICE_SELFIE = "OFFICE_SELFIE"
    WORK_FACADE = "WORK_FACADE"
    WORK_OFFICE = "WORK_OFFICE"
    WORK_DESK = "WORK_DESK"
    WORK_APPROACH = "WORK_APPROACH"
    
    # Financial & KYC Documents
    AADHAAR_CARD = "AADHAAR_CARD"
    PAN_CARD = "PAN_CARD"
    UTILITY_BILL = "UTILITY_BILL"
    SALARY_SLIP = "SALARY_SLIP"
    PROPERTY_TITLE_DEED = "PROPERTY_TITLE_DEED"
    OTHER = "OTHER"


class VerificationStatus(str, enum.Enum):
    PENDING_PROCESSING = "PENDING_PROCESSING"
    PROCESSING = "PROCESSING"
    PROCESSED = "PROCESSED"
    VERIFIED = "VERIFIED"
    DISCREPANCY_FLAGGED = "DISCREPANCY_FLAGGED"
    REJECTED = "REJECTED"


class CaseDocument(Base, TimestampMixin):
    __tablename__ = "case_documents"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )
    case_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("loan_cases.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    visit_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("visit_records.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    doc_type: Mapped[DocumentType] = mapped_column(
        Enum(DocumentType, name="doc_type", native_enum=False),
        nullable=False,
        index=True,
    )
    storage_url: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    thumbnail_url: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    watermarked_url: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    latitude: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    longitude: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    distance_from_target: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    is_geofence_valid: Mapped[Optional[bool]] = mapped_column(
        Boolean,
        default=True,
        nullable=True,
    )
    captured_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    # Using JSON type which falls back to JSONB on PostgreSQL and JSON on SQLite/others
    ocr_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON().with_variant(JSONB(), "postgresql"),
        nullable=True,
    )
    verification_status: Mapped[VerificationStatus] = mapped_column(
        Enum(VerificationStatus, name="verification_status", native_enum=False),
        default=VerificationStatus.PENDING_PROCESSING,
        nullable=False,
        index=True,
    )
    ca_remarks: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    # Relationships
    case: Mapped["LoanCase"] = relationship(
        "LoanCase",
        back_populates="documents",
    )
    visit: Mapped[Optional["VisitRecord"]] = relationship(
        "VisitRecord",
        back_populates="documents",
    )
