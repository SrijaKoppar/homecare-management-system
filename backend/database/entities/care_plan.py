"""
Care plan table. Table 2.9 in data-model-mvp1.
"""

from datetime import date
from uuid import UUID
from typing import Optional, Any

from sqlalchemy import String, Date, ForeignKey, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from backend.database.base import Base, UUIDMixin, TimestampMixin


class CarePlan(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "care_plan"

    organization_id: Mapped[UUID] = mapped_column(
        ForeignKey("organization.id", ondelete="CASCADE"),
        nullable=False,
    )
    care_recipient_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    goals: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    focus_areas: Mapped[Optional[list[str] | dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    template_id: Mapped[Optional[UUID]] = mapped_column(PG_UUID(as_uuid=True), nullable=True)  # Phase 2
    effective_from: Mapped[date] = mapped_column(Date, nullable=False)
    effective_to: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active")
    created_by_id: Mapped[Optional[UUID]] = mapped_column(ForeignKey("user.id", ondelete="SET NULL"), nullable=True)
