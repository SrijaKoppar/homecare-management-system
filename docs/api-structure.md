# API Structure

Overview of the HTTP API layer under `backend/apis/`. The API is built with **FastAPI** and follows a route/schema/dependency layout.

---

## 1. Folder Layout

```
backend/apis/
├── __init__.py          # Exposes create_app
├── main.py              # FastAPI app factory, router registration
├── dependencies.py      # Shared deps: get_current_user_id, get_current_organization_id, get_db
├── routes/
│   ├── __init__.py
│   ├── health.py        # GET /health, GET /ready
│   ├── persons.py       # /api/v1/persons
│   └── organizations.py # /api/v1/organizations
└── schemas/
    ├── __init__.py
    ├── person.py        # PersonCreate, PersonUpdate, PersonResponse
    └── organization.py  # OrganizationResponse
```

---

## 2. Application Entry

- **`create_app()`** in `main.py` builds the FastAPI app, mounts routers, and sets lifespan.
- Run with: `uvicorn backend.apis.main:app --reload` (from project root with `backend` on `PYTHONPATH`).

---

## 3. Routes

| Prefix | Module | Description |
|--------|--------|-------------|
| (root) | `health` | `GET /health`, `GET /ready` |
| `/api/v1` | `persons` | `GET/POST /api/v1/persons`, `GET /api/v1/persons/{id}` |
| `/api/v1` | `organizations` | `GET /api/v1/organizations`, `GET /api/v1/organizations/{id}` |

Endpoints are currently **stubs** (e.g. list returns `[]`, get by id returns 404). Wire them to the database layer and domain logic as you implement features.

---

## 4. Schemas

- **Pydantic** models in `schemas/` define request bodies and response shapes.
- Naming: `ResourceCreate`, `ResourceUpdate`, `ResourceResponse`.
- Responses use `model_config = {"from_attributes": True}` for ORM compatibility when you return DB entities.

---

## 5. Dependencies

- **`get_current_user_id`** – Stub: reads `X-User-Id` header or returns a default. Replace with JWT/session auth.
- **`get_current_organization_id`** – Stub: reads `X-Organization-Id` header or default. Replace with context from auth or selected org.
- **`get_db`** – (Commented in `dependencies.py`.) When enabled, injects a DB session from `backend.database.session.get_db`.

To use the DB in a route:

```python
from fastapi import Depends
from sqlalchemy.orm import Session
from backend.database import get_db

@router.get("/items")
def list_items(db: Session = Depends(get_db)):
    ...
```

---

## 6. Adding a New Resource

1. **Route:** Add `backend/apis/routes/<resource>.py` with an `APIRouter` and register it in `main.py` with `app.include_router(..., prefix="/api/v1")`.
2. **Schemas:** Add `backend/apis/schemas/<resource>.py` with Create/Update/Response models.
3. **Dependencies:** Use `Depends(get_current_user_id)` or `Depends(get_current_organization_id)` for scoping; add `Depends(get_db)` when using the database.

---

## 7. References

- Data model and enums: [data-model-mvp1.md](data-model-mvp1.md)
- Requirements and acceptance criteria: [detailed-requirements-by-model.md](detailed-requirements-by-model.md)
- Database entities used by the API: [database-entities.md](database-entities.md)
