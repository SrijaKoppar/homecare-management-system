"""
Task table (visit or 24/7). Table 2.10 in data-model-mvp1.
"""

from datetime import date, datetime
from uuid import UUID
from typing import Optional

from sqlalchemy import String, Integer, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column

from backend.database.base import Base, UUIDMixin, TimestampMixin


class Task(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "task"

    organization_id: Mapped[UUID] = mapped_column(
        ForeignKey("organization.id", ondelete="CASCADE"),
        nullable=False,
    )
    care_recipient_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    care_plan_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("care_plan.id", ondelete="SET NULL"),
        nullable=True,
    )
    visit_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("visit.id", ondelete="CASCADE"),
        nullable=True,
    )
    assignment_24x7_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("assignment_24x7.id", ondelete="CASCADE"),
        nullable=True,
    )
    task_date: Mapped[date] = mapped_column(Date, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    frequency: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_by_id: Mapped[Optional[UUID]] = mapped_column(ForeignKey("user.id", ondelete="SET NULL"), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    sort_order: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
