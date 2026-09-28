import { PRIORITY_TARGET_HOURS, type IssuePriority } from '../constants/issue.js';

export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

export function getTargetResponseDate(submittedAt: Date, priority: IssuePriority): Date {
  return addHours(submittedAt, PRIORITY_TARGET_HOURS[priority]);
}

export function isOverdue(submittedAt: Date, priority: IssuePriority, now = new Date()): boolean {
  return now > getTargetResponseDate(submittedAt, priority);
}
