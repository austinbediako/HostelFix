# Data Model

> **Implementation status:** Implemented as Mongoose models in `/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules`. Additional operational collections (`refresh_tokens`, `reference_counters`) were added for cookie-based JWT rotation and unique issue reference numbers.

## Primary Collections

### users

```ts
{
  _id: ObjectId,
  studentId?: string,
  staffId?: string,
  name: string,
  email: string,
  passwordHash?: string,
  role: "student" | "hall_manager" | "maintenance" | "university_admin" | "system_admin",
  active: boolean,
  assignedHallIds: ObjectId[],
  allocatedLocationId?: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### halls

```ts
{
  _id: ObjectId,
  name: string,
  type: "traditional" | "ugel",
  active: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

Seed exactly nine approved halls. Do not permit free-text hall creation by ordinary users.

### locations

```ts
{
  _id: ObjectId,
  hallId: ObjectId,
  block?: string,
  floor?: string,
  room?: string,
  commonArea?: string,
  type: "room" | "washroom" | "corridor" | "laundry" | "common_area" | "other",
  active: boolean
}
```

### issues

```ts
{
  _id: ObjectId,
  referenceNumber: string,
  reporterId: ObjectId,
  hallId: ObjectId,
  locationId: ObjectId,
  category: "plumbing" | "electrical" | "sanitation" | "internet" | "structural" | "other",
  priority: "emergency" | "high" | "normal" | "low",
  status: "submitted" | "acknowledged" | "rejected" | "resolved" | "reopened" | "closed",
  description: string,
  imageUrls: string[],
  assignedToIds: ObjectId[], // optional routing metadata; never a resolution prerequisite
  submittedAt: Date,
  resolvedAt?: Date,
  closedAt?: Date,
  disputeWindowExpiresAt?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### issue_events

```ts
{
  _id: ObjectId,
  issueId: ObjectId,
  actorId?: ObjectId, // omitted for system actions such as auto-close
  eventType: "created" | "status_changed" | "priority_changed" | "acknowledged" | "commented" | "reopened" | "closed" | "clarification_requested" | "rejected" | "resolved" | "escalated",
  previousValue?: unknown,
  newValue?: unknown,
  message?: string,
  createdAt: Date
}
```

### notifications

```ts
{
  _id: ObjectId,
  userId: ObjectId,
  issueId?: ObjectId,
  channel: "in_app" | "email",
  template: string,
  deliveryStatus: "pending" | "sent" | "failed",
  attempts: number,
  sentAt?: Date,
  createdAt: Date
}
```

### audit_logs

```ts
{
  _id: ObjectId,
  actorId?: ObjectId,
  action: string,
  resourceType: string,
  resourceId?: ObjectId,
  metadata: Record<string, unknown>,
  createdAt: Date
}
```

### refresh_tokens

```ts
{
  _id: ObjectId,
  userId: ObjectId,
  tokenHash: string,
  expiresAt: Date,
  createdAt: Date
}
```

Used for refresh-token rotation and revocation.

### reference_counters

```ts
{
  _id: ObjectId,
  hallCode: string,
  date: string,
  sequence: number,
  createdAt: Date,
  updatedAt: Date
}
```

Atomic counter for generating unique issue reference numbers such as `HF-AKU-20260908-0001`.

## Required Indexes

```text
users: unique(studentId), unique(email), role, assignedHallIds
locations: unique(hallId, block, floor, room, commonArea)
issues: referenceNumber unique
issues: (hallId, status, priority, createdAt)
issues: (reporterId, createdAt)
issues: (assignedToIds, status, updatedAt)
issue_events: (issueId, createdAt)
notifications: (userId, deliveryStatus, createdAt)
audit_logs: (resourceType, resourceId, createdAt)
refresh_tokens: (tokenHash), (userId)
reference_counters: unique(hallCode, date)
```

## Modeling Rules

- Store the current issue state in `issues` for fast dashboard queries.
- Store its history in `issue_events` for accountability and analytics.
- Store location once and reference it; do not repeat room details inconsistently.
- Use transactions only where several collections must change as one unit.
- Never allow client input to write system fields such as `role`, `status`, `assignedToIds`, or audit metadata without an explicit server-side rule.
- `assignedToIds` is optional accountability metadata. An issue can move from `submitted`, `acknowledged`, or `reopened` to `resolved` without an assignment.
- The current schema does not contain structured external-resolver, duplicate-link, or resolution-evidence fields. Until those are implemented, do not claim they are stored as first-class data.

