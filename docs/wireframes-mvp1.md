# Home Care System – MVP-1 Wireframes

Wireframe specifications for Phase 1 (MVP). Each screen includes layout, key elements, and acceptance criteria references. Use these for UI implementation or to generate higher-fidelity mockups.

---

## 1. Authentication & Context

### 1.1 Login

```
+------------------------------------------+
|  [Logo]   Home Care                       |
|                                          |
|  Email    [________________________]     |
|  Password [________________________]     |
|            [ ] Remember me                |
|            [ Log in ]                     |
|            Forgot password?               |
+------------------------------------------+
```

- **Elements:** Email, password, Remember me, Log in, Forgot password link.
- **Post-login:** Redirect to Dashboard; set current organization from user’s first membership if needed.

### 1.2 Context Switcher (Header)

```
+------------------------------------------------------------------+
| [Logo]  Home Care    [My family v]  |  [🔔] [Avatar v]           |
+------------------------------------------------------------------+
```

- **Dropdown "My family v":** List of organizations the user belongs to (household names, agency name). Selecting one sets current context (org) for the session.
- **AC:** AC-O2 – People and data scoped by selected org.

---

## 2. Dashboard (Role-Specific)

### 2.1 Family Dashboard

```
+------------------------------------------------------------------+
| [Logo]  Home Care    [My family v]     [🔔] [Avatar v]            |
+------------------------------------------------------------------+
| Home    Schedule   Care & tasks   Messages   People   Settings   |
+------------------------------------------------------------------+
|                                                                   |
|  Next visit                                    [View schedule →]  |
|  +-----------------------------------------------+                |
|  | Wed, Feb 5 · 10:00 AM – 12:00 PM              |                |
|  | Personal care · Jane D. (Caregiver)           |                |
|  | 123 Oak St                                    |                |
|  +-----------------------------------------------+                |
|                                                                   |
|  Recent updates                                                   |
|  +-----------------------------------------------+                |
|  | Feb 4 · Visit note (Mom)                      |                |
|  | "Morning routine done, good mood..."           |                |
|  +-----------------------------------------------+                |
|  | Feb 3 · Task update (Mom)                     |                |
|  | 3 tasks completed                             |                |
|  +-----------------------------------------------+                |
|                                                                   |
|  [ Quick message ]                                                |
|                                                                   |
+------------------------------------------------------------------+
```

- **Sections:** Next visit (time, caregiver, address), Recent updates (visit notes, task summaries), Quick message CTA.
- **AC:** Family dashboard shows next visit and recent notes.

### 2.2 Caregiver Dashboard – Visit-Based

```
+------------------------------------------------------------------+
| [Logo]  Home Care    [Agency v]          [🔔] [Avatar v]          |
+------------------------------------------------------------------+
| Home    Schedule   Tasks   Messages   More                        |
+------------------------------------------------------------------+
|                                                                   |
|  Today's visits                                                   |
|  +-----------------------------------------------+                |
|  | 10:00 AM – 12:00 PM  [ Start visit ]          |                |
|  | Mary S. · Personal care                        |                |
|  | 123 Oak St, City                               |                |
|  +-----------------------------------------------+                |
|  | 2:00 PM – 4:00 PM   [ Start visit ]           |                |
|  | John K. · Companionship                        |                |
|  | 456 Elm Ave, City                              |                |
|  +-----------------------------------------------+                |
|                                                                   |
+------------------------------------------------------------------+
```

- **Elements:** List of today’s visits with time, recipient name, visit type, address; “Start visit” per visit.
- **AC:** AC-V3 – Caregiver sees today’s visits; Start/End visit.

### 2.3 Caregiver Dashboard – 24/7 Assignment

When the caregiver has an active 24/7 assignment, show this instead of (or above) visit list:

```
|  Current 24/7 assignment                                          |
|  +-----------------------------------------------+                |
|  | Mary S.                                       |                |
|  | [ View tasks ]  [ Add note ]                   |                |
|  +-----------------------------------------------+                |
```

- **AC:** AC-A24-3 – Single “Current 24/7 assignment” card; no visit check-in/out for this recipient.

### 2.4 Agency Dashboard

```
+------------------------------------------------------------------+
| [Logo]  Home Care    [Sunrise Agency v]   [🔔] [Avatar v]         |
+------------------------------------------------------------------+
| Home   Schedule   Clients   Staff   Reports   Settings           |
+------------------------------------------------------------------+
|                                                                   |
|  Today's coverage                                                 |
|  +-----------------------------------------------+                |
|  | 3 unassigned visits          [ Assign → ]     |                |
|  | 12 visits in progress                         |                |
|  | 2 active 24/7 assignments                     |                |
|  +-----------------------------------------------+                |
|                                                                   |
|  Alerts                                                           |
|  +-----------------------------------------------+                |
|  | Visit tomorrow 9 AM (Mary S.) – no caregiver  |                |
|  +-----------------------------------------------+                |
|                                                                   |
+------------------------------------------------------------------+
```

- **Sections:** Today’s coverage (unassigned, in progress, 24/7), Alerts (e.g. unassigned visits).

---

## 3. People

### 3.1 People List

```
+------------------------------------------------------------------+
| People                            [ + Add person ]  [Filter v]   |
+------------------------------------------------------------------+
| Filter: [ All v ] [ Recipients ] [ Family ] [ Caregivers ]       |
+------------------------------------------------------------------+
|                                                                   |
|  Mary Smith                    Care recipient · Primary           |
|  Mom · 123 Oak St              [View profile]                     |
|  --------------------------------                                 |
|  John Smith                    Family · Primary contact           |
|  Dad · john@email.com          [View profile]                     |
|  --------------------------------                                 |
|  Jane Doe                      Caregiver                          |
|  Assigned to Mary S.           [View profile]                     |
|                                                                   |
+------------------------------------------------------------------+
```

- **Elements:** Filter by role/type (recipient, family, caregiver); list rows with name, role, contact/location; “Add person”, “View profile”.
- **AC:** AC-U2 – Filter by role and org.

### 3.2 Person Profile (Care Recipient)

```
+------------------------------------------------------------------+
| ← Back   Mary Smith                                               |
+------------------------------------------------------------------+
| [Avatar]   Mary Smith                                              |
|            Care recipient                                         |
|            [ Edit profile ]                                        |
+------------------------------------------------------------------+
| Care arrangement     [ Visits only        v ]  From: Feb 1, 2025  |
| 24/7 caregiver       Jane Doe (current)  [ Change ]               |
+------------------------------------------------------------------+
| Care circle (who's involved)                                      |
|  John Smith    Primary contact    [Edit] [Remove]                  |
|  Jane Doe      Aide · 24/7        [Edit] [Remove]                   |
+------------------------------------------------------------------+
| Care plan            Post-hospital recovery    [ View ] [ Edit ]   |
| Next visit           Wed Feb 5, 10:00 AM       [ Schedule ]       |
+------------------------------------------------------------------+
```

- **Sections:** Profile header; Care arrangement (mode + effective date); 24/7 caregiver; Care circle (care relationships); Care plan; Next visit.
- **AC:** AC-CR1, AC-CA1 – Care arrangement dropdown; related people with 24/7 badge; add/edit/remove relationship.

### 3.3 Invite Person (Modal or Page)

```
+------------------------------------------+
| Invite to [ My family v ]                |
|                                          |
| Email      [________________________]    |
| Role       [ Family editor    v ]        |
|            [ Send invite ]  [ Cancel ]    |
+------------------------------------------+
```

- **AC:** AC-U3, AC-M2 – Invite with org, role, email.

---

## 4. Schedule

### 4.1 Schedule View (Calendar + List)

```
+------------------------------------------------------------------+
| Schedule     [ + New visit ]    [ Day | Week | Month ]  [Filter v]|
+------------------------------------------------------------------+
| Filter: Recipient [ All v ]  Caregiver [ All v ]  Location [ All ]|
+------------------------------------------------------------------+
|                                                                   |
|  Wed Feb 5, 2025                                                  |
|  +----------+----------+----------+----------+                    |
|  | 8 AM     | 10 AM    | 12 PM    | 2 PM     |                    |
|  +----------+----------+----------+----------+                    |
|  |          | [Visit]  |          | [Visit]  |                    |
|  |          | Mary S.  |          | John K.  |                    |
|  |          | Jane D.  |          | Unassigned                   |
|  +----------+----------+----------+----------+                    |
|  | 24/7 block: Mary S. – Jane Doe (all day)                      |
|  +----------------------------------------------------------------+|
+------------------------------------------------------------------+
```

- **Elements:** View toggle (Day/Week/Month); filters (recipient, caregiver, location); calendar grid with visit blocks and 24/7 block; “New visit”.
- **AC:** AC-V1, AC-A24-2 – Visits as blocks; 24/7 continuous block; filter by recipient, caregiver.

### 4.2 Create / Edit Visit

```
+------------------------------------------+
| New visit (or Edit visit)                |
|                                          |
| Care recipient  [ Mary Smith    v ]      |
| Caregiver       [ Jane Doe       v ]  (or "Unassigned") |
| Visit type      [ Personal care  v ]     |
| Start           [ 2025-02-05 10:00 ]     |
| End             [ 2025-02-05 12:00 ]     |
| Address         [ 123 Oak St (default) ] |
| Repeats?        [ No / Daily / Weekly ]  |
|                                          |
| [ Save ]  [ Cancel ]  (Edit: [ Delete ])  |
+------------------------------------------+
```

- **AC:** AC-V2, AC-V4 – Recipient, caregiver (or unassigned), type, start/end, address, recurrence.

---

## 5. Caregiver – Visit Flow

### 5.1 Today’s Visits (from Dashboard or Schedule)

Same as 2.2; each visit has “Start visit” → navigates to Visit in progress.

### 5.2 Visit In Progress (Task List + Note)

```
+------------------------------------------------------------------+
| ← Back   Visit · Mary Smith     [ End visit ]                     |
+------------------------------------------------------------------+
| 123 Oak St · Personal care · 10:00 AM – 12:00 PM                   |
+------------------------------------------------------------------+
| Tasks                                                             |
|  [ ] Morning hygiene                    [Complete] [Skip] [Note]  |
|  [x] Medication – 9 AM dose             Done 10:15 AM             |
|  [ ] Light exercise                     [Complete] [Skip] [Note]  |
+------------------------------------------------------------------+
| Visit note (optional now; required on End visit)                   |
| Summary  [________________________________________]               |
| Mood     [ Good v ]   Next steps [________________]               |
+------------------------------------------------------------------+
|                                    [ End visit ]                  |
+------------------------------------------------------------------+
```

- **Elements:** Visit header; task list with Complete/Skip/Note and completed time; visit note fields (summary, mood, next steps); “End visit”.
- **AC:** AC-T1, AC-T2, AC-N1 – Task list with complete/skip/decline and notes; end visit with summary.

### 5.3 24/7 Assignment – Tasks & Note

```
+------------------------------------------------------------------+
| Mary Smith · 24/7 assignment    [ Add daily note ]                |
+------------------------------------------------------------------+
| Today's tasks · Feb 5, 2025                                       |
|  [ ] Morning routine                  [Complete] [Skip] [Note]    |
|  [ ] Medication round 1                [Complete] [Skip] [Note]    |
|  [ ] Lunch assist                     [Complete] [Skip] [Note]    |
+------------------------------------------------------------------+
| Recent notes                                                      |
|  Feb 4 – "Restful night, good appetite..."                        |
|  Feb 3 – "Outing to park, mood positive."                          |
+------------------------------------------------------------------+
```

- **AC:** AC-A24-3, AC-N2 – Ongoing task list for the day; add daily note; no visit check-in/out.

---

## 6. Care Plans & Tasks

### 6.1 Care Plan Detail (by Recipient)

```
+------------------------------------------------------------------+
| ← Back   Care plan · Mary Smith                                   |
+------------------------------------------------------------------+
| Post-hospital recovery                      [ Edit ]              |
| Effective from Feb 1, 2025 · Status: Active                       |
|                                                                   |
| Goals                                                             |
| Support recovery after hip surgery; maintain mobility and safety. |
|                                                                   |
| Focus areas   Mobility · Medication · Nutrition                  |
|                                                                   |
+------------------------------------------------------------------+
| Today's tasks (Feb 5)              [ Add task ]                   |
|  [x] Morning hygiene                10:15 AM  [View note]           |
|  [ ] Afternoon walk                Pending                          |
|  [ ] Evening medication            Pending                         |
+------------------------------------------------------------------+
```

- **AC:** AC-CP1, AC-CP2 – Care plan name, goals, focus areas; task list for today with status and time.

### 6.2 Task List (Standalone or in Visit)

- In visit: see 5.2.
- Standalone “Tasks” tab: filter by recipient and date; same row actions (Complete/Skip/Note) and optional note/time.

---

## 7. Agency – 24/7 Assignment

### 7.1 Assign 24/7 Caregiver

```
+------------------------------------------+
| Assign 24/7 caregiver                    |
|                                          |
| Care recipient  [ Mary Smith    v ]      |
| Caregiver       [ Jane Doe       v ]     |
| Type            [ Primary    v ]         |
| Start date      [ 2025-02-01 ]           |
| End date        [ (ongoing) ] optional   |
| Notes           [________________]       |
|                                          |
| [ Save ]  [ Cancel ]                      |
+------------------------------------------+
```

- **AC:** AC-A24-1 – Assign 24/7 with recipient, caregiver, type (primary/relief), start/end.

### 7.2 Current 24/7 Assignments List

```
| Current 24/7 assignments                                              |
|  Mary Smith     ← Jane Doe      Primary   From Feb 1   [ Edit ] [ End ] |
|  John K.        ← Alice B.      Primary   From Jan 15  [ Edit ] [ End ] |
```

---

## 8. Messages

### 8.1 Conversation List

```
+------------------------------------------------------------------+
| Messages                                         [ New message ]  |
+------------------------------------------------------------------+
| [ All | Care circle ]  Search [____________]                       |
+------------------------------------------------------------------+
|  Mary's care circle                    Feb 5, 10:30 AM            |
|  Jane: "Visit completed, all tasks..."                    (2)     |
|  -----------------------------------------------------------------|
|  John Smith (direct)                   Feb 4, 3:00 PM             |
|  You: "I'll be there tomorrow 10 AM"                              |
|  -----------------------------------------------------------------|
+------------------------------------------------------------------+
```

- **Elements:** Tabs or filter (All / Care circle); search; list of threads with title, last message preview, time, unread count.
- **AC:** Messages by recipient or care circle.

### 8.2 Thread View

```
+------------------------------------------------------------------+
| ← Back   Mary's care circle                                       |
+------------------------------------------------------------------+
|  John Smith    Wed 10:30  "Visit completed, all tasks done..."   |
|  Jane Doe      Wed 10:15  "Starting visit now."                    |
|  You           Tue 4:00   "Thanks for the update."               |
+------------------------------------------------------------------+
| [ Type a message...                    ] [ Send ]                  |
+------------------------------------------------------------------+
```

- **AC:** Thread with messages; send new message.

### 8.3 New Message

```
| To        [ Care circle: Mary S. v ] or [ Direct: person v ]       |
| Message   [________________________________________]              |
|           [ Send ]  [ Cancel ]                                     |
```

---

## 9. Settings

### 9.1 Profile (User)

```
| Profile                                                           |
|  First name   [ John    ]   Last name [ Smith  ]                   |
|  Email        [ john@... ]   (read-only or verify)                 |
|  Phone        [ +1...   ]   Secondary [ _______ ]                  |
|  Timezone     [ America/New_York v ]   Language [ en-US v ]        |
|  Avatar       [ Upload photo ]                                     |
|  [ Save ]                                                         |
```

- **AC:** AC-U1 – Editable name, phone(s), email, timezone, avatar.

### 9.2 Organization (Household / Agency)

```
| Organization   My family (Household)                               |
|  Name          [ My family    ]                                    |
|  Phone         [ _____________ ]   Email [ _____________ ]         |
|  Address       [ _____________ ]                                    |
|  Timezone      [ America/New_York v ]                              |
|  (Agency only: Locations list + Add location)                     |
|  [ Save ]                                                         |
```

- **AC:** AC-O1 – Name, contact, address, timezone; agency locations.

---

## 10. Mobile (Bottom Nav)

```
+------------------------------------------------------------------+
|                         [Page content]                           |
+------------------------------------------------------------------+
|  [ Home ]  [ Schedule ]  [ Tasks ]  [ Messages ]  [ More ]          |
+------------------------------------------------------------------+
```

- **More:** People, Settings, Profile, Log out.
- **Flows:** Start visit, End visit, Log tasks – full-screen as in 5.2; pull-to-refresh on list screens.

---

## Wireframe Summary – MVP-1

| Screen / Flow              | Persona     | Key AC        |
|----------------------------|------------|---------------|
| Login                      | All        | —             |
| Context switcher           | All        | AC-O2         |
| Family dashboard           | Family     | —             |
| Caregiver dashboard (visits) | Caregiver | AC-V3         |
| Caregiver dashboard (24/7) | Caregiver  | AC-A24-3      |
| Agency dashboard           | Agency     | —             |
| People list                | Family/Agency | AC-U2      |
| Person profile (recipient) | Family/Agency | AC-CR1, AC-CA1 |
| Invite person              | Admin      | AC-U3, AC-M2  |
| Schedule (calendar)        | All        | AC-V1, AC-A24-2 |
| Create/Edit visit          | Agency/Family editor | AC-V2, AC-V4 |
| Visit in progress + tasks  | Caregiver  | AC-T1, AC-T2, AC-N1 |
| 24/7 tasks & daily note    | Caregiver  | AC-N2         |
| Care plan detail + tasks   | All        | AC-CP1, AC-CP2 |
| Assign 24/7 (agency)       | Agency     | AC-A24-1      |
| Message list & thread      | All        | —             |
| Settings (profile, org)    | All        | AC-U1, AC-O1  |

Use this document as the reference for building UI and for generating higher-fidelity mockups (e.g. in Figma).
