import type mongoose from 'mongoose';
import type { Express } from 'express';
import { ROLES } from '../shared/constants/roles.js';
import { ISSUE_STATUSES, type IssueStatus } from '../shared/constants/issue.js';
import type { IIssue } from '../modules/issues/issue.model.js';

function isAdmin(user: Express.User): boolean {
  return user.role === ROLES.UNIVERSITY_ADMIN || user.role === ROLES.SYSTEM_ADMIN;
}

function getIdString(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    const toString = (value as { toString(): string }).toString();
    if (toString !== '[object Object]') return toString;
    if ((value as { _id?: unknown })._id) return getIdString((value as { _id: unknown })._id);
  }
  return undefined;
}

function idEquals(a: unknown, b: unknown): boolean {
  return getIdString(a) === getIdString(b);
}

function isHallManagerFor(user: Express.User, hallId: mongoose.Types.ObjectId): boolean {
  return (
    user.role === ROLES.HALL_MANAGER &&
    user.assignedHallIds.some((id) => idEquals(id, hallId))
  );
}

function isMaintenanceFor(user: Express.User, hallId: mongoose.Types.ObjectId): boolean {
  return (
    user.role === ROLES.MAINTENANCE &&
    user.assignedHallIds.some((id) => idEquals(id, hallId))
  );
}

function isResolver(user: Express.User, issue: IIssue): boolean {
  return isHallManagerFor(user, issue.hallId) || isMaintenanceFor(user, issue.hallId);
}

function ownsIssue(user: Express.User, issue: IIssue): boolean {
  return user.role === ROLES.STUDENT && idEquals(issue.reporterId, user._id);
}

export function canViewIssue(user: Express.User, issue: IIssue): boolean {
  if (isAdmin(user)) return true;
  if (ownsIssue(user, issue)) return true;
  if (isHallManagerFor(user, issue.hallId)) return true;
  if (isMaintenanceFor(user, issue.hallId)) return true;
  return false;
}

export function canCreateIssue(_user: Express.User): boolean {
  return true; // any authenticated user can create; hall derived server-side
}

export function canCommentOnIssue(user: Express.User, issue: IIssue): boolean {
  return canViewIssue(user, issue);
}

export function canTriageIssue(user: Express.User, issue: IIssue): boolean {
  return isHallManagerFor(user, issue.hallId) || isAdmin(user);
}

export function canChangeIssuePriority(user: Express.User, issue: IIssue): boolean {
  return isHallManagerFor(user, issue.hallId) || isAdmin(user);
}

const RESOLVABLE_STATUSES: IssueStatus[] = [
  'submitted',
  'under_review',
  'assigned',
  'in_progress',
  'reopened',
];

export function canResolveIssue(user: Express.User, issue: IIssue): boolean {
  if (!RESOLVABLE_STATUSES.includes(issue.status)) return false;
  return isResolver(user, issue) || isAdmin(user);
}

export function canStartProgress(user: Express.User, issue: IIssue): boolean {
  if (!RESOLVABLE_STATUSES.includes(issue.status)) return false;
  return isResolver(user, issue) || isAdmin(user);
}

export function canReopenIssue(user: Express.User, issue: IIssue): boolean {
  if (issue.status !== 'resolved') return false;
  return ownsIssue(user, issue) || isHallManagerFor(user, issue.hallId) || isAdmin(user);
}

export function canCloseIssue(user: Express.User, issue: IIssue): boolean {
  if (issue.status !== 'resolved') return false;
  return isHallManagerFor(user, issue.hallId) || isAdmin(user);
}

interface TransitionRule {
  from: IssueStatus;
  to: IssueStatus;
  allowed: (user: Express.User, issue: IIssue) => boolean;
}

const STATUS_TRANSITIONS: TransitionRule[] = [
  { from: 'submitted', to: 'under_review', allowed: (u, i) => canTriageIssue(u, i) },
  { from: 'submitted', to: 'rejected', allowed: (u, i) => canTriageIssue(u, i) },
  { from: 'submitted', to: 'assigned', allowed: (u, i) => canTriageIssue(u, i) },
  { from: 'submitted', to: 'resolved', allowed: (u, i) => canResolveIssue(u, i) },
  { from: 'under_review', to: 'assigned', allowed: (u, i) => canTriageIssue(u, i) },
  { from: 'under_review', to: 'in_progress', allowed: (u, i) => canStartProgress(u, i) },
  { from: 'under_review', to: 'rejected', allowed: (u, i) => canTriageIssue(u, i) },
  { from: 'under_review', to: 'resolved', allowed: (u, i) => canResolveIssue(u, i) },
  { from: 'assigned', to: 'in_progress', allowed: (u, i) => canStartProgress(u, i) },
  { from: 'assigned', to: 'resolved', allowed: (u, i) => canResolveIssue(u, i) },
  { from: 'in_progress', to: 'resolved', allowed: (u, i) => canResolveIssue(u, i) },
  { from: 'reopened', to: 'under_review', allowed: (u, i) => canTriageIssue(u, i) },
  { from: 'reopened', to: 'in_progress', allowed: (u, i) => canStartProgress(u, i) },
  { from: 'reopened', to: 'resolved', allowed: (u, i) => canResolveIssue(u, i) },
  { from: 'resolved', to: 'reopened', allowed: (u, i) => canReopenIssue(u, i) },
  { from: 'resolved', to: 'closed', allowed: (u, i) => canCloseIssue(u, i) },
  // Admin emergency override: close from any non-closed state
  { from: 'submitted', to: 'closed', allowed: (u) => isAdmin(u) },
  { from: 'under_review', to: 'closed', allowed: (u) => isAdmin(u) },
  { from: 'assigned', to: 'closed', allowed: (u) => isAdmin(u) },
  { from: 'in_progress', to: 'closed', allowed: (u) => isAdmin(u) },
  { from: 'rejected', to: 'closed', allowed: (u) => isAdmin(u) },
  { from: 'reopened', to: 'closed', allowed: (u) => isAdmin(u) },
];

export function canTransitionStatus(
  user: Express.User,
  issue: IIssue,
  targetStatus: IssueStatus,
): boolean {
  if (!ISSUE_STATUSES.includes(targetStatus)) return false;
  const rule = STATUS_TRANSITIONS.find((t) => t.from === issue.status && t.to === targetStatus);
  if (!rule) return false;
  return rule.allowed(user, issue);
}

export function getAllowedNextStatuses(user: Express.User, issue: IIssue): IssueStatus[] {
  return STATUS_TRANSITIONS
    .filter((t) => t.from === issue.status && t.allowed(user, issue))
    .map((t) => t.to);
}
