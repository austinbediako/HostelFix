import type { IssueStatus } from "@/types/issue";

export const ISSUE_STATUSES: { value: IssueStatus; label: string }[] = [
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under Review" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "reopened", label: "Reopened" },
  { value: "rejected", label: "Rejected" },
  { value: "closed", label: "Closed" },
];

export const ACTIVE_ISSUE_STATUSES: IssueStatus[] = [
  "submitted",
  "under_review",
  "assigned",
  "in_progress",
  "reopened",
];

export function getStatusLabel(status: string) {
  return ISSUE_STATUSES.find((s) => s.value === status)?.label ?? status;
}
