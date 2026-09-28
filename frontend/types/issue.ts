export type IssueCategory =
  | "plumbing"
  | "electrical"
  | "sanitation"
  | "internet"
  | "structural"
  | "other";

export type IssueStatus =
  | "submitted"
  | "under_review"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "reopened"
  | "rejected"
  | "closed";

export type IssuePriority = "emergency" | "high" | "normal" | "low";

export interface Issue {
  id: string;
  referenceNumber: string;
  status: IssueStatus;
  category: IssueCategory;
  reportedPriority: IssuePriority;
  priority: IssuePriority;
  description: string;
  imageUrls: string[];
  reporter: {
    id: string;
    name: string;
    email: string;
  } | null;
  hall: {
    id: string;
    name: string;
    code: string;
  } | null;
  location: {
    id: string;
    block?: string;
    floor?: string;
    room?: string;
    commonArea?: string;
    type: string;
  } | null;
  assignedTo: { id: string; name: string; email: string }[];
  resolvedAt: string | null;
  closedAt: string | null;
  disputeWindowExpiresAt: string | null;
  submittedAt: string | null;
  targetResponseAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IssueFilters {
  status?: IssueStatus;
  category?: IssueCategory;
  priority?: IssuePriority;
  hallId?: string;
  search?: string;
}

export interface IssueEvent {
  id: string;
  issueId: string;
  actorId: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  eventType: string;
  previousValue?: unknown;
  newValue?: unknown;
  message?: string;
  createdAt: string;
}

export interface CreateIssueInput {
  hallId: string;
  room: string;
  category: IssueCategory;
  description: string;
  reportedPriority: IssuePriority;
  imageUrls: string[];
}

export interface CommentInput {
  message: string;
}

export interface AcknowledgeInput {
  action: "acknowledge" | "reject" | "clarify";
  message?: string;
}

export interface PriorityInput {
  priority: IssuePriority;
  message?: string;
}

export interface AssignmentInput {
  personnelIds: string[];
  message?: string;
}

export interface StatusInput {
  status: IssueStatus;
}
