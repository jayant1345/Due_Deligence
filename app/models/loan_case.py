import enum
import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import DateTime, Enum, Float, ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin


class CaseStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    ASSIGNED = "ASSIGNED"
    IN_PROGRESS = "IN_PROGRESS"
    PENDING_CA_REVIEW = "PENDING_CA_REVIEW"
    APPROVED = "APPROVED"
    FLAGGED = "FLAGGED"
    CERTIFIED = "CERTIFIED"
    REJECTED = "REJECTED"


class LoanCase(Base, TimestampMixin):
    __tablename__ = "loan_cases"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )
    case_no: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
    )
    bank_name: Mapped[str] = mapped_column(
        String(255),
        index=True,
        nullable=False,
    )
    branch: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    applicant_name: Mapped[str] = mapped_column(
        String(255),
        index=True,
        nullable=False,
    )
    applicant_phone: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    loan_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )  # e.g., HOME_LOAN, LAP, COMMERCIAL_MORTGAGE, MSME_BUSINESS
    loan_amount: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    target_address: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    target_lat: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )
    target_lon: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )
    status: Mapped[CaseStatus] = mapped_column(
        Enum(CaseStatus, name="case_status", native_enum=False),
        default=CaseStatus.DRAFT,
        nullable=False,
        index=True,
    )
    field_form_data: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    
    # Foreign Keys
    assigned_agent_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    created_by_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    # Relationships
    assigned_agent: Mapped[Optional["User"]] = relationship(
        "User",
        foreign_keys=[assigned_agent_id],
        back_populates="assigned_cases",
    )
    created_by: Mapped["User"] = relationship(
        "User",
        foreign_keys=[created_by_id],
        back_populates="created_cases",
    )
    visits: Mapped[List["VisitRecord"]] = relationship(
        "VisitRecord",
        back_populates="case",
        cascade="all, delete-orphan",
    )
    documents: Mapped[List["CaseDocument"]] = relationship(
        "CaseDocument",
        back_populates="case",
        cascade="all, delete-orphan",
    )
    reports: Mapped[List["CertifiedReport"]] = relationship(
        "CertifiedReport",
        back_populates="case",
        cascade="all, delete-orphan",
    )
    audit_logs: Mapped[List["AuditLog"]] = relationship(
        "AuditLog",
        back_populates="case",
        cascade="all, delete-orphan",
    )


class VisitRecord(Base, TimestampMixin):
    __tablename__ = "visit_records"

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
    agent_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    check_in_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    check_out_time: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    start_lat: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )
    start_lon: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )
    notes: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    # Relationships
    case: Mapped["LoanCase"] = relationship(
        "LoanCase",
        back_populates="visits",
    )
    agent: Mapped["User"] = relationship(
        "User",
        back_populates="visits",
    )
    documents: Mapped[List["CaseDocument"]] = relationship(
        "CaseDocument",
        back_populates="visit",
    )
