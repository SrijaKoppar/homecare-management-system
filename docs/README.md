# Home Care System – Documentation Index

MVP-1 documentation for the Interactive Home Care Management System.

---

## Design & requirements

| Document | Description |
|----------|-------------|
| [data-model-mvp1.md](data-model-mvp1.md) | Entity-relationship overview and table definitions (user, organization, visit, task, etc.). |
| [detailed-requirements-by-model.md](detailed-requirements-by-model.md) | Per-model attributes, relationships, business rules, and acceptance criteria. |
| [wireframes-mvp1.md](wireframes-mvp1.md) | Wireframe specs for login, dashboard, schedule, care & tasks, messages, people, settings. |

---

## Implementation

| Document | Description |
|----------|-------------|
| [api-structure.md](api-structure.md) | API layer under `backend/apis/`: routes, schemas, dependencies, how to add endpoints. |
| [database-entities.md](database-entities.md) | Database layer under `backend/database/`: SQLAlchemy entities, session, table mapping. |

---

## Code layout

- **`backend/models/`** – Domain entities (dataclasses).
- **`backend/apis/`** – FastAPI app, routes, Pydantic schemas.
- **`backend/database/`** – SQLAlchemy base, session, ORM entities.
