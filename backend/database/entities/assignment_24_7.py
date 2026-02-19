"""
Assignment 24x7 table. Table 2.8 in data-model-mvp1.
"""

from datetime import date, time, datetime
from uuid import UUID
from typing import Optional

from sqlalchemy import String, Date, Time, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from backend.database.base import Base, UUIDMixin, TimestampMixin


class Assignment24_7(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "assignment_24x7"

    organization_id: Mapped[UUID] = mapped_column(
        ForeignKey("organization.id", ondelete="CASCADE"),
        nullable=False,
    )
    care_recipient_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    caregiver_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    start_time: Mapped[Optional[time]] = mapped_column(Time, nullable=True)
    end_time: Mapped[Optional[time]] = mapped_column(Time, nullable=True)
    type: Mapped[str] = mapped_column(String(20), nullable=False, default="primary")
    notes: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active")
    created_by_id: Mapped[Optional[UUID]] = mapped_column(ForeignKey("user.id", ondelete="SET NULL"), nullable=True)
