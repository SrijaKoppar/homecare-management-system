"""
Organization request and response schemas.
"""

from typing import Optional
from pydantic import BaseModel


class OrganizationResponse(BaseModel):
    """Organization in API responses."""

    id: str
    name: str
    type: str  # household | agency
    slug: Optional[str] = None
    status: str = "active"

    model_config = {"from_attributes": True}
