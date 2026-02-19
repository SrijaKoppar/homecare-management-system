"""
API layer for the Home Care Management System.

Exposes HTTP endpoints via FastAPI. Use routes for resource endpoints,
schemas for request/response validation, and dependencies for shared
logic (DB session, auth).
"""

from backend.apis.main import create_app

__all__ = ["create_app"]
