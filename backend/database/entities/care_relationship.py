"""
Care relationship table. Table 2.5 in data-model-mvp1.
"""

from datetime import date
from uuid import UUID
from typing import Optional

from sqlalchemy import String, Boolean, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from backend.database.base import Base, UUIDMixin, TimestampMixin


class CareRelationship(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "care_relationship"

    care_recipient_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    related_user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    organization_id: Mapped[UUID] = mapped_column(
        ForeignKey("organization.id", ondelete="CASCADE"),
        nullable=False,
    )
    role: Mapped[str] = mapped_column(String(30), nullable=False)
    is_24x7_caregiver: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active")
