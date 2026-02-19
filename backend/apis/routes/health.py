"""
Health and readiness endpoints.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health() -> dict:
    """Liveness: service is running."""
    return {"status": "ok"}


@router.get("/ready")
def ready() -> dict:
    """Readiness: service can accept traffic (e.g. DB reachable)."""
    return {"status": "ready"}
