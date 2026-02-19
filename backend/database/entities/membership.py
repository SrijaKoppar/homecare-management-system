"""
Membership table (user-org-role). Table 2.4 in data-model-mvp1.
"""

from datetime import datetime
from uuid import UUID
from typing import Optional

from sqlalchemy import String, DateTime, func, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from backend.database.base import Base, UUIDMixin, TimestampMixin


class Membership(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "membership"
    __table_args__ = (UniqueConstraint("user_id", "organization_id", name="uq_membership_user_org"),)

    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    organization_id: Mapped[UUID] = mapped_column(
        ForeignKey("organization.id", ondelete="CASCADE"),
        nullable=False,
    )
    role: Mapped[str] = mapped_column(String(30), nullable=False)
    title: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    location_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("location.id", ondelete="SET NULL"),
        nullable=True,
    )
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active")
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    invited_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    invited_by_id: Mapped[Optional[UUID]] = mapped_column(ForeignKey("user.id", ondelete="SET NULL"), nullable=True)
