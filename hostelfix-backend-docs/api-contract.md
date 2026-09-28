# API Contract

> **Implementation status:** Implemented in `/Users/kaeytee/Desktop/Joenick/HostelFix/backend`. The canonical OpenAPI spec is at `backend/docs/openapi.yaml` and served at runtime via `/api/v1/docs`.

Base URL: `/api/v1`

## Authentication

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/auth/login` | Create a user session. |
| POST | `/auth/logout` | End the current session. |
| POST | `/auth/forgot-password` | Start password reset flow. |
| POST | `/auth/reset-password` | Complete password reset flow. |
| GET | `/auth/me` | Return authenticated user and permissions. |

## Issue Routes

| Method | Endpoint | Roles | Purpose |
| --- | --- | --- | --- |
| POST | `/issues` | Authenticated | Create issue in any approved UG-managed hall location. |
| GET | `/issues` | Role filtered | List visible issues. |
| GET | `/issues/:issueId` | Policy filtered | Retrieve one visible issue. |
| GET | `/issues/:issueId/events` | Policy filtered | Retrieve immutable issue history. |
| POST | `/issues/:issueId/comments` | Visible users | Add comment. |
| PATCH | `/issues/:issueId/acknowledge` | Hall Management+ | Acknowledge, reject, or request clarification. |
| PATCH | `/issues/:issueId/priority` | Hall Management+ | Change operational priority. |
| POST | `/issues/:issueId/assignments` | Hall Management+ | Assign maintenance personnel. |
| PATCH | `/issues/:issueId/status` | Role and state dependent | Advance permitted status. |
| POST | `/issues/:issueId/reopen` | Resident or Hall Management+ | Reopen resolved issue. |

## Upload Routes

| Method | Endpoint | Roles | Purpose |
| --- | --- | --- | --- |
| POST | `/uploads/signature` | Authenticated | Get a Cloudinary signed-upload signature. |

## Residence Routes

| Method | Endpoint | Roles | Purpose |
| --- | --- | --- | --- |
| GET | `/halls` | Authenticated | Read approved hall directory. |
| GET | `/halls/:hallId/locations` | Policy filtered | Read rooms/common areas in hall. |
| GET | `/halls/:hallId/dashboard` | Hall Management and above | Read hall issue metrics. |
| PATCH | `/halls/:hallId` | University administrator | Change controlled hall metadata. |

## Administration Routes

| Method | Endpoint | Roles | Purpose |
| --- | --- | --- | --- |
| GET | `/analytics/overview` | University administrator | Cross-hall performance metrics. |
| GET | `/audit-logs` | University administrator | Auditable operation history. |
| GET | `/users` | University administrator | Manage user accounts and assignments. |
| PATCH | `/users/:userId/roles` | System administrator | Change role through audited action. |

## Status workflow

The simplified lifecycle is:

```text
Submitted -> Acknowledged -> Resolved -> Closed
                |              |
            Rejected      Reopened
```

- `acknowledged` replaces the old `verified`, `assigned`, and `in_progress` states.
- Maintenance staff or hall managers assigned to the hall can resolve a `submitted`,
  `acknowledged`, or `reopened` issue. Administrators can do the same.
- This direct `submitted -> resolved` path records repairs completed before anyone
  updated the application; acknowledgement is not a work authorization gate.
- A resolved issue auto-closes after `RESOLVE_DISPUTE_WINDOW_HOURS` (default 48h)
  unless the student, assigned hall manager, or administrator reopens it.
- Assignment (`POST /issues/:issueId/assignments`) is optional metadata only.
- `PATCH /issues/:issueId/status` accepts an optional `message`, but the current
  service does not persist that message on the status event. Structured resolver
  identity and completion-photo fields are not implemented.

## Create Issue Request

```json
{
  "hallId": "6650...",
  "room": "A12",
  "category": "plumbing",
  "description": "The shared washroom shower is leaking continuously.",
  "reportedPriority": "high",
  "imageUrls": ["https://res.cloudinary.com/..."]
}
```

The current implementation accepts `hallId` and a room string, then resolves or
creates the controlled location server-side. The server derives `reporterId` from
the session. Students may report issues in any approved University-managed hall.
Never accept `reporterId`, `status`, `assignedToIds`, or audit metadata as trusted
client values.

## Standard Error Response

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to access this issue.",
    "requestId": "req_..."
  }
}
```

## API Safety Rules

- Validate all input with a schema library such as Zod.
- Apply rate limits to login, password reset, uploads, and issue creation.
- Return only fields the caller is authorised to see.
- Reject unknown properties on write requests.
- Use a single global Express error handler.
- Write a test for every role and every sensitive endpoint.

