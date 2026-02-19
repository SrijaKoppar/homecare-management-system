# Home Care System – MVP-1 Data Model

Entity-relationship description and table summary for Phase 1. Implemented in Python with SQLAlchemy in `backend/`.

---

## 1. Entity Relationship Overview

```
                    +------------------+
                    |   organization   |
                    +------------------+
                    | id (PK)          |
                    | name, type, ...  |
                    +--------+---------+
                             |
         +-------------------+-------------------+
         |                   |                   |
         v                   v                   v
+----------------+  +----------------+  +----------------+
|    location    |  |  membership    |  | care_arrangement|
| (agency only)  |  | user-org-role  |  | per recipient   |
+----------------+  +----------------+  +----------------+
         ^                   |
         |                   v
         |            +----------------+
         |            |      user      |
         |            +----------------+
         |            | id (PK), email  |
         |            +--------+--------+
         |                     |
         |    +----------------+----------------+
         |    |                |                |
         v    v                v                v
+----------------+  +----------------+  +----------------+
| care_relationship|  |     visit      |  | assignment_24x7|
+----------------+  +----------------+  +----------------+
         |                |                |
         |                v                |
         |         +----------------+     |
         |         |    task         |<----+
         |         | visit or 24/7  |     |
         |         +----------------+     |
         |                ^                |
         |                |                |
         v                v                v
+----------------+  +----------------+  +----------------+
|   care_plan    |  |  visit_note    |  |  conversation  |
+----------------+  +----------------+  |  message       |
                                       |  participant   |
                                       +----------------+
```

---

## 2. Table Definitions

### 2.1 user

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | UUID | No | gen_random_uuid() | PK |
| email | VARCHAR(255) | No | — | Unique |
| password_hash | VARCHAR(255) | Yes | — | |
| first_name | VARCHAR(100) | No | — | |
| last_name | VARCHAR(100) | No | — | |
| display_name | VARCHAR(150) | Yes | — | |
| phone | VARCHAR(50) | Yes | — | |
| phone_secondary | VARCHAR(50) | Yes | — | |
| avatar_url | VARCHAR(500) | Yes | — | |
| timezone | VARCHAR(50) | Yes | 'UTC' | IANA |
| locale | VARCHAR(10) | Yes | 'en-US' | |
| mfa_enabled | BOOLEAN | No | false | |
| status | VARCHAR(20) | No | 'active' | active, suspended, invited, archived |
| created_at | TIMESTAMP | No | now() | |
| updated_at | TIMESTAMP | No | now() | |
| last_login_at | TIMESTAMP | Yes | — | |

**Indexes:** UNIQUE(email), index(status).

---

### 2.2 organization

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | UUID | No | gen_random_uuid() | PK |
| name | VARCHAR(200) | No | — | |
| type | VARCHAR(20) | No | — | household, agency |
| slug | VARCHAR(100) | Yes | — | Unique, URL-safe |
| logo_url | VARCHAR(500) | Yes | — | |
| primary_phone | VARCHAR(50) | Yes | — | |
| primary_email | VARCHAR(255) | Yes | — | |
| address_street | VARCHAR(200) | Yes | — | |
| address_city | VARCHAR(100) | Yes | — | |
| address_region | VARCHAR(100) | Yes | — | |
| address_postal_code | VARCHAR(20) | Yes | — | |
| address_country | VARCHAR(2) | Yes | — | |
| timezone | VARCHAR(50) | Yes | 'UTC' | |
| settings | JSONB | Yes | — | |
| status | VARCHAR(20) | No | 'active' | active, suspended, archived |
| created_at | TIMESTAMP | No | now() | |
| updated_at | TIMESTAMP | No | now() | |

**Indexes:** UNIQUE(slug), index(type), index(status).

---

### 2.3 location

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | UUID | No | gen_random_uuid() | PK |
| organization_id | UUID | No | — | FK → organization |
| name | VARCHAR(200) | No | — | |
| address_street | VARCHAR(200) | Yes | — | |
| address_city | VARCHAR(100) | Yes | — | |
| address_region | VARCHAR(100) | Yes | — | |
| address_postal_code | VARCHAR(20) | Yes | — | |
| address_country | VARCHAR(2) | Yes | — | |
| timezone | VARCHAR(50) | Yes | — | |
| is_default | BOOLEAN | No | false | |
| created_at | TIMESTAMP | No | now() | |
| updated_at | TIMESTAMP | No | now() | |

---

### 2.4 membership

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | UUID | No | gen_random_uuid() | PK |
| user_id | UUID | No | — | FK → user |
| organization_id | UUID | No | — | FK → organization |
| role | VARCHAR(30) | No | — | family_viewer, family_editor, caregiver, supervisor, agency_admin, system_admin |
| title | VARCHAR(100) | Yes | — | |
| location_id | UUID | Yes | — | FK → location |
| status | VARCHAR(20) | No | 'active' | active, inactive, invited |
| joined_at | TIMESTAMP | No | now() | |
| invited_at | TIMESTAMP | Yes | — | |
| invited_by_id | UUID | Yes | — | FK → user |
| created_at | TIMESTAMP | No | now() | |
| updated_at | TIMESTAMP | No | now() | |

**Unique:** (user_id, organization_id).

---

### 2.5 care_relationship

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | UUID | No | gen_random_uuid() | PK |
| care_recipient_id | UUID | No | — | FK → user |
| related_user_id | UUID | No | — | FK → user |
| organization_id | UUID | No | — | FK → organization |
| role | VARCHAR(30) | No | — | primary_contact, backup_contact, family_viewer, nurse, aide, companion, other |
| is_24x7_caregiver | BOOLEAN | No | false | |
| start_date | DATE | Yes | — | |
| end_date | DATE | Yes | — | |
| notes | VARCHAR(500) | Yes | — | |
| status | VARCHAR(20) | No | 'active' | active, inactive, ended |
| created_at | TIMESTAMP | No | now() | |
| updated_at | TIMESTAMP | No | now() | |

**Indexes:** (care_recipient_id, organization_id), (related_user_id). **Constraint:** at most one is_24x7_caregiver=true per (care_recipient_id, organization_id).

---

### 2.6 care_arrangement

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | UUID | No | gen_random_uuid() | PK |
| care_recipient_id | UUID | No | — | FK → user |
| organization_id | UUID | No | — | FK → organization |
| mode | VARCHAR(30) | No | — | visits_only, caregiver_24x7_only, caregiver_24x7_plus_visits |
| effective_from | DATE | No | — | |
| effective_to | DATE | Yes | — | |
| notes | VARCHAR(500) | Yes | — | |
| created_at | TIMESTAMP | No | now() | |
| updated_at | TIMESTAMP | No | now() | |

**Index:** (care_recipient_id, organization_id), effective_from.

---

### 2.7 visit

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | UUID | No | gen_random_uuid() | PK |
| organization_id | UUID | No | — | FK → organization |
| care_recipient_id | UUID | No | — | FK → user |
| assigned_caregiver_id | UUID | Yes | — | FK → user |
| visit_type | VARCHAR(30) | No | — | personal_care, nursing, companionship, respite, other |
| scheduled_start | TIMESTAMP | No | — | |
| scheduled_end | TIMESTAMP | No | — | |
| timezone | VARCHAR(50) | Yes | — | |
| address_street | VARCHAR(200) | Yes | — | |
| address_city | VARCHAR(100) | Yes | — | |
| address_region | VARCHAR(100) | Yes | — | |
| address_postal_code | VARCHAR(20) | Yes | — | |
| address_country | VARCHAR(2) | Yes | — | |
| recurrence_rule | VARCHAR(500) | Yes | — | RRULE |
| parent_visit_id | UUID | Yes | — | FK → visit |
| status | VARCHAR(20) | No | 'scheduled' | scheduled, in_progress, completed, cancelled, no_show |
| checked_in_at | TIMESTAMP | Yes | — | |
| checked_out_at | TIMESTAMP | Yes | — | |
| notes | VARCHAR(2000) | Yes | — | |
| created_at | TIMESTAMP | No | now() | |
| updated_at | TIMESTAMP | No | now() | |
| created_by_id | UUID | Yes | — | FK → user |

**Indexes:** (organization_id), (care_recipient_id), (assigned_caregiver_id), (scheduled_start).

---

### 2.8 assignment_24x7

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | UUID | No | gen_random_uuid() | PK |
| organization_id | UUID | No | — | FK → organization |
| care_recipient_id | UUID | No | — | FK → user |
| caregiver_id | UUID | No | — | FK → user |
| start_date | DATE | No | — | |
| end_date | DATE | Yes | — | |
| start_time | TIME | Yes | — | |
| end_time | TIME | Yes | — | |
| type | VARCHAR(20) | Yes | 'primary' | primary, relief |
| notes | VARCHAR(500) | Yes | — | |
| status | VARCHAR(20) | No | 'active' | active, ended, cancelled |
| created_at | TIMESTAMP | No | now() | |
| updated_at | TIMESTAMP | No | now() | |
| created_by_id | UUID | Yes | — | FK → user |

**Indexes:** (care_recipient_id), (caregiver_id), (status).

---

### 2.9 care_plan

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | UUID | No | gen_random_uuid() | PK |
| organization_id | UUID | No | — | FK → organization |
| care_recipient_id | UUID | No | — | FK → user |
| name | VARCHAR(200) | No | — | |
| goals | TEXT | Yes | — | |
| focus_areas | ARRAY/VARCHAR[] or JSONB | Yes | — | |
| template_id | UUID | Yes | — | Phase 2 |
| effective_from | DATE | No | — | |
| effective_to | DATE | Yes | — | |
| status | VARCHAR(20) | No | 'active' | draft, active, archived |
| created_at | TIMESTAMP | No | now() | |
| updated_at | TIMESTAMP | No | now() | |
| created_by_id | UUID | Yes | — | FK → user |

**Index:** (care_recipient_id), (status).

---

### 2.10 task

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | UUID | No | gen_random_uuid() | PK |
| organization_id | UUID | No | — | FK → organization |
| care_recipient_id | UUID | No | — | FK → user |
| care_plan_id | UUID | Yes | — | FK → care_plan |
| visit_id | UUID | Yes | — | FK → visit |
| assignment_24x7_id | UUID | Yes | — | FK → assignment_24x7 |
| task_date | DATE | No | — | |
| title | VARCHAR(200) | No | — | |
| description | VARCHAR(1000) | Yes | — | |
| category | VARCHAR(30) | Yes | — | adl, medication, exercise, household, other |
| frequency | VARCHAR(50) | Yes | — | |
| status | VARCHAR(20) | No | 'pending' | pending, completed, skipped, declined |
| completed_at | TIMESTAMP | Yes | — | |
| completed_by_id | UUID | Yes | — | FK → user |
| notes | VARCHAR(500) | Yes | — | |
| sort_order | INTEGER | Yes | — | |
| created_at | TIMESTAMP | No | now() | |
| updated_at | TIMESTAMP | No | now() | |

**Check:** (visit_id IS NOT NULL) OR (assignment_24x7_id IS NOT NULL) for 24/7 day tasks. **Indexes:** (visit_id), (assignment_24x7_id, task_date), (care_recipient_id, task_date).

---

### 2.11 conversation

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | UUID | No | gen_random_uuid() | PK |
| organization_id | UUID | No | — | FK → organization |
| care_recipient_id | UUID | Yes | — | FK → user |
| title | VARCHAR(200) | Yes | — | |
| type | VARCHAR(20) | No | — | care_circle, direct, group |
| created_at | TIMESTAMP | No | now() | |
| updated_at | TIMESTAMP | No | now() | |

---

### 2.12 conversation_participant

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | UUID | No | gen_random_uuid() | PK |
| conversation_id | UUID | No | — | FK → conversation |
| user_id | UUID | No | — | FK → user |
| role | VARCHAR(20) | Yes | 'member' | member, muted |
| joined_at | TIMESTAMP | No | now() | |

**Unique:** (conversation_id, user_id).

---

### 2.13 message

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | UUID | No | gen_random_uuid() | PK |
| conversation_id | UUID | No | — | FK → conversation |
| sender_id | UUID | No | — | FK → user |
| body | TEXT | No | — | |
| attachments | JSONB | Yes | — | Phase 2 |
| status | VARCHAR(20) | Yes | 'sent' | sent, delivered, read |
| created_at | TIMESTAMP | No | now() | |

**Index:** (conversation_id), created_at.

---

### 2.14 visit_note

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | UUID | No | gen_random_uuid() | PK |
| visit_id | UUID | No | — | FK → visit, UNIQUE |
| author_id | UUID | No | — | FK → user |
| summary | VARCHAR(2000) | Yes | — | |
| mood | VARCHAR(100) | Yes | — | |
| incidents | VARCHAR(1000) | Yes | — | |
| next_steps | VARCHAR(500) | Yes | — | |
| created_at | TIMESTAMP | No | now() | |
| updated_at | TIMESTAMP | No | now() | |

---

### 2.15 care_note (24/7 daily note)

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | UUID | No | gen_random_uuid() | PK |
| organization_id | UUID | No | — | FK → organization |
| care_recipient_id | UUID | No | — | FK → user |
| assignment_24x7_id | UUID | Yes | — | FK → assignment_24x7 |
| author_id | UUID | No | — | FK → user |
| note_date | DATE | No | — | |
| summary | VARCHAR(2000) | Yes | — | |
| mood | VARCHAR(100) | Yes | — | |
| next_steps | VARCHAR(500) | Yes | — | |
| created_at | TIMESTAMP | No | now() | |
| updated_at | TIMESTAMP | No | now() | |

**Index:** (care_recipient_id, note_date).

---

## 3. Enums (application layer)

- **UserStatus:** active, suspended, invited, archived  
- **OrganizationType:** household, agency  
- **OrganizationStatus:** active, suspended, archived  
- **MembershipRole:** family_viewer, family_editor, caregiver, supervisor, agency_admin, system_admin  
- **MembershipStatus:** active, inactive, invited  
- **CareRelationshipRole:** primary_contact, backup_contact, family_viewer, nurse, aide, companion, other  
- **CareArrangementMode:** visits_only, caregiver_24x7_only, caregiver_24x7_plus_visits  
- **VisitType:** personal_care, nursing, companionship, respite, other  
- **VisitStatus:** scheduled, in_progress, completed, cancelled, no_show  
- **Assignment24x7Type:** primary, relief  
- **Assignment24x7Status:** active, ended, cancelled  
- **CarePlanStatus:** draft, active, archived  
- **TaskCategory:** adl, medication, exercise, household, other  
- **TaskStatus:** pending, completed, skipped, declined  
- **ConversationType:** care_circle, direct, group  
- **MessageStatus:** sent, delivered, read  

---

## 4. Python implementation

See `backend/app/models/` for SQLAlchemy models matching these tables. Base class and UUID/timestamp mixins are in `backend/app/models/base.py`.
