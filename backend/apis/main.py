"""
FastAPI application factory and router aggregation.

Mount all route modules under /api/v1. Health and readiness live at root.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI

from backend.apis.routes import health, persons, organizations


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Startup/shutdown: connect DB, run migrations, etc."""
    yield


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="Home Care Management API",
        description="MVP-1 API for households and care agencies.",
        version="0.1.0",
        lifespan=lifespan,
    )

    app.include_router(health.router, tags=["Health"])
    app.include_router(persons.router, prefix="/api/v1")
    app.include_router(organizations.router, prefix="/api/v1")

    return app


app = create_app()
