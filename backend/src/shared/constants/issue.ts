export const ISSUE_STATUSES = [
  'submitted',
  'under_review',
  'assigned',
  'in_progress',
  'resolved',
  'reopened',
  'rejected',
  'closed',
] as const;

export type IssueStatus = (typeof ISSUE_STATUSES)[number];

export const ISSUE_CATEGORIES = [
  'plumbing',
  'electrical',
  'sanitation',
  'internet',
  'structural',
  'other',
] as const;

export type IssueCategory = (typeof ISSUE_CATEGORIES)[number];

export const ISSUE_PRIORITIES = ['emergency', 'high', 'normal', 'low'] as const;

export type IssuePriority = (typeof ISSUE_PRIORITIES)[number];

export const ISSUE_EVENT_TYPES = [
  'created',
  'status_changed',
  'priority_changed',
  'acknowledged',
  'under_review',
  'assigned',
  'in_progress',
  'commented',
  'reopened',
  'closed',
  'clarification_requested',
  'rejected',
  'resolved',
  'escalated',
] as const;

export type IssueEventType = (typeof ISSUE_EVENT_TYPES)[number];

export const PRIORITY_TARGET_HOURS: Record<IssuePriority, number> = {
  emergency: 1,
  high: 4,
  normal: 24,
  low: 72,
};
