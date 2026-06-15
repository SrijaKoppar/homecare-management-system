"""
Shared API dependencies: DB session, current user, current organization.

Replace stubs with real auth (JWT, session) and DB session injection.
"""

from typing import Annotated, Optional

from fastapi import Depends, Header
from sqlalchemy.orm import Session

from backend.database.session import get_db


def _parse_token(authorization: Optional[str]) -> tuple[Optional[str], Optional[str]]:
    """Parse custom token form: Bearer token:<user_id>:<org_id>:<role>"""
    if not authorization or not authorization.startswith("Bearer "):
        return None, None
    token_str = authorization.replace("Bearer ", "", 1)
    if not token_str.startswith("token:"):
        return None, None
    parts = token_str.split(":")
    if len(parts) >= 3:
        return parts[1], parts[2]
    return None, None


# Resolves authenticated user ID
def get_current_user_id(
    authorization: Annotated[Optional[str], Header(alias="Authorization")] = None,
    x_user_id: Annotated[Optional[str], Header(alias="X-User-Id")] = None,
) -> str:
    """
    Current authenticated user ID. Parses Bearer token or X-User-Id header.
    """
    u_id, _ = _parse_token(authorization)
    if u_id:
        return u_id
    return x_user_id or "00000000-0000-0000-0000-000000000000"


# Resolves current organization context
def get_current_organization_id(
    authorization: Annotated[Optional[str], Header(alias="Authorization")] = None,
    x_organization_id: Annotated[Optional[str], Header(alias="X-Organization-Id")] = None,
) -> str:
    """
    Current organization context. Parses Bearer token or X-Organization-Id header.
    """
    _, org_id = _parse_token(authorization)
    if org_id:
        return org_id
    return x_organization_id or "00000000-0000-0000-0000-000000000000"


def get_db_session(db: Annotated[Session, Depends(get_db)]) -> Session:
    """
    Provide a SQLAlchemy Session to route handlers.

    This is a thin wrapper around `backend.database.session.get_db` so that
    routes can depend on a concrete `Session` type.
    """
    return db
