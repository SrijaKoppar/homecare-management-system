"""
Auth request and response schemas.
"""

from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field

from backend.apis.schemas.membership import MembershipRole


class LoginPayload(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    token: str
    user_id: UUID
    organization_id: UUID
    role: MembershipRole
    email: str
    display_name: Optional[str] = None


class SignupPayload(BaseModel):
    """Self-service signup: creates a new organization and its first admin user."""

    organization_name: str = Field(min_length=2, max_length=200)
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=200)
