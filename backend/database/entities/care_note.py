"""
Care note table (24/7 daily note). Table 2.15 in data-model-mvp1.
"""

from datetime import date
from uuid import UUID
from typing import Optional

from sqlalchemy import String, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from backend.database.base import Base, UUIDMixin, TimestampMixin


class CareNote(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "care_note"

    organization_id: Mapped[UUID] = mapped_column(
        ForeignKey("organization.id", ondelete="CASCADE"),
        nullable=False,
    )
    care_recipient_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    assignment_24x7_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("assignment_24x7.id", ondelete="SET NULL"),
        nullable=True,
    )
    author_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    note_date: Mapped[date] = mapped_column(Date, nullable=False)
    summary: Mapped[Optional[str]] = mapped_column(String(2000), nullable=True)
    mood: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    next_steps: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
