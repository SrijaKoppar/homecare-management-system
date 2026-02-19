"""
User (person) table. Table 2.1 in data-model-mvp1.
"""

from datetime import datetime
from uuid import UUID
from typing import Optional

from sqlalchemy import Boolean, String, DateTime, func
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.base import Base, UUIDMixin, TimestampMixin


class User(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "user"

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    display_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    phone_secondary: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    timezone: Mapped[str] = mapped_column(String(50), nullable=False, default="UTC")
    locale: Mapped[str] = mapped_column(String(10), nullable=False, default="en-US")
    mfa_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active", index=True)
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
