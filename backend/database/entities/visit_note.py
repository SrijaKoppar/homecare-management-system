"""
Visit note table. Table 2.14 in data-model-mvp1.
"""

from uuid import UUID
from typing import Optional

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from backend.database.base import Base, UUIDMixin, TimestampMixin


class VisitNote(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "visit_note"

    visit_id: Mapped[UUID] = mapped_column(
        ForeignKey("visit.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    author_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    summary: Mapped[Optional[str]] = mapped_column(String(2000), nullable=True)
    mood: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    incidents: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    next_steps: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
