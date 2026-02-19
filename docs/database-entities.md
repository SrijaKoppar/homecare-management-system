# Database Entities

Overview of the **database** layer under `backend/database/`. It provides the SQLAlchemy ORM entities, engine, and session that implement the MVP-1 data model.

---

## 1. Folder Layout

```
backend/database/
├── __init__.py          # Exports Base, engine, SessionLocal, get_db, and all entities
├── base.py              # Declarative Base, UUIDMixin, TimestampMixin
├── session.py           # create_engine, SessionLocal, get_db
└── entities/
    ├── __init__.py      # Re-exports all entity classes
    ├── user.py          # User (table: user)
    ├── organization.py # Organization
    ├── location.py     # Location
    ├── membership.py   # Membership
    ├── care_relationship.py
    ├── care_arrangement.py
    ├── visit.py
    ├── assignment_24_7.py  # Table: assignment_24x7
    ├── care_plan.py
    ├── task.py
    ├── conversation.py    # Conversation, ConversationParticipant
    ├── message.py
    ├── visit_note.py
    └── care_note.py
```

---

## 2. Base and Mixins

- **`Base`** – SQLAlchemy `DeclarativeBase`; all entities subclass it.
- **`UUIDMixin`** – Adds `id: Mapped[uuid.UUID]` as primary key with `default=uuid.uuid4`.
- **`TimestampMixin`** – Adds `created_at` and `updated_at` (timezone-aware, server default and on update).

Most tables use both mixins. Exceptions:

- **ConversationParticipant** – Only `joined_at` (no updated_at).
- **Message** – Only `created_at` (no updated_at).

---

## 3. Table ↔ Entity Mapping

| Table (data-model-mvp1) | Entity class | File |
|-------------------------|--------------|------|
| user | `User` | `entities/user.py` |
| organization | `Organization` | `entities/organization.py` |
| location | `Location` | `entities/location.py` |
| membership | `Membership` | `entities/membership.py` |
| care_relationship | `CareRelationship` | `entities/care_relationship.py` |
| care_arrangement | `CareArrangement` | `entities/care_arrangement.py` |
| visit | `Visit` | `entities/visit.py` |
| assignment_24x7 | `Assignment24_7` | `entities/assignment_24_7.py` |
| care_plan | `CarePlan` | `entities/care_plan.py` |
| task | `Task` | `entities/task.py` |
| conversation | `Conversation` | `entities/conversation.py` |
| conversation_participant | `ConversationParticipant` | `entities/conversation.py` |
| message | `Message` | `entities/message.py` |
| visit_note | `VisitNote` | `entities/visit_note.py` |
| care_note | `CareNote` | `entities/care_note.py` |

---

## 4. Session and Engine

- **`engine`** – Created from `DATABASE_URL` (default: `postgresql://localhost:5432/homecare`). Set `SQL_ECHO=true` to log SQL.
- **`SessionLocal`** – `sessionmaker` bound to the engine.
- **`get_db()`** – Generator dependency that yields a session and closes it. Use with FastAPI `Depends(get_db)`.

---

## 5. Creating Tables

Ensure all entities are imported so that `Base.metadata` knows every table (e.g. by importing `backend.database` or `backend.database.entities`), then:

```python
from backend.database.base import Base
from backend.database.session import engine
# Import entities so they register with Base
import backend.database.entities  # noqa: F401

Base.metadata.create_all(bind=engine)
```

For production, use a migration tool (Alembic) instead of `create_all`.

---

## 6. Domain vs Database

- **`backend/models/`** – Domain entities (dataclasses) used in business logic and API responses.
- **`backend/database/entities/`** – SQLAlchemy ORM models used for persistence.

Convert between them in a service or repository layer (e.g. map `User` ORM → `Person` domain when returning from the API).

---

## 7. References

- Full table definitions and enums: [data-model-mvp1.md](data-model-mvp1.md)
- API that will use this layer: [api-structure.md](api-structure.md)
