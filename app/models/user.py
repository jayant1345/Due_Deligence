import enum
import uuid
from typing import List, Optional
from sqlalchemy import Boolean, Enum, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin


class UserRole(str, enum.Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    CA_VERIFIER = "CA_VERIFIER"
    FIELD_AGENT = "FIELD_AGENT"


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )
    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    phone: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role", native_enum=False),
        default=UserRole.FIELD_AGENT,
        nullable=False,
        index=True,
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # Relationships
    assigned_cases: Mapped[List["LoanCase"]] = relationship(
        "LoanCase",
        back_populates="assigned_agent",
        foreign_keys="LoanCase.assigned_agent_id",
    )
    created_cases: Mapped[List["LoanCase"]] = relationship(
        "LoanCase",
        back_populates="created_by",
        foreign_keys="LoanCase.created_by_id",
    )
    visits: Mapped[List["VisitRecord"]] = relationship(
        "VisitRecord",
        back_populates="agent",
    )
    audit_logs: Mapped[List["AuditLog"]] = relationship(
        "AuditLog",
        back_populates="user",
    )
