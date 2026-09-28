# HostelFix Backend

A production-minded modular monolith API for HostelFix, a maintenance reporting and tracking system for University of Ghana Legon University-managed halls.

## Stack

- Node.js 24+ with Express 5
- TypeScript 5.9
- MongoDB with Mongoose 9
- JWT access/refresh tokens in HTTP-only cookies
- Zod validation
- Pino logging
- Vitest + Supertest for testing
- Swagger UI / OpenAPI

## Quick start

### Prerequisites

- [pnpm](https://pnpm.io/) 10.32.1+ (managed via `packageManager` field)
- MongoDB 6+ instance (local or Atlas)
- Node.js >= 24.0.0

### Install dependencies

```bash
pnpm install
```

### Configure environment

```bash
cp .env.example .env
# Edit .env with your secrets, Mongo URI, Cloudinary credentials, and frontend origin
```

### Run database seeding

```bash
# Seed the nine approved UG halls and sample locations
pnpm run seed

# Add the system administrator from SYSTEM_ADMIN_EMAIL / SYSTEM_ADMIN_PASSWORD in .env
pnpm run seed:admin

# Optional: add development sample users (student, hall manager, maintenance, university admin)
pnpm run seed:dev
```

### Start development server

```bash
pnpm run dev
```

The API uses the configured `PORT` (`5001` in the current local `.env`). With that configuration, the API is available at `http://localhost:5001`, OpenAPI/Swagger UI at `http://localhost:5001/api/v1/docs`, and health at `http://localhost:5001/health`.

### Build and run production

```bash
pnpm run build
pnpm start
```

## Architecture

```
src/
  config/          environment, database, logger, Cloudinary
  middleware/      auth, validation, rate limiting, error handling, request IDs
  modules/         feature modules (auth, users, residences, issues, assignments, notifications, analytics, audit-logs, uploads)
  policies/        reusable authorization decisions
  jobs/            in-memory job queue, notification worker, overdue escalation cron
  shared/          constants, errors, utilities, Express type augmentations
  app.ts           Express app factory
  server.ts        bootstrap and graceful shutdown
```

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Development with hot reload |
| `pnpm build` | TypeScript compile to `dist/` |
| `pnpm start` | Run compiled app |
| `pnpm seed` | Seed approved halls + locations |
| `pnpm seed:admin` | Seed system admin account |
| `pnpm seed:dev` | Seed development sample users |
| `pnpm test` | Run all tests |
| `pnpm test:unit` | Run unit tests |
| `pnpm test:integration` | Run integration tests |
| `pnpm test:permission` | Run permission-denial tests |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript `--noEmit` |

## Environment variables

Required and notable variables are listed in `.env.example`. Highlights:

- `MONGODB_URI` - MongoDB connection string
- `ACCESS_TOKEN_SECRET` / `REFRESH_TOKEN_SECRET` - strong random secrets
- `ACCESS_TOKEN_EXPIRY` / `REFRESH_TOKEN_EXPIRY` - JWT lifetimes
- `COOKIE_SECURE` / `COOKIE_SAMESITE` - cookie flags
- `CORS_ORIGIN` - Next.js frontend origin
- `CLOUDINARY_*` - Cloudinary direct-upload credentials
- `EMAIL_PROVIDER` - `stub` (logs locally) or `sendgrid` / `smtp`
- `RESOLVE_DISPUTE_WINDOW_HOURS` - delay before resolved issues auto-close (default 48)
- `SYSTEM_ADMIN_EMAIL` / `SYSTEM_ADMIN_PASSWORD` - seed-only admin

## Authentication

The API issues short-lived access tokens and longer-lived refresh tokens in HTTP-only, Secure/SameSite cookies. There is no public registration endpoint; accounts are seeded or provisioned by administrators from University records.

## Operational issue workflow

```text
Submitted -> Under Review -> Assigned -> In Progress -> Resolved -> Closed
```

Hall managers may reject a report or request clarification without adding a new
status. Students, hall managers, and administrators can reopen a resolved issue
according to policy. Resolved issues automatically close after the configured
dispute window.

Assignment and `in_progress` are first-class statuses but remain non-blocking:
assigning personnel moves an open issue to `assigned`, and staff can start work
(`in_progress`) from `under_review`, `assigned`, or `reopened`. Authorized staff
can still record a repair as resolved directly from any active status, so work
coordinated through verbal, WhatsApp, contractor, or caretaker channels is never
gated by the app — the API preserves the record and audit trail.

Current limitations: duplicate linking, structured offline-resolver details,
completion-photo evidence, and emergency-contact UI are not implemented. The status
payload accepts a message, but the service currently does not persist that message.

## Image uploads

Clients upload images directly to Cloudinary. The backend provides a signed upload signature at `POST /api/v1/uploads/signature` and validates returned Cloudinary URLs before storing metadata.

## Notification adapters

Email is not sent by default. Set `EMAIL_PROVIDER=stub` for local development (logs to stdout). Configure `sendgrid` or `smtp` with real credentials only when explicitly approved.

## Testing

Tests use `mongodb-memory-server` for isolated in-memory MongoDB instances. Run:

```bash
pnpm test
```

Permission tests cover:

- Student A cannot read Student B's issue
- Hall Manager for Hall A cannot access Hall B
- Maintenance personnel cannot assign themselves arbitrary issues
- Only System Administrators can change roles

## Seeded University-managed halls

The `pnpm seed` script creates exactly the nine approved halls:

- Akuafo Hall
- Legon Hall
- Volta Hall
- Commonwealth Hall
- Mensah Sarbah Hall
- Hilla Limann
- Alexander Adum Kwapong
- Elizabeth Frances Sey
- Jean Nelson Aka

Private hostels and off-campus accommodations are not seeded or accepted.

## Production caveats

- Set `NODE_ENV=production`, `COOKIE_SECURE=true`, and use HTTPS.
- Use a real MongoDB replica set to enable transactions.
- Rotate secrets and never commit `.env`.
- Configure a real email provider and review image retention/removal policies.
- Replace the in-memory job queue with a persistent worker (e.g., BullMQ/SQS) at scale.

## Next.js frontend integration

1. Point the frontend's API base URL at the configured backend port (`http://localhost:5001/api/v1` in the current local environment) or the deployed domain.
2. Ensure all API calls set `credentials: 'include'` (or `withCredentials: true`) so cookies are sent.
3. Use `POST /api/v1/auth/login` to authenticate; no token storage in `localStorage` is required.
4. Use `POST /api/v1/uploads/signature` to sign Cloudinary uploads before uploading from the browser.
5. Students create issues at `POST /api/v1/issues` using `hallId` and `room`; the backend resolves the controlled location server-side.

For a complete next-agent handoff with file references and production hardening checklist, see [`hostelfix-backend-docs/handoff-next-steps.md`](../hostelfix-backend-docs/handoff-next-steps.md).

## License

Internal use for the HostelFix project.
