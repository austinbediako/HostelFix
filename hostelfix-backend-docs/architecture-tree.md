# Architecture Tree

> **Implementation status:** The backend has been implemented in `/Users/kaeytee/Desktop/Joenick/HostelFix/backend`.
> See the actual file tree in [backend/README.md](../backend/README.md) and the module references in [handoff-next-steps.md](handoff-next-steps.md).

## System Architecture

```text
HostelFix Platform
|
+-- Next.js Frontend
|   +-- Student Resident Portal
|   +-- Hall Management Portal
|   +-- University Maintenance Portal
|   +-- Server-side UI session checks
|   `-- API client for Express backend
|
+-- Express.js Backend API
|   +-- Authentication and Session Module
|   +-- Authorization Policy Module
|   +-- Users and Allocation Module
|   +-- Residence Directory Module
|   +-- Issue Reporting Module
|   +-- Assignment and Work Order Module
|   +-- Notifications Module
|   +-- Analytics Module
|   +-- Audit Log Module
|   +-- File Upload Module
|   `-- Health and Observability Module
|
+-- MongoDB
|   +-- users
|   +-- halls
|   +-- locations
|   +-- issues
|   +-- issue_events
|   +-- assignments
|   +-- notifications
|   `-- audit_logs
|
`-- External Services
    +-- Cloudinary for image storage
    +-- Email provider for notifications
    +-- Redis and BullMQ for jobs, when needed
    `-- Error monitoring and application logs
```

## Implemented Backend Folder Tree

Located at `/Users/kaeytee/Desktop/Joenick/HostelFix/backend`:

```text
backend/
├── src/
│   ├── config/
│   │   ├── cloudinary.ts
│   │   ├── database.ts
│   │   ├── environment.ts
│   │   └── logger.ts
│   ├── jobs/
│   │   ├── escalate-overdue-issues.job.ts
│   │   ├── queue.ts
│   │   └── send-notification.job.ts
│   ├── middleware/
│   │   ├── authenticate.ts
│   │   ├── authorize.ts
│   │   ├── error-handler.ts
│   │   ├── not-found.ts
│   │   ├── rate-limit.ts
│   │   ├── request-id.ts
│   │   └── validate-request.ts
│   ├── modules/
│   │   ├── analytics/
│   │   ├── assignments/
│   │   ├── audit-logs/
│   │   ├── auth/
│   │   ├── issues/
│   │   ├── notifications/
│   │   ├── residences/
│   │   ├── uploads/
│   │   └── users/
│   ├── policies/
│   │   ├── hall.policy.ts
│   │   ├── issue.policy.ts
│   │   └── user.policy.ts
│   ├── shared/
│   │   ├── constants/
│   │   ├── errors/
│   │   ├── types/
│   │   └── utilities/
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── integration/
│   ├── permission/
│   └── unit/
├── scripts/
│   ├── seed-admin.ts
│   ├── seed-dev.ts
│   └── seed-halls.ts
├── docs/
│   └── openapi.yaml
├── .env.example
├── eslint.config.mjs
├── package.json
├── tsconfig.json
├── tsconfig.lint.json
├── vitest.config.ts
└── README.md
```

## Module Ownership Rule

Every module owns its own routes, request validation, business service, data access, and tests. Controllers should remain thin: validate input, call a service, return a response. Services contain the business rules. Policies answer authorization questions.

Do not create one large generic `routes`, `controllers`, or `models` folder containing unrelated application logic.

