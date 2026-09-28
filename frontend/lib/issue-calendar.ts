import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ACTIVE_ISSUE_STATUSES } from "@/constants/issue-statuses";
import type { Issue } from "@/types/issue";

export type CalendarEventType = "reported" | "resolved" | "due";

export interface IssueCalendarEvent {
  type: CalendarEventType;
  issue: Issue;
}

/** Local calendar-day key, e.g. "2026-09-28". */
export function dayKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function toDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isActive(issue: Issue): boolean {
  return ACTIVE_ISSUE_STATUSES.includes(issue.status);
}

/** Flatten issues into per-day calendar events keyed by local date. */
export function buildDayMap(issues: Issue[], now: Date = new Date()): Map<string, IssueCalendarEvent[]> {
  const map = new Map<string, IssueCalendarEvent[]>();
  const push = (date: Date | null, event: IssueCalendarEvent) => {
    if (!date) return;
    const key = dayKey(date);
    map.set(key, [...(map.get(key) ?? []), event]);
  };

  for (const issue of issues) {
    push(toDate(issue.submittedAt ?? issue.createdAt), { type: "reported", issue });
    push(toDate(issue.resolvedAt), { type: "resolved", issue });
    const target = toDate(issue.targetResponseAt);
    if (target && isActive(issue) && isAfter(now, target)) {
      push(target, { type: "due", issue });
    }
  }
  return map;
}

/** Weeks covering the whole month, Monday-start, including adjacent-month padding days. */
export function getMonthGrid(month: Date): Date[][] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  const weeks: Date[][] = [];
  for (let day = start; day <= end; day = addDays(day, 7)) {
    weeks.push(Array.from({ length: 7 }, (_, i) => addDays(day, i)));
  }
  return weeks;
}

/** The 7 days (Mon–Sun) of the week containing `date`. */
export function getWeekStrip(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function countByType(events: IssueCalendarEvent[]): Record<CalendarEventType, number> {
  return events.reduce(
    (acc, e) => ({ ...acc, [e.type]: acc[e.type] + 1 }),
    { reported: 0, resolved: 0, due: 0 },
  );
}
