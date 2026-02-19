# Interactive Home Care Management System – Detailed Requirements by Model

This document defines **each domain model** with attributes, relationships, business rules, and acceptance criteria. Use it as the single source of truth for implementation and for creating wireframes/mockups.

**Phasing reference:** Phase 1 = MVP; Phase 2 = Meds, richer plans, notifications, reports; Phase 3 = MAR, incidents, audit, offline, native apps.

---

## 1. User (Person)

### 1.1 Purpose & scope

Represents any person in the system: care recipients, family members, caregivers (internal/external), and agency staff. One logical “person” may have one system **User** account (login) and can participate in multiple organizations and care relationships.

### 1.2 Attributes

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|--------|
| id | UUID | Yes | Unique | System-generated. |
| email | string | Yes | Valid email, unique per tenant/org | Login identifier. |
| passwordHash | string | — | — | Stored securely; never exposed. |
| firstName | string | Yes | 1–100 chars | |
| lastName | string | Yes | 1–100 chars | |
| displayName | string | No | 0–150 chars | Optional override for UI. |
| phone | string | No | E.164 or local format | Primary contact phone. |
| phoneSecondary | string | No | — | Backup phone. |
| avatarUrl | string | No | URL | Profile photo. |
| timezone | string | No | IANA timezone | Default for scheduling/notifications. |
| locale | string | No | e.g. en-US | Language/region. |
| mfaEnabled | boolean | No | Default false | Phase 1 optional; required for agency. |
| status | enum | Yes | active, suspended, invited, archived | invited = no first login yet. |
| createdAt | datetime | Yes | — | |
| updatedAt | datetime | Yes | — | |
| lastLoginAt | datetime | No | — | |

### 1.3 Sub-types / roles (context-dependent)

- **Care recipient**: Person receiving care; may have limited or full account.
- **Family member**: Linked to household(s); roles: primary contact, backup, viewer, editor.
- **Caregiver**: Can be internal (agency employee) or external; assigned to visits or 24/7.
- **Agency staff**: Admin, supervisor, scheduler; belongs to an agency.

Role and type are expressed through **Organization membership** and **Care relationship**, not as a single “user type” field, so one person can be both family and caregiver in different contexts.

### 1.4 Relationships

- **Belongs to** zero or more **Organizations** (via Membership).
- **Has** zero or more **Care relationships** (as recipient or as caregiver/contact).
- **Has** one **User** (account) per identity; account links to Person.

### 1.5 Business rules

- Email must be unique within the scope of login (tenant/global as per design).
- At least one of phone or email required for notifications.
- Suspended users cannot log in or be assigned to new visits.
- Invited users have status `invited` until first login.

### 1.6 Acceptance criteria (for wireframes)

- **AC-U1**: Profile screen shows editable name, phone(s), email, timezone, avatar, and (for agency) status.
- **AC-U2**: User list (People) supports filter by role/type (recipient, family, caregiver, staff) and by organization.
- **AC-U3**: Invitation flow creates Person + User with status `invited` and sends email/link.

---

## 2. Organization

### 2.1 Purpose & scope

Represents a tenant or care context: a **Household** (family) or a **Care agency**. Supports multi-location for agencies. Data isolation is per organization; “shared care” is modeled by linking the same care recipient to both a household and an agency.

### 2.2 Attributes

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|--------|
| id | UUID | Yes | Unique | |
| name | string | Yes | 1–200 chars | Household name or agency name. |
| type | enum | Yes | household, agency | |
| slug | string | No | Unique, URL-safe | For deep links / subdomains. |
| logoUrl | string | No | URL | |
| primaryPhone | string | No | — | |
| primaryEmail | string | No | — | |
| address | object | No | street, city, region, postalCode, country | Primary address (household or agency HQ). |
| timezone | string | No | IANA | Default for org. |
| settings | JSON | No | — | Org-specific config (billing, features). |
| status | enum | Yes | active, suspended, archived | |
| createdAt | datetime | Yes | — | |
| updatedAt | datetime | Yes | — | |

### 2.3 Location (sub-entity for agencies)

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|--------|
| id | UUID | Yes | Unique | |
| organizationId | UUID | Yes | FK → Organization | |
| name | string | Yes | 1–200 chars | e.g. "North Branch". |
| address | object | No | — | |
| timezone | string | No | IANA | Override for this location. |
| isDefault | boolean | No | Default false | One per org. |

### 2.4 Relationships

- **Has** many **Members** (User + role) via Membership.
- **Household** has many **Care recipients** (through Care relationship).
- **Agency** has many **Locations**; has many **Care recipients** (clients) and **Caregivers** (staff) through memberships/assignments.

### 2.5 Business rules

- Household has at least one member with “family” role.
- Agency may have multiple locations; scheduling and reporting can be scoped by location.
- Only one organization of type `household` per “family” context; one person can belong to multiple households (e.g. divorced parents).

### 2.6 Acceptance criteria (for wireframes)

- **AC-O1**: Settings > Organization shows name, contact, address, timezone; for agency, list of locations.
- **AC-O2**: People list is scoped by current organization; switching org (e.g. “My family” vs “Agency”) changes context.

---

## 3. Membership (User ↔ Organization)

### 3.1 Purpose & scope

Links a **User** to an **Organization** with a **role** and optional permissions. Determines what the user can see and do in that org (e.g. family viewer vs editor, caregiver vs agency admin).

### 3.2 Attributes

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|--------|
| id | UUID | Yes | Unique | |
| userId | UUID | Yes | FK → User | |
| organizationId | UUID | Yes | FK → Organization | |
| role | enum | Yes | family_viewer, family_editor, caregiver, supervisor, agency_admin, system_admin | |
| title | string | No | e.g. "RN", "Primary contact" | Display only. |
| locationId | UUID | No | FK → Location | For agency staff: default location. |
| status | enum | Yes | active, inactive, invited | |
| joinedAt | datetime | Yes | — | |
| invitedAt | datetime | No | — | If invited. |
| invitedBy | UUID | No | FK → User | |

### 3.3 Relationships

- **User** ↔ **Organization** (many-to-many); one Membership per (User, Organization).
- **Membership** may reference **Location** (agency only).

### 3.4 Business rules

- One role per user per organization; role change overwrites.
- family_editor can manage people, schedule, care plans within the household; family_viewer is read-only.
- agency_admin can manage clients, staff, schedule, reports for the agency.
- system_admin is cross-tenant (if multi-tenant).

### 3.5 Acceptance criteria (for wireframes)

- **AC-M1**: People > [Person] shows organization(s) and role(s); role can be edited by admin.
- **AC-M2**: Invite flow: select org, role, enter email; Membership created with status invited.

---

## 4. Care Relationship

### 4.1 Purpose & scope

Links a **care recipient** to the people and organizations involved in their care: family contacts, caregivers, and (optionally) the **24/7 caregiver** for that recipient. Roles describe the relationship (primary contact, backup, nurse, aide).

### 4.2 Attributes

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|--------|
| id | UUID | Yes | Unique | |
| careRecipientId | UUID | Yes | FK → User/Person | The person receiving care. |
| relatedUserId | UUID | Yes | FK → User | Family member or caregiver. |
| organizationId | UUID | Yes | FK → Organization | Context: household or agency. |
| role | enum | Yes | primary_contact, backup_contact, family_viewer, nurse, aide, companion, other | |
| is24x7Caregiver | boolean | No | Default false | True = this person is the designated 24/7 caregiver for this recipient. |
| startDate | date | No | — | When relationship became effective. |
| endDate | date | No | — | When relationship ended (optional). |
| notes | string | No | 0–500 chars | |
| status | enum | Yes | active, inactive, ended | |
| createdAt | datetime | Yes | — | |
| updatedAt | datetime | Yes | — | |

### 4.3 Relationships

- **Care recipient** has many **Care relationships** (one per related person per org).
- **Care relationship** references **Organization** (household or agency).
- At most one **Care relationship** per recipient per org with `is24x7Caregiver = true` (one 24/7 caregiver per recipient in that org).

### 4.4 Business rules

- For a given recipient in an organization, only one related user can have `is24x7Caregiver = true` at a time.
- primary_contact and backup_contact are typically family; nurse/aide/companion are caregivers.
- Ending a relationship sets endDate and status = ended; history is retained.

### 4.5 Acceptance criteria (for wireframes)

- **AC-CR1**: Care recipient profile shows list of related people with role and “24/7 caregiver” badge; add/edit/remove relationship.
- **AC-CR2**: When designating 24/7 caregiver, any existing 24/7 designation for that recipient is cleared or replaced with clear confirmation.

---

## 5. Care Arrangement (per recipient)

### 5.1 Purpose & scope

Defines **how** care is delivered for one care recipient: scheduled visits only, 24/7 caregiver only, or both (24/7 + additional scheduled visits). One record per recipient per organization.

### 5.2 Attributes

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|--------|
| id | UUID | Yes | Unique | |
| careRecipientId | UUID | Yes | FK → User | |
| organizationId | UUID | Yes | FK → Organization | |
| mode | enum | Yes | visits_only, caregiver_24x7_only, caregiver_24x7_plus_visits | |
| effectiveFrom | date | Yes | — | |
| effectiveTo | date | No | — | Null = ongoing. |
| notes | string | No | 0–500 chars | e.g. "Respite visits on weekends". |
| createdAt | datetime | Yes | — | |
| updatedAt | datetime | Yes | — | |

### 5.3 Relationships

- **Care recipient** has one active **Care arrangement** per organization (effective date range).
- When mode includes caregiver_24x7, a **Care relationship** with `is24x7Caregiver = true` and an **Assignment24x7** record should exist.

### 5.4 Business rules

- mode = caregiver_24x7_only or caregiver_24x7_plus_visits requires a designated 24/7 caregiver (Care relationship + Assignment24x7).
- visits_only: no 24/7 block on calendar; only discrete visits.
- Changing mode is effective from a chosen date; history preserved.

### 5.5 Acceptance criteria (for wireframes)

- **AC-CA1**: Recipient profile or agency client screen shows “Care arrangement” with dropdown: Visits only / 24/7 caregiver only / 24/7 + visits; effective date.
- **AC-CA2**: Calendar and dashboard respect mode (e.g. hide visit check-in when mode is 24/7 only and user is the 24/7 caregiver).

---

## 6. Visit

### 6.1 Purpose & scope

A **scheduled visit** with a time window, assigned caregiver(s), and optional link to care plan tasks. Used for traditional hourly/daily visits. Not used for 24/7 continuous coverage (see Assignment24x7).

### 6.2 Attributes

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|--------|
| id | UUID | Yes | Unique | |
| organizationId | UUID | Yes | FK → Organization | |
| careRecipientId | UUID | Yes | FK → User | |
| assignedCaregiverId | UUID | No | FK → User | Primary caregiver; may have multiple in Phase 2. |
| visitType | enum | Yes | personal_care, nursing, companionship, respite, other | |
| scheduledStart | datetime | Yes | — | |
| scheduledEnd | datetime | Yes | Must be after scheduledStart | |
| timezone | string | No | IANA | Default from recipient or org. |
| address | object | No | — | Override recipient address if needed. |
| recurrenceRule | string | No | RRULE or similar | For recurring visits. |
| parentVisitId | UUID | No | FK → Visit | If this is an occurrence of a series. |
| status | enum | Yes | scheduled, in_progress, completed, cancelled, no_show | |
| checkedInAt | datetime | No | — | Caregiver clock-in. |
| checkedOutAt | datetime | No | — | Caregiver clock-out. |
| notes | string | No | 0–2000 chars | Internal. |
| createdAt | datetime | Yes | — | |
| updatedAt | datetime | Yes | — | |
| createdBy | UUID | No | FK → User | |

### 6.3 Relationships

- **Visit** belongs to **Organization**, **Care recipient**; optional **Assigned caregiver**.
- **Visit** has many **Tasks** (visit-scoped) and one **Visit note** (summary).
- **Visit** may be part of a **recurring series** (parentVisitId).

### 6.4 Business rules

- Only one primary caregiver per visit in Phase 1; multiple assignees possible in later phases.
- status in_progress requires checkedInAt; completed requires checkedOutAt.
- Cancelled visits remain with status cancelled; no deletion.
- Recurring visits: create instances from recurrenceRule or link as child of parent visit.

### 6.5 Acceptance criteria (for wireframes)

- **AC-V1**: Schedule view (day/week/month) shows visits as blocks; filter by recipient, caregiver, location.
- **AC-V2**: Create/edit visit: recipient, caregiver, type, start/end, recurrence option; address defaulted from recipient.
- **AC-V3**: Caregiver “Today”: list of visits with times and addresses; “Start visit” / “End visit” set check-in/out and status.
- **AC-V4**: Unassigned visits clearly indicated (e.g. “Unassigned” in schedule grid); agency can assign caregiver.

---

## 7. Assignment 24/7

### 7.1 Purpose & scope

Represents a **24/7 caregiver assignment** for one care recipient: one caregiver assigned around the clock for a date range. Supports relief/rotation (optional) via overlapping or back-to-back assignments. Used for billing and calendar “block” display.

### 7.2 Attributes

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|--------|
| id | UUID | Yes | Unique | |
| organizationId | UUID | Yes | FK → Organization | |
| careRecipientId | UUID | Yes | FK → User | |
| caregiverId | UUID | Yes | FK → User | |
| startDate | date | Yes | — | |
| endDate | date | No | — | Null = ongoing. |
| startTime | time | No | — | Optional; default midnight. |
| endTime | time | No | — | Optional; for partial-day handoffs. |
| type | enum | No | primary, relief | relief = temporary coverage. |
| notes | string | No | 0–500 chars | |
| status | enum | Yes | active, ended, cancelled | |
| createdAt | datetime | Yes | — | |
| updatedAt | datetime | Yes | — | |
| createdBy | UUID | No | FK → User | |

### 7.3 Relationships

- **Assignment 24/7** belongs to **Organization**, **Care recipient**, **Caregiver**.
- Aligns with **Care relationship** where `is24x7Caregiver = true` for same recipient/caregiver.

### 7.4 Business rules

- Only one active primary assignment per recipient at a time (no overlapping primary 24/7 for same recipient).
- Relief assignments may overlap with primary for handoff period.
- endDate null means “ongoing”; agency can set endDate when assignment ends.
- Calendar shows continuous block(s) for this recipient/caregiver; caregiver dashboard shows “Current 24/7 assignment: [Recipient]” with no visit check-in/out.

### 7.5 Acceptance criteria (for wireframes)

- **AC-A24-1**: Agency Operations: assign 24/7 caregiver to client with start/end date and type (primary/relief); list of current 24/7 assignments.
- **AC-A24-2**: Calendar: continuous “24/7” block for recipient/caregiver; optional relief periods visible.
- **AC-A24-3**: Caregiver dashboard: if user is 24/7 for a recipient, show single “Current 24/7 assignment” card with recipient name and link to tasks/notes (no visit list for that recipient).

---

## 8. Care Plan

### 8.1 Purpose & scope

Defines **goals and focus areas** for a care recipient and drives task templates and frequencies. One active care plan per recipient per organization; versioned or dated for history.

### 8.2 Attributes

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|--------|
| id | UUID | Yes | Unique | |
| organizationId | UUID | Yes | FK → Organization | |
| careRecipientId | UUID | Yes | FK → User | |
| name | string | Yes | 1–200 chars | e.g. "Post-hospital recovery". |
| goals | text | No | — | Free-form or structured. |
| focusAreas | array | No | e.g. ["mobility", "medication", "nutrition"] | |
| templateId | UUID | No | FK → CarePlanTemplate | If created from template. |
| effectiveFrom | date | Yes | — | |
| effectiveTo | date | No | — | Null = current. |
| status | enum | Yes | draft, active, archived | |
| createdAt | datetime | Yes | — | |
| updatedAt | datetime | Yes | — | |
| createdBy | UUID | No | FK → User | |

### 8.3 Care plan template (Phase 2)

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|--------|
| id | UUID | Yes | Unique | |
| organizationId | UUID | No | Null = system template | |
| name | string | Yes | 1–200 chars | e.g. "Dementia support". |
| goals | text | No | — | |
| focusAreas | array | No | — | |
| defaultTasks | — | No | — | References to task templates. |

### 8.4 Relationships

- **Care plan** belongs to **Organization**, **Care recipient**.
- **Care plan** has many **Tasks** (template or instance level); tasks can be visit-scoped or day-scoped (for 24/7).

### 8.5 Business rules

- Only one care plan per recipient in status `active` at a time (effective date range).
- Archiving or ending sets effectiveTo and status = archived.
- Phase 2: templates allow cloning goals and default tasks to new care plans.

### 8.6 Acceptance criteria (for wireframes)

- **AC-CP1**: Care plans & tasks > [Recipient]: show current care plan name, goals, focus areas; edit/add.
- **AC-CP2**: Task list for today/visit is derived from care plan + frequency; completed/skipped/declined with notes.

---

## 9. Task

### 9.1 Purpose & scope

A single **action item** for a visit or for a day (24/7 assignment): ADL, medication, exercise, household task. Has status (completed, skipped, declined) and optional notes/time.

### 9.2 Attributes

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|--------|
| id | UUID | Yes | Unique | |
| organizationId | UUID | Yes | FK → Organization | |
| careRecipientId | UUID | Yes | FK → User | |
| carePlanId | UUID | No | FK → CarePlan | Optional link. |
| visitId | UUID | No | FK → Visit | If visit-scoped; null for 24/7 day task. |
| assignment24x7Id | UUID | No | FK → Assignment24x7 | If 24/7 day-scoped. |
| taskDate | date | Yes | — | Day the task is for. |
| title | string | Yes | 1–200 chars | |
| description | string | No | 0–1000 chars | |
| category | enum | No | adl, medication, exercise, household, other | |
| frequency | string | No | e.g. "daily", "per visit" | From care plan or template. |
| status | enum | Yes | pending, completed, skipped, declined | |
| completedAt | datetime | No | — | When marked done. |
| completedBy | UUID | No | FK → User | Caregiver. |
| notes | string | No | 0–500 chars | Caregiver note. |
| sortOrder | int | No | — | Display order. |
| createdAt | datetime | Yes | — | |
| updatedAt | datetime | Yes | — | |

### 9.3 Relationships

- **Task** belongs to **Organization**, **Care recipient**; optional **Care plan**, **Visit**, or **Assignment24x7**.
- For 24/7: task may have assignment24x7Id and taskDate, no visitId.
- For visits: task has visitId and taskDate (visit date).

### 9.4 Business rules

- Either visitId or (assignment24x7Id + taskDate) for 24/7; not both.
- status completed requires completedAt and completedBy.
- skipped/declined require optional notes (configurable).
- Tasks can be created from care plan template or ad hoc per visit/day.

### 9.5 Acceptance criteria (for wireframes)

- **AC-T1**: Task list (per visit or per day for 24/7): checkboxes or actions for complete/skip/decline; add note; show time completed.
- **AC-T2**: Caregiver flow: “Log tasks” screen with list; tap to expand and add note; “Complete visit” or “Save” persists and syncs.

---

## 10. Medication

### 10.1 Purpose & scope

**Medication list** per care recipient: name, dose, route, frequency, prescriber. Phase 2; MAR and administration logging in Phase 3.

### 10.2 Attributes

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|--------|
| id | UUID | Yes | Unique | |
| organizationId | UUID | Yes | FK → Organization | |
| careRecipientId | UUID | Yes | FK → User | |
| name | string | Yes | 1–200 chars | Drug name. |
| dose | string | No | e.g. "10 mg" | |
| route | string | No | e.g. "oral", "topical" | |
| frequency | string | No | e.g. "twice daily", "with meals" | |
| instructions | string | No | 0–500 chars | Special instructions. |
| prescriber | string | No | 0–200 chars | |
| startDate | date | No | — | |
| endDate | date | No | — | When discontinued. |
| reminderTimes | array | No | e.g. ["08:00", "20:00"] | Phase 2. |
| status | enum | Yes | active, discontinued, on_hold | |
| createdAt | datetime | Yes | — | |
| updatedAt | datetime | Yes | — | |

### 10.3 Relationships

- **Medication** belongs to **Organization**, **Care recipient**.
- Phase 3: **Medication administration** (MAR) records link to Medication + date/time + given/not given + sign-off.

### 10.4 Business rules

- Only one active record per (recipient, name, dose, route) combination; discontinuation sets endDate and status.
- Reminder times drive notifications (Phase 2).
- Phase 3: MAR entry per dose with caregiver sign-off.

### 10.5 Acceptance criteria (for wireframes)

- **AC-MED1**: Medications > [Recipient]: list of meds with name, dose, route, frequency; add/edit/discontinue.
- **AC-MED2**: (Phase 2) Reminder settings per med; (Phase 3) MAR view by date with given/not given and sign-off.

---

## 11. Message & Conversation

### 11.1 Purpose & scope

**Secure messaging** between family, caregivers, and agency. Threads can be scoped by **care recipient** or by **care circle** (e.g. household + assigned caregivers). Phase 1: simple threads; optional photo attachments and family feed in Phase 2.

### 11.2 Attributes – Conversation

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|--------|
| id | UUID | Yes | Unique | |
| organizationId | UUID | Yes | FK → Organization | |
| careRecipientId | UUID | No | FK → User | Optional; thread about this recipient. |
| title | string | No | 0–200 chars | Optional thread title. |
| type | enum | Yes | care_circle, direct, group | |
| createdAt | datetime | Yes | — | |
| updatedAt | datetime | Yes | — | Last message time. |

### 11.3 Attributes – Conversation participant

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|--------|
| id | UUID | Yes | Unique | |
| conversationId | UUID | Yes | FK → Conversation | |
| userId | UUID | Yes | FK → User | |
| role | enum | No | member, muted | |
| joinedAt | datetime | Yes | — | |

### 11.4 Attributes – Message

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|--------|
| id | UUID | Yes | Unique | |
| conversationId | UUID | Yes | FK → Conversation | |
| senderId | UUID | Yes | FK → User | |
| body | text | Yes | 1–max (e.g. 4000) | |
| attachments | array | No | [{ url, type, name }] | Phase 2 optional. |
| status | enum | Yes | sent, delivered, read | Optional. |
| createdAt | datetime | Yes | — | |

### 11.5 Relationships

- **Conversation** has many **Participants** and many **Messages**.
- **Conversation** may be tied to one **Care recipient** (care circle) or be direct/group.

### 11.6 Business rules

- Only participants can see and send messages in a conversation.
- Care circle: participants derived from care relationships (family + assigned caregivers) for that recipient.
- Messages immutable after send; no edit/delete in Phase 1 (or soft-delete only).

### 11.7 Acceptance criteria (for wireframes)

- **AC-MSG1**: Messages: list of threads (by recipient or “Care circle”); tap to open thread and send/receive.
- **AC-MSG2**: New message: choose recipient or care circle; type body; send; thread shows in list with last message preview and time.

---

## 12. Visit Note / Care Note

### 12.1 Purpose & scope

**Visit summary** or **care update**: what was done, mood, incidents, next steps. One summary per visit (visit note); optional standalone care notes for 24/7 (e.g. daily note). Phase 1: visit note; Phase 2/3: richer templates and incident linkage.

### 12.2 Attributes – Visit note

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|--------|
| id | UUID | Yes | Unique | |
| visitId | UUID | Yes | FK → Visit | One per visit. |
| authorId | UUID | Yes | FK → User | Caregiver. |
| summary | text | No | 0–2000 chars | What was done. |
| mood | string | No | 0–100 chars | Recipient mood. |
| incidents | text | No | 0–1000 chars | Brief incident note; Phase 3 link to Incident. |
| nextSteps | text | No | 0–500 chars | |
| createdAt | datetime | Yes | — | |
| updatedAt | datetime | Yes | — | |

### 12.3 Care note (24/7 or standalone)

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|--------|
| id | UUID | Yes | Unique | |
| organizationId | UUID | Yes | FK → Organization | |
| careRecipientId | UUID | Yes | FK → User | |
| assignment24x7Id | UUID | No | FK → Assignment24x7 | If 24/7. |
| authorId | UUID | Yes | FK → User | |
| noteDate | date | Yes | — | |
| summary | text | No | 0–2000 chars | |
| mood | string | No | — | |
| nextSteps | text | No | — | |
| createdAt | datetime | Yes | — | |

### 12.4 Relationships

- **Visit note** belongs to **Visit** and **Author**.
- **Care note** belongs to **Care recipient**, optional **Assignment24x7**, **Author**.

### 12.5 Business rules

- One visit note per visit; created/updated when caregiver completes or updates visit.
- Family and agency can view visit notes and care notes (per permissions).
- Phase 3: incident field may reference Incident report id.

### 12.6 Acceptance criteria (for wireframes)

- **AC-N1**: After “End visit”, caregiver can add summary, mood, next steps; family sees in “Recent notes” on dashboard.
- **AC-N2**: 24/7 caregiver: “Add daily note” for recipient with date, summary, mood; appears in timeline for family/agency.

---

## 13. Notification & Notification preference

### 13.1 Purpose & scope

**In-app**, **push** (mobile), and **email** notifications. Configurable per user: visit reminders, new messages, alerts (e.g. missed task, incident). Phase 2.

### 13.2 Attributes – Notification

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|--------|
| id | UUID | Yes | Unique | |
| userId | UUID | Yes | FK → User | Recipient of notification. |
| type | enum | Yes | visit_reminder, message, alert, system | |
| title | string | Yes | 1–200 chars | |
| body | text | No | — | |
| data | JSON | No | e.g. { visitId, conversationId } | For deep link. |
| channel | enum | Yes | in_app, push, email | |
| status | enum | Yes | pending, sent, read, failed | |
| sentAt | datetime | No | — | |
| readAt | datetime | No | — | |
| createdAt | datetime | Yes | — | |

### 13.3 Attributes – Notification preference

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|--------|
| id | UUID | Yes | Unique | |
| userId | UUID | Yes | FK → User | |
| notificationType | enum | Yes | visit_reminder, message, alert, etc. | |
| channel | enum | Yes | in_app, push, email | |
| enabled | boolean | Yes | Default true | |
| updatedAt | datetime | Yes | — | |

### 13.4 Business rules

- Default: visit reminders and messages enabled for in_app and (if available) push and email.
- User can opt out per type and per channel in Settings.
- Notifications created when: visit upcoming (reminder), new message, task overdue, incident (agency).

### 13.5 Acceptance criteria (for wireframes)

- **AC-NF1**: Settings > Notifications: toggles per type (visit reminders, messages, alerts) and per channel (in-app, push, email).
- **AC-NF2**: In-app bell icon shows list of recent notifications; mark as read; tap opens related screen (visit, thread).

---

## 14. Incident report (Phase 3)

### 14.1 Purpose & scope

**Incident reports** for falls, medication errors, etc. Agency-focused; audit trail and export for compliance.

### 14.2 Attributes

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|--------|
| id | UUID | Yes | Unique | |
| organizationId | UUID | Yes | FK → Organization | |
| careRecipientId | UUID | Yes | FK → User | |
| visitId | UUID | No | FK → Visit | If during visit. |
| reportedBy | UUID | Yes | FK → User | |
| type | enum | Yes | fall, medication_error, injury, other | |
| description | text | Yes | — | |
| occurredAt | datetime | Yes | — | |
| followUp | text | No | — | |
| status | enum | Yes | draft, submitted, reviewed, closed | |
| createdAt | datetime | Yes | — | |
| updatedAt | datetime | Yes | — | |

### 14.3 Relationships

- **Incident** belongs to **Organization**, **Care recipient**; optional **Visit**; **reportedBy** User.
- Visit note can reference Incident (optional).

### 14.4 Acceptance criteria (for wireframes)

- **AC-I1**: Agency: Incidents list; create incident (type, description, date, recipient, visit); view/edit/status.
- **AC-I2**: Reports: export incidents by date range and recipient.

---

## 15. Audit log (Phase 3)

### 15.1 Purpose & scope

**Audit trail**: who did what and when (e.g. login, edit care plan, complete task, view PHI). For compliance and support.

### 15.2 Attributes

| Attribute | Type | Required | Constraints | Notes |
|-----------|------|----------|-------------|--------|
| id | UUID | Yes | Unique | |
| organizationId | UUID | No | FK → Organization | Null if system-level. |
| userId | UUID | No | FK → User | Actor. |
| action | string | Yes | e.g. "task.completed", "visit.checked_out" | |
| entityType | string | No | e.g. "Visit", "Task" | |
| entityId | UUID | No | — | |
| payload | JSON | No | — | Minimal context (no PHI if possible). |
| ipAddress | string | No | — | |
| userAgent | string | No | — | |
| createdAt | datetime | Yes | — | |

### 15.3 Business rules

- Append-only; no update/delete.
- Sensitive data (e.g. message body) not stored in payload; only ids and action type.
- Retention per org policy; export for compliance.

### 15.4 Acceptance criteria (for wireframes)

- **AC-AUD1**: Agency Admin: Reports or Settings > Audit log: filter by user, action, date; export.

---

## 16. Report & export (Phase 2/3)

### 16.1 Purpose & scope

**Reports** for agency: hours (visit + 24/7), tasks completed, incidents, billing-oriented exports. Phase 2: basic hours and tasks; Phase 3: full exports and compliance.

### 16.2 Conceptual model

- **Report** = saved filter + date range + columns (e.g. “Caregiver hours by week”, “Tasks by recipient”).
- **Export** = run of a report to file (CSV/PDF) with optional schedule.

### 16.3 Key report types

| Report | Phase | Content |
|--------|--------|--------|
| Hours by caregiver | 2 | Visit check-in/out + 24/7 assignment hours by period. |
| Tasks by recipient | 2 | Completed/skipped/declined counts by recipient and date range. |
| Visit summary | 2 | Visits completed, no-show, cancelled. |
| Incidents | 3 | All incidents; filter by type, recipient, date. |
| MAR summary | 3 | Medication administration by recipient/date. |
| Billing export | 3 | Hours and line items for billing systems. |

### 16.4 Acceptance criteria (for wireframes)

- **AC-R1**: Reports > choose report type > set date range and filters > Run > view table and Export CSV/PDF.
- **AC-R2**: Schedule export (Phase 3): frequency (e.g. weekly), recipients (email), format.

---

## 17. Summary: models for wireframes

Use this checklist when creating wireframes:

| Model | Key screens / flows |
|-------|----------------------|
| **User** | Profile edit, People list, Invite flow |
| **Organization** | Org settings, Locations (agency), Context switcher |
| **Membership** | Role per person per org, Invite with role |
| **Care relationship** | Recipient profile → related people, 24/7 designation |
| **Care arrangement** | Recipient/Client → care mode (visits / 24/7 / both) |
| **Visit** | Schedule calendar, Create/edit visit, Caregiver “Today” + Start/End visit |
| **Assignment 24/7** | Agency assign 24/7, Calendar 24/7 block, Caregiver “Current 24/7” card |
| **Care plan** | Care plan detail, Goals/focus areas, Link to tasks |
| **Task** | Task list (visit or day), Complete/Skip/Decline + notes |
| **Medication** | Med list per recipient, Add/edit, MAR (Phase 3) |
| **Message** | Thread list, Thread view, New message, Care circle |
| **Visit note / Care note** | End visit summary, Daily note (24/7), Timeline/feed |
| **Notification** | In-app list, Settings > Notification preferences |
| **Incident** (Phase 3) | Create incident, Incidents list, Reports |
| **Audit** (Phase 3) | Audit log viewer, Export |
| **Reports** | Report type, Filters, Table, Export |

---

*Next step: use this document to create wireframes/mockups for the key screens and flows listed above.*
