# Workflows

> **Implementation status:** Implemented in `/Users/kaeytee/Desktop/Joenick/HostelFix/backend/src/modules/issues`. Status transitions are enforced in [`issue.policy.ts`](../backend/src/policies/issue.policy.ts) and [`issue.service.ts`](../backend/src/modules/issues/issue.service.ts).

## Design principle

The system records what happens; it does not force work to happen inside the app.
Most maintenance work is coordinated informally (verbal handoffs, WhatsApp,
logbooks). The backend captures the lifecycle with the smallest number of
bottlenecks possible.

## Issue Lifecycle

```text
Student creates issue in an approved University-managed hall
  -> Hall Management acknowledges, rejects, or requests clarification
  -> operational priority may be reviewed
  -> work is coordinated through the channel that is practical on site
  -> authorized Maintenance, Hall Management, or an administrator records Resolved
  -> student is notified
  -> student may reopen if not satisfied; otherwise it auto-closes
  -> issue becomes Closed
```

Acknowledgement means “the responsible hall team knows about the report.” It is not
an inspection certificate and does not authorize or block physical work. A resolver
may also mark a `submitted` issue resolved when the repair happened before the hall
manager updated the application.

The maintenance role is optional operational participation, not a mandatory handoff.
Regular staff with accounts can see issues in their assigned halls and mark work done.
If a caretaker, contractor, or other offline worker performs the repair, a hall
manager can record the resolution without creating an account for that worker.

## Valid Statuses

| Status | Meaning | Allowed actor |
| --- | --- | --- |
| Draft | Client-only unsaved form state. Do not persist unless a drafts feature is built. | Student |
| Submitted | Report entered by resident and awaiting acknowledgement. | Student |
| Acknowledged | Hall Management has seen and accepted the issue into the queue. | Hall Management |
| Rejected | Invalid, duplicate, or outside the University-managed residence scope. | Hall Management |
| Resolved | Repair work is claimed complete and awaits confirmation or auto-close. | Maintenance or Hall Management |
| Reopened | Resident or Hall Management disputes the resolution. | Student or Hall Management |
| Closed | Resolution has been confirmed or the confirmation period has elapsed. | System auto-close or Hall Management |

The intermediate statuses `verified`, `assigned`, and `in_progress` were removed
because they created a bottleneck: work was often already happening while the
system demanded additional status updates before anyone could mark an issue
resolved.

## Issue Priority Rules

| Priority | Use for | Example |
| --- | --- | --- |
| Emergency | Immediate threat to life, safety, property, or essential services. | Electrical sparks, exposed live wiring, flooding. |
| High | Serious disruption requiring rapid action. | Blocked shared washroom, major water leak. |
| Normal | Standard defect. | Broken shower fitting, faulty light. |
| Low | Minor inconvenience or cosmetic issue. | Damaged notice board. |

Priority must be reviewed by Hall Management. A resident may propose a priority but cannot set the final operational priority.

## Auto-close and Dispute Window

When an issue is marked `resolved`, a dispute window starts. The default length
is configurable via `RESOLVE_DISPUTE_WINDOW_HOURS` (default 48 hours). A student
may reopen the issue during this window. If no one reopens it, an hourly cron
job automatically changes the status to `closed`.

This removes the Hall Manager close-step bottleneck while preserving a window
for the resident to object.

## Emergency Workflow

HostelFix does not dispatch emergency responders. For exposed live wiring, fire,
major flooding, sewage overflow, structural danger, or another immediate hazard:

```text
Discover emergency
  -> contact the responsible emergency or hall personnel immediately
  -> contain or repair the hazard
  -> create or update the HostelFix record during or after the response
```

The digital record must never delay urgent physical action.

## Duplicate Reports

Duplicate linking is not currently implemented. Hall Management may reject a report
as a duplicate and identify the primary issue in the rejection message or a comment.
A future enhancement should link duplicate reports to one primary issue and notify
all affected reporters from that primary record.

## Resolution Evidence and Offline Resolvers

The current status endpoint accepts an optional message, which can describe the work
performed or identify an offline resolver. Issue comments can also hold follow-up
notes. Structured resolver fields and completion-photo uploads are not currently
implemented and must not be presented as existing API capabilities.

## Notification Workflow

```text
Issue event occurs
  -> write issue event and audit log
  -> create pending notification record
  -> background worker sends email or in-app notification
  -> record delivery attempt
  -> retry controlled failures
```

The API request should not wait for an email provider. The issue must be saved first; notification delivery happens asynchronously.

## Overdue Escalation Workflow

```text
Scheduled job runs hourly
  -> finds unresolved issues past their target response time
  -> creates escalation event
  -> notifies Hall Management
  -> escalates repeated overdue cases to University maintenance dashboard
```

Unresolved statuses for escalation purposes: `submitted`, `acknowledged`, `reopened`.

## Access Workflow

```text
Request reaches Express
  -> authenticate identity
  -> load role and hall assignments
  -> validate requested object exists
  -> execute object-level authorization policy
  -> run business action
  -> write audit event
  -> return safe response
```

Object-level authorization means a user is checked against the specific issue, not merely against a general role.
