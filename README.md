# HostelFix

A University of Ghana Legon maintenance reporting and tracking system for the five traditional halls and four UGEL halls.

> **Implementation status:** The backend has been built in `/Users/kaeytee/Desktop/Joenick/HostelFix/backend`. See the [backend README](backend/README.md) for setup, scripts, and test commands. For the next phase (frontend integration and production hardening), read [handoff-next-steps.md](hostelfix-backend-docs/handoff-next-steps.md).

## Scope

Included University-managed student residences:

- Akuafo Hall
- Legon Hall
- Volta Hall
- Commonwealth Hall
- Mensah Sarbah Hall
- Hilla Limann Hall
- Alexander Adum Kwapong Hall
- Elizabeth Frances Sey Hall
- Jean Nelson Aka Hall

Private hostels and off-campus accommodation are deliberately out of scope.

## Start Here

1. Read [Architecture Tree](hostelfix-backend-docs/architecture-tree.md) for system boundaries and code organization.
2. Read [Workflows](hostelfix-backend-docs/workflows.md) for the end-to-end lifecycle of an issue.
3. Implement data collections and indexes using [Data Model](hostelfix-backend-docs/data-model.md).
4. Build endpoints from [API Contract](hostelfix-backend-docs/api-contract.md).
5. Apply all requirements in [Technical Decisions](hostelfix-backend-docs/technical-decisions.md) and [Blind Spots](hostelfix-backend-docs/blindspots.md).

## Running locally

1. Start MongoDB locally.
2. Install dependencies and seed the database:
   ```bash
   cd backend
   pnpm install
   pnpm run seed:dev
   ```
3. Start the backend:
   ```bash
   pnpm run dev
   ```
4. Start the frontend:
   ```bash
   cd ../frontend
   pnpm install
   pnpm dev
   ```
5. Open [http://localhost:3000/login](http://localhost:3000/login).

## Test accounts

After running `pnpm run seed:dev`, these accounts are available in the backend `.env`:

| ID | PIN | Role |
| --- | --- | --- |
| `11287773` | `12345` | student |
| `10000001` | `12345` | hall_manager |
| `10000002` | `12345` | maintenance |
| `10000003` | `12345` | university_admin |
| `10000004` | `12345` | system_admin |

After login every role lands on the same canonical URL — `/dashboard` — and the page content adapts to the logged-in role.

## Recommended Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend API: Node.js, Express.js, TypeScript
- Database: MongoDB
- Image storage: Cloudinary
- Background jobs: Redis + BullMQ when notification volume requires it
- API documentation: OpenAPI
- Testing: Vitest or Jest, Supertest, Playwright

## Core Actors

| Actor | Purpose |
| --- | --- |
| Student Resident | Reports problems, tracks their own issues, and disputes unsuccessful repairs. |
| Hall Management | Acknowledges reports, sets operational priority, coordinates work informally, and can record resolution. |
| University Maintenance Personnel | Optionally views relevant hall work and records completion; assignment is not a workflow gate. |
| University Administrator | Views cross-hall reporting and configures approved operational data. |
| System Administrator | Maintains technical configuration without changing issue history. |

## Operational model

HostelFix records the real maintenance workflow with minimal friction:

```text
Submitted → Acknowledged → Resolved → Closed
```

1. A student reports an issue.
2. Hall Management acknowledges it with one tap.
3. Repair work happens informally (verbally, WhatsApp, logbook).
4. Maintenance or Hall Management marks it resolved with a note/photo.
5. The issue auto-closes after a configurable dispute window (default 48h).
6. The student can reopen it during that window if the fix is unsatisfactory.

The intermediate `verified`, `assigned`, and `in_progress` statuses were removed
because they created a bottleneck: work was often already done before the system
allowed anyone to mark an issue resolved. Regular University maintenance staff can
still use the maintenance view, while hall managers can record work completed by a
contractor, caretaker, or other offline resolver without requiring that person to
have an account.

Emergency work must be reported to the appropriate emergency personnel first and
recorded in HostelFix during or after the response. HostelFix is not an emergency
dispatch system.

## Implementation boundaries

Implemented now: acknowledgement/rejection/clarification, optional assignment,
direct resolution by authorized hall staff, student reopening, audit events,
notifications, overdue escalation, and automatic closure after the dispute window.

Not yet implemented: linking duplicate reports to a primary issue, structured
external-resolver details, completion-photo upload during resolution, and dedicated
emergency-contact UI. Until those additions exist, resolver details and repair notes
can be recorded in the status message or comments.

## Non-Negotiable Rules

- The API, not the frontend, is the source of permission checks.
- A student can only access their own issue records.
- Hall Management can only access issues in assigned halls.
- Every material issue action creates an immutable audit event.
- An issue is not closed immediately when maintenance marks it resolved.
- Images are stored externally; the database stores metadata and URLs only.

## Documentation Map

| File | Use it for |
| --- | --- |
| [backend/README.md](backend/README.md) | Backend setup, scripts, architecture, tests |
| [architecture-tree.md](hostelfix-backend-docs/architecture-tree.md) | System modules and recommended backend folders |
| [workflows.md](hostelfix-backend-docs/workflows.md) | Issue, notification, escalation, and access flows |
| [data-model.md](hostelfix-backend-docs/data-model.md) | MongoDB collections, relationships, and indexes |
| [api-contract.md](hostelfix-backend-docs/api-contract.md) | REST endpoints, authorization, payloads, and statuses |
| [technical-decisions.md](hostelfix-backend-docs/technical-decisions.md) | Chosen design decisions and their rationale |
| [blindspots.md](hostelfix-backend-docs/blindspots.md) | Risks and mistakes to avoid before coding |
| [handoff-next-steps.md](hostelfix-backend-docs/handoff-next-steps.md) | Implementation status, file references, and next-agent/next-frontend instructions |
| [sources.md](hostelfix-backend-docs/sources.md) | Source links behind the institutional and technical assumptions |
