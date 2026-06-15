"""
Auth request and response schemas.
"""

from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class LoginPayload(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    token: str
    user_id: UUID
    organization_id: UUID
    role: str
    email: str
    display_name: Optional[str] = None
