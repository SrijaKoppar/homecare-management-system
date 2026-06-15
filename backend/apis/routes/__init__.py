"""
API route modules.

Each module defines a FastAPI APIRouter for a resource or group of resources.
"""

from fastapi import APIRouter

from . import (
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
)


router = APIRouter()

router.include_router(health.router)
router.include_router(persons.router)
router.include_router(organizations.router)
router.include_router(memberships.router)
router.include_router(care_relationships.router)
router.include_router(care_arrangements.router)
router.include_router(visits.router)
router.include_router(visit_notes.router)
router.include_router(tasks.router)
router.include_router(locations.router)
router.include_router(auth.router)
router.include_router(care_plans.router)
router.include_router(assignments_24x7.router)
router.include_router(care_notes.router)
router.include_router(conversations.router)
