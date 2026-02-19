"""
Organization table. Table 2.2 in data-model-mvp1.
"""

from typing import Optional, Any

from sqlalchemy import String, DateTime, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.base import Base, UUIDMixin, TimestampMixin


class Organization(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "organization"

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    slug: Mapped[Optional[str]] = mapped_column(String(100), unique=True, nullable=True)
    logo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    primary_phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    primary_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    address_street: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    address_city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    address_region: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    address_postal_code: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    address_country: Mapped[Optional[str]] = mapped_column(String(2), nullable=True)
    timezone: Mapped[str] = mapped_column(String(50), nullable=False, default="UTC")
    settings: Mapped[Optional[dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active", index=True)
