"""
FastAPI application factory and router aggregation.

Mount all route modules under /api/v1. Health and readiness live at root.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.apis.routes import (
    health,
    persons,
    organizations,
    memberships,
    care_relationships,
    care_arrangements,
    visits,
    visit_notes,
    tasks,
    locations,
    auth,
    care_plans,
    assignments_24x7,
    care_notes,
    conversations,
    leave_requests,
)


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

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5000",
            "http://127.0.0.1:5000",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router, tags=["Health"])

    api_v1_routers = (
        persons,
        organizations,
        memberships,
        care_relationships,
        care_arrangements,
        visits,
        visit_notes,
        tasks,
        locations,
        auth,
        care_plans,
        assignments_24x7,
        care_notes,
        conversations,
        leave_requests,
    )
    for route_module in api_v1_routers:
        app.include_router(route_module.router, prefix="/api/v1")

    return app


app = create_app()
