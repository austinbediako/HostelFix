# ADR 001: Simplified issue workflow

## Status

Accepted

## Context

The original HostelFix workflow required every issue to pass through:

```text
Submitted → Verified → Assigned → In Progress → Resolved → Closed
```

In practice, University hall maintenance is coordinated informally. Caretakers
walk to the plumber's lodge, students alert hall management in person, and
work begins before anyone opens the app. The multi-step digital workflow became
a bottleneck: staff had to update statuses before acting, and adoption suffered.

## Decision

Reduce the issue lifecycle to:

```text
Submitted → Acknowledged → Resolved → Closed
```

- `Acknowledged` replaces `verified`, `assigned`, and `in_progress`.
- Hall Management acknowledges an issue in one tap.
- Maintenance or Hall Management can mark an acknowledged issue `resolved`
  without a formal assignment step.
- Resolved issues auto-close after a configurable dispute window.
- Students can reopen a resolved issue during the window.
- Assignment exists only as optional metadata for tracking who is responsible.

## Consequences

### Positive

- Fewer status updates required, matching how work actually gets done.
- Higher likelihood of adoption by hall staff and maintenance personnel.
- The audit trail is preserved; every status change still creates an event.
- Auto-close removes the Hall Manager close-step bottleneck.

### Negative

- Less granular visibility into "who is actively working on it".
- Reports can no longer distinguish between "assigned but not started" and
  "in progress" without reading comments/events.

## Alternatives considered

1. **Keep all statuses but make transitions optional.** Rejected because the UI
   still had to expose six statuses, confusing users.
2. **Merge Hall Manager and Maintenance roles.** Rejected because the user
   wanted to keep maintenance as a distinct role while simplifying its
   permissions.

## Implementation notes

- `backend/src/shared/constants/issue.ts` now lists only the simplified statuses.
- `backend/src/policies/issue.policy.ts` allows `resolved` from `acknowledged`
  for any resolver (maintenance or hall manager) in the issue's hall.
- `backend/src/jobs/auto-close-resolved-issues.job.ts` closes resolved issues
  whose dispute window has expired.
- `RESOLVE_DISPUTE_WINDOW_HOURS` controls the window length.
