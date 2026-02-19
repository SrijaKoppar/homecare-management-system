"""
Shared API dependencies: DB session, current user, current organization.

Replace stubs with real auth (JWT, session) and DB session injection.
"""

from typing import Annotated

from fastapi import Depends, Header
from sqlalchemy.orm import Session

from backend.database.session import get_db


# Stub: in production, resolve from JWT or session
def get_current_user_id(
    x_user_id: Annotated[str | None, Header(alias="X-User-Id")] = None,
) -> str:
    """
    Current authenticated user ID.

    For now this is a simple stub that reads the `X-User-Id` header or falls back
    to a fixed UUID so that the rest of the backend can be exercised without
    full auth in place.
    """
    return x_user_id or "00000000-0000-0000-0000-000000000000"


# Stub: in production, resolve from context (e.g. selected org for the user)
def get_current_organization_id(
    x_organization_id: Annotated[str | None, Header(alias="X-Organization-Id")] = None,
) -> str:
    """
    Current organization context for scoped queries.

    Reads `X-Organization-Id` header or uses a fixed UUID placeholder.
    """
    return x_organization_id or "00000000-0000-0000-0000-000000000000"


def get_db_session(db: Annotated[Session, Depends(get_db)]) -> Session:
    """
    Provide a SQLAlchemy Session to route handlers.

    This is a thin wrapper around `backend.database.session.get_db` so that
    routes can depend on a concrete `Session` type.
    """
    return db
