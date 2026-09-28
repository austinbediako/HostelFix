# HostelFix Backend — Next Agent Handoff

> **Last updated:** 2026-09-22 after simplified workflow and shared dashboard implementation.  
> **Backend directory:** `/Users/kaeytee/Desktop/Joenick/HostelFix/backend`  
> **Docs directory:** `/Users/kaeytee/Desktop/Joenick/HostelFix/hostelfix-backend-docs`

## Current state

The HostelFix backend is implemented, type-safe, lint-clean, and fully tested:

- `pnpm run build` passes
- `pnpm run typecheck` passes
- `pnpm run lint` passes
- `pnpm test` passes (10 test files, 30 tests)

It uses **Express 5 + TypeScript + Mongoose**, JWT access/refresh tokens in **HTTP-only cookies**, Zod validation, role-plus-object-level authorization, structured Pino logging, and an in-memory job queue with hourly overdue-escalation and resolved-issue auto-close jobs.

The implemented issue lifecycle is `submitted -> acknowledged -> resolved -> closed`, with rejection, clarification events, reopening, optional assignment, and a direct `submitted -> resolved` path for work completed offline before the record was updated. The maintenance role remains available but is not a mandatory workflow gate.

## How to run locally

```bash
cd /Users/kaeytee/Desktop/Joenick/HostelFix/backend
cp .env.example .env
pnpm install
pnpm run seed
pnpm run seed:admin
pnpm run seed:dev
pnpm run dev
```

- Local `.env` API base URL: `http://localhost:5001/api/v1`
- Health check: `http://localhost:5001/health`
- Swagger UI / OpenAPI: `http://localhost:5001/api/v1/docs`
- The example/default port may differ; the configured `PORT` is authoritative.
- OpenAPI spec file: <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/docs/openapi.yaml" />

## Entry points and wiring

| Responsibility | File |
| --- | --- |
| Express app factory (middleware + route registration) | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/app.ts" /> |
| Server bootstrap, DB connect, job registration, graceful shutdown | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/server.ts" /> |
| Environment validation | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/config/environment.ts" /> |
| Database connection | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/config/database.ts" /> |
| Structured logger | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/config/logger.ts" /> |
| Cloudinary signature + URL validation | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/config/cloudinary.ts" /> |

## Modules

| Module | Routes | Controller | Service | Models |
| --- | --- | --- | --- | --- |
| Auth | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/auth/auth.routes.ts" /> | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/auth/auth.controller.ts" /> | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/auth/auth.service.ts" /> | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/auth/refresh-token.model.ts" />, <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/auth/password-reset-token.model.ts" /> |
| Users | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/users/user.routes.ts" /> | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/users/user.controller.ts" /> | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/users/user.service.ts" /> | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/users/user.model.ts" /> |
| Residences | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/residences/hall.routes.ts" /> | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/residences/hall.controller.ts" /> | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/residences/hall.service.ts" /> | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/residences/hall.model.ts" />, <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/residences/location.model.ts" /> |
| Issues | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/issues/issue.routes.ts" /> | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/issues/issue.controller.ts" /> | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/issues/issue.service.ts" /> | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/issues/issue.model.ts" />, <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/issues/issue-event.model.ts" />, <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/issues/reference-counter.model.ts" /> |
| Assignments | (service only) | — | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/assignments/assignment.service.ts" /> | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/assignments/assignment.model.ts" /> |
| Notifications | (service only) | — | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/notifications/notification.service.ts" /> | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/notifications/notification.model.ts" /> |
| Analytics | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/analytics/analytics.routes.ts" /> | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/analytics/analytics.controller.ts" /> | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/analytics/analytics.service.ts" /> | Uses Issue/Hall models |
| Audit Logs | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/audit-logs/audit-log.routes.ts" /> | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/audit-logs/audit-log.controller.ts" /> | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/audit-logs/audit-log.service.ts" /> | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/audit-logs/audit-log.model.ts" /> |
| Uploads | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/uploads/upload.routes.ts" /> | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/uploads/upload.controller.ts" /> | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/uploads/upload.service.ts" /> | — |

## Middleware and policies

| Responsibility | File |
| --- | --- |
| JWT cookie authentication | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/middleware/authenticate.ts" /> |
| Role-based guards | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/middleware/authorize.ts" /> |
| Zod request validation (rejects unknown properties) | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/middleware/validate-request.ts" /> |
| Rate limiting | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/middleware/rate-limit.ts" /> |
| Request IDs + global error handler + 404 | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/middleware/request-id.ts" />, <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/middleware/error-handler.ts" />, <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/middleware/not-found.ts" /> |
| Issue authorization | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/policies/issue.policy.ts" /> |
| Hall authorization | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/policies/hall.policy.ts" /> |
| User authorization | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/policies/user.policy.ts" /> |

## Jobs

| Job | File |
| --- | --- |
| In-memory queue + worker registration | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/jobs/queue.ts" /> |
| Notification delivery worker | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/jobs/send-notification.job.ts" /> |
| Hourly overdue escalation cron | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/jobs/escalate-overdue-issues.job.ts" /> |
| Hourly resolved-issue auto-close cron | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/jobs/auto-close-resolved-issues.job.ts" /> |

## Tests

| Suite | Directory |
| --- | --- |
| Unit tests | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/tests/unit" /> |
| Integration tests | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/tests/integration" /> |
| Permission-denial tests | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/tests/permission" /> |
| Shared test helpers | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/tests/helpers.ts" /> |
| Test setup (MongoDB memory server) | <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/tests/setup.ts" /> |

Run all tests with `pnpm test`.

## Next.js frontend integration steps

1. **Base URL and cookies**
   - Set the API base URL to the backend's configured port (`http://localhost:5001/api/v1` in the current local environment) or the deployed domain.
   - Every request must include credentials: `fetch(url, { credentials: 'include' })` or `axios.defaults.withCredentials = true`.
   - The frontend never stores JWTs in `localStorage`.

2. **Authentication flow**
   - Log in via `POST /api/v1/auth/login`.
   - Read current user/permissions via `GET /api/v1/auth/me`.
   - Log out via `POST /api/v1/auth/logout`.
   - The access token is short-lived; the backend automatically refreshes it via the `refresh_token` cookie on `POST /api/v1/auth/refresh` when needed.

3. **Issue creation with image upload**
   - Call `POST /api/v1/uploads/signature` to get a Cloudinary signature.
   - Upload the image directly from the browser to Cloudinary using the signature.
   - Send the returned Cloudinary URL to `POST /api/v1/issues` as `imageUrls`.
   - The current issue request uses `hallId`, `room`, `category`, `description`, `reportedPriority`, and optional `imageUrls`. `reporterId` is derived server-side, and the backend resolves the room to a controlled location.
   - Students may pick **any** approved UG-managed hall, not only their allocated hall.

4. **Residence data**
   - Populate the hall selector from `GET /api/v1/halls`.
   - Populate the location selector from `GET /api/v1/halls/:hallId/locations`.

5. **Role-based dashboards**
   - Every role uses the canonical `/dashboard` namespace; authenticated role data selects the visible navigation, content, and API scope.
   - **Student:** list own issues via `GET /api/v1/issues`; view/update via the issue endpoints.
   - **Hall Manager:** acknowledge/reject/clarify via `PATCH /api/v1/issues/:issueId/acknowledge`; change priority via `PATCH /api/v1/issues/:issueId/priority`; close early via `PATCH /api/v1/issues/:issueId/status`. Optional assignment via `POST /api/v1/issues/:issueId/assignments`. Use `GET /api/v1/halls/:hallId/dashboard` for metrics.
   - **Maintenance personnel:** view issues in assigned halls; mark `resolved` directly from `acknowledged` via `PATCH /api/v1/issues/:issueId/status`.
   - **University admin:** use `GET /api/v1/analytics/overview` and `GET /api/v1/audit-logs`.
   - **System admin:** change user roles via `PATCH /api/v1/users/:userId/roles`.

6. **Status history**
   - Poll or render `GET /api/v1/issues/:issueId/events` for the immutable audit trail.

## Known workflow gaps

- The status request accepts a `message`, but `updateIssueStatus` currently does not persist it to the issue event or audit metadata. Resolution notes entered by the UI are therefore lost and should be fixed before relying on them operationally.
- Structured external-resolver details and completion-photo evidence are not implemented.
- Duplicate reports cannot yet be linked to one primary issue; managers can only reject and reference the primary issue in text.
- There is no dedicated emergency-contact interface. Emergency work must happen first and be recorded afterward.

## Production hardening checklist

- [ ] Replace the in-memory queue in <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/jobs/queue.ts" /> with BullMQ/SQS if notification volume grows.
- [ ] Configure a real email provider (`sendgrid` or `smtp`) in `.env` only after explicit approval; the default is `stub`.
- [ ] Run MongoDB as a replica set to enable multi-document transactions.
- [ ] Set `NODE_ENV=production`, `COOKIE_SECURE=true`, and serve over HTTPS.
- [ ] Add a weekly maintenance summary cron job (template exists in the original architecture plan but was not implemented).
- [ ] Replace synthetic seeded locations in <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/residences/hall.service.ts" /> with real UG residence data.
- [ ] Decide and document image retention/removal policy.
- [ ] Add rate-limit storage (Redis) for multi-instance deployments.
- [ ] Add monitoring/error tracking (e.g., Sentry) and structured log shipping.

## Common commands

```bash
# Install
pnpm install

# Code quality
pnpm run typecheck
pnpm run lint

# Tests
pnpm test
pnpm test:unit
pnpm test:integration
pnpm test:permission

# Seed
pnpm run seed
pnpm run seed:admin
pnpm run seed:dev

# Run
pnpm run dev
pnpm run build
pnpm start
```

## Assumptions to preserve

- No public registration endpoint; accounts are seeded or admin-provisioned.
- Only the nine University-managed halls in `hall.service.ts` are valid.
- Images are uploaded directly to Cloudinary; the backend only stores validated URLs.
- Issue status transitions are enforced in <ref_file file="/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/policies/issue.policy.ts" />.
- Authorization is object-level, not just role-based.
