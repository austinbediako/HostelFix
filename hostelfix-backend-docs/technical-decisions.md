# Technical Decisions That Matter

> **Implementation status:** Applied in `/Users/kaeytee/Desktop/Joenick/HostelFix/backend`. See the concrete choices in [`backend/README.md`](../backend/README.md) and the next-phase recommendations in [handoff-next-steps.md](handoff-next-steps.md).

## 1. Modular Monolith First

**Decision:** Build one Express API with well-defined modules.

**Why:** It is easier to test, deploy, debug, and understand than microservices. The University scope is substantial, but it does not require independent services on day one.

**Future split candidates:** notifications, analytics, and image processing. Split only when scale, team boundaries, or operational load justify it.

## 2. Express Is the Domain Backend

**Decision:** Next.js renders the user experience; Express owns domain rules and database operations.

**Why:** The API should remain reusable by a future mobile app, internal University system, or reporting tool. This also prevents critical rules from being scattered between frontend code and API routes.

## 3. Role Plus Object-Level Authorization

**Decision:** Use role checks and ownership or hall-scope checks on every protected resource.

**Why:** A Hall Management user might have a valid account yet still be forbidden from accessing another hall's issues. This is the most important access-control boundary.

## 4. Current State Plus Immutable History

**Decision:** Keep the latest status in `issues` and every change in `issue_events`.

**Why:** Dashboards need fast current state; management needs a reliable history for accountability, response-time reporting, and dispute resolution.

## 5. Background Notifications

**Decision:** Save an issue first, then notify asynchronously.

**Why:** Email or messaging providers can fail or become slow. A notification failure must not lose a maintenance report.

## 6. External Image Storage

**Decision:** Store images in Cloudinary and keep metadata/URLs in MongoDB.

**Why:** It avoids oversized database documents, enables image transformations, and keeps API memory use lower.

## 7. Controlled Residence Directory

**Decision:** Seed nine approved halls and manage locations through authorised administrative tools.

**Why:** Free-text hall and room inputs create duplicate names, unusable analytics, and incorrect routing.

## 8. API-First Documentation

**Decision:** Maintain OpenAPI documentation before or alongside implementation.

**Why:** It makes the frontend, backend, QA, and future coding agents agree on inputs, outputs, errors, and permissions.

## 9. Observability From Day One

**Decision:** Add structured logs, request IDs, error monitoring, and health checks.

**Why:** In production, the first question is not “did the code deploy?” but “which request failed, for whom, and why?”

## 10. MongoDB Indexes Are Product Features

**Decision:** Add indexes for dashboard and queue queries before production.

**Why:** A hall dashboard that scans every issue record will become slow as records grow. Indexes protect the user experience.

