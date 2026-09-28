import { describe, expect, it } from "vitest";
import {
  buildDayMap,
  countByType,
  dayKey,
  getMonthGrid,
  getWeekStrip,
} from "@/lib/issue-calendar";
import type { Issue } from "@/types/issue";

const base: Issue = {
  id: "1",
  referenceNumber: "HF-LEG-20260928-0001",
  status: "submitted",
  category: "plumbing",
  reportedPriority: "normal",
  priority: "normal",
  description: "Leaking tap",
  imageUrls: [],
  reporter: null,
  hall: null,
  location: null,
  assignedTo: [],
  resolvedAt: null,
  closedAt: null,
  disputeWindowExpiresAt: null,
  submittedAt: "2026-09-28T09:00:00.000Z",
  targetResponseAt: null,
  createdAt: "2026-09-28T09:00:00.000Z",
  updatedAt: "2026-09-28T09:00:00.000Z",
};

describe("issue calendar helpers", () => {
  it("groups reported, resolved, and overdue due events by local day", () => {
    const issues: Issue[] = [
      base,
      {
        ...base,
        id: "2",
        status: "resolved",
        submittedAt: "2026-09-26T10:00:00.000Z",
        resolvedAt: "2026-09-28T15:00:00.000Z",
      },
      {
        ...base,
        id: "3",
        status: "in_progress",
        submittedAt: "2026-09-27T10:00:00.000Z",
        targetResponseAt: "2026-09-28T12:00:00.000Z",
      },
      {
        ...base,
        id: "4",
        status: "closed",
        targetResponseAt: "2026-09-28T12:00:00.000Z",
      },
    ];

    const map = buildDayMap(issues, new Date("2026-09-29T00:00:00.000Z"));
    const events = map.get(dayKey(new Date("2026-09-28"))) ?? [];

    // issues 1 and 4 were both reported on 9/28; 2 resolved; 3 is overdue
    expect(events.map((e) => e.type).sort()).toEqual(["due", "reported", "reported", "resolved"]);
    // closed issue never produces a due event
    expect(events.some((e) => e.issue.id === "4" && e.type === "due")).toBe(false);
    expect(countByType(events)).toEqual({ reported: 2, resolved: 1, due: 1 });
  });

  it("skips invalid or missing dates without failing", () => {
    const issue = { ...base, submittedAt: "not-a-date", createdAt: "also-bad" };
    const map = buildDayMap([issue]);
    expect(map.size).toBe(0);
  });

  it("builds a Monday-start grid covering the whole month", () => {
    const weeks = getMonthGrid(new Date("2026-09-15"));
    expect(weeks[0][0].getDay()).toBe(1); // Monday
    const first = weeks[0][0];
    const last = weeks.at(-1)!.at(-1)!;
    expect(first <= new Date("2026-09-01")).toBe(true);
    expect(last >= new Date("2026-09-30")).toBe(true);
    expect(weeks.every((w) => w.length === 7)).toBe(true);
  });

  it("returns the 7 days of the current week", () => {
    const week = getWeekStrip(new Date("2026-09-28")); // a Monday
    expect(week).toHaveLength(7);
    expect(week[0].getDay()).toBe(1);
    expect(week[6].getDay()).toBe(0);
  });
});
