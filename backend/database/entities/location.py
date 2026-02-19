"""
Location table (agency-only). Table 2.3 in data-model-mvp1.
"""

from uuid import UUID
from typing import Optional

from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.base import Base, UUIDMixin, TimestampMixin


class Location(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "location"

    organization_id: Mapped[UUID] = mapped_column(
        ForeignKey("organization.id", ondelete="CASCADE"),
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    address_street: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    address_city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    address_region: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    address_postal_code: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    address_country: Mapped[Optional[str]] = mapped_column(String(2), nullable=True)
    timezone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    is_default: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
