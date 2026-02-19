"""
Visit table. Table 2.7 in data-model-mvp1.
"""

from datetime import datetime
from uuid import UUID
from typing import Optional

from sqlalchemy import String, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column

from backend.database.base import Base, UUIDMixin, TimestampMixin


class Visit(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "visit"

    organization_id: Mapped[UUID] = mapped_column(
        ForeignKey("organization.id", ondelete="CASCADE"),
        nullable=False,
    )
    care_recipient_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    assigned_caregiver_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("user.id", ondelete="SET NULL"),
        nullable=True,
    )
    visit_type: Mapped[str] = mapped_column(String(30), nullable=False)
    scheduled_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    scheduled_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    timezone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    address_street: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    address_city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    address_region: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    address_postal_code: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    address_country: Mapped[Optional[str]] = mapped_column(String(2), nullable=True)
    recurrence_rule: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    parent_visit_id: Mapped[Optional[UUID]] = mapped_column(ForeignKey("visit.id", ondelete="SET NULL"), nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="scheduled")
    checked_in_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    checked_out_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(String(2000), nullable=True)
    created_by_id: Mapped[Optional[UUID]] = mapped_column(ForeignKey("user.id", ondelete="SET NULL"), nullable=True)
