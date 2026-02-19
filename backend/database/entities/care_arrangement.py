"""
Care arrangement table. Table 2.6 in data-model-mvp1.
"""

from datetime import date
from uuid import UUID
from typing import Optional

from sqlalchemy import String, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from backend.database.base import Base, UUIDMixin, TimestampMixin


class CareArrangement(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "care_arrangement"

    care_recipient_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    organization_id: Mapped[UUID] = mapped_column(
        ForeignKey("organization.id", ondelete="CASCADE"),
        nullable=False,
    )
    mode: Mapped[str] = mapped_column(String(30), nullable=False)
    effective_from: Mapped[date] = mapped_column(Date, nullable=False)
    effective_to: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
