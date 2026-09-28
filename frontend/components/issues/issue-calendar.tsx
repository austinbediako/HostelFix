"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { addMonths, format, isSameDay, isSameMonth, isToday } from "date-fns";
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, FilePlus, TriangleAlert } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IssueStatusBadge } from "@/components/issues/issue-status-badge";
import {
  buildDayMap,
  countByType,
  dayKey,
  getMonthGrid,
  type CalendarEventType,
  type IssueCalendarEvent,
} from "@/lib/issue-calendar";
import type { Issue } from "@/types/issue";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const EVENT_META: Record<CalendarEventType, { label: string; dot: string; icon: typeof FilePlus }> = {
  reported: { label: "Reported", dot: "bg-primary", icon: FilePlus },
  resolved: { label: "Resolved", dot: "bg-success", icon: CheckCircle2 },
  due: { label: "Overdue", dot: "bg-danger", icon: TriangleAlert },
};

function locationLabel(issue: Issue): string {
  return [issue.hall?.name, issue.location?.room ?? issue.location?.commonArea ?? issue.location?.block]
    .filter(Boolean)
    .join(" • ");
}

function EventRow({ event }: { event: IssueCalendarEvent }) {
  const meta = EVENT_META[event.type];
  const Icon = meta.icon;
  return (
    <li>
      <Link
        href={`/dashboard/issues/${event.issue.id}`}
        className="block rounded-md border border-border bg-card px-3 py-2 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
            <span className={cn("size-2 rounded-full", meta.dot)} aria-hidden="true" />
            <Icon className="size-3.5 text-muted-foreground" aria-hidden="true" />
            {meta.label}
          </span>
          <span className="font-mono text-xs text-muted-foreground">{event.issue.referenceNumber}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm">{event.issue.description}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <IssueStatusBadge status={event.issue.status} />
          <span className="capitalize">{event.issue.category.replace("_", " ")}</span>
          {locationLabel(event.issue) && <span>{locationLabel(event.issue)}</span>}
        </div>
      </Link>
    </li>
  );
}

export function IssueCalendar({ issues }: { issues: Issue[] }) {
  const [month, setMonth] = useState(() => new Date());
  const [selected, setSelected] = useState(() => new Date());

  const dayMap = useMemo(() => buildDayMap(issues), [issues]);
  const weeks = useMemo(() => getMonthGrid(month), [month]);
  const monthTotal = useMemo(
    () =>
      weeks.flat().reduce(
        (sum, day) => (isSameMonth(day, month) ? sum + (dayMap.get(dayKey(day))?.length ?? 0) : sum),
        0,
      ),
    [weeks, month, dayMap],
  );
  const selectedEvents = dayMap.get(dayKey(selected)) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Issue Activity Calendar</CardTitle>
        <CardDescription>
          Reports, resolutions, and overdue targets by day — {monthTotal} events this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">{format(month, "MMMM yyyy")}</p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={() => setMonth(new Date())}>
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setMonth((m) => addMonths(m, -1))}
                  aria-label="Previous month"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setMonth((m) => addMonths(m, 1))}
                  aria-label="Next month"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>

            <div role="grid" aria-label={`Issues in ${format(month, "MMMM yyyy")}`}>
              <div role="row" className="grid grid-cols-7">
                {WEEKDAYS.map((d) => (
                  <div key={d} role="columnheader" className="pb-1 text-center text-xs font-medium text-muted-foreground">
                    {d}
                  </div>
                ))}
              </div>
              {weeks.map((week) => (
                <div role="row" key={dayKey(week[0])} className="grid grid-cols-7 gap-px">
                  {week.map((day) => {
                    const events = dayMap.get(dayKey(day)) ?? [];
                    const counts = countByType(events);
                    const isSelected = isSameDay(day, selected);
                    const inMonth = isSameMonth(day, month);
                    return (
                      <button
                        key={dayKey(day)}
                        type="button"
                        role="gridcell"
                        aria-selected={isSelected}
                        aria-label={`${format(day, "EEEE d MMMM")}, ${events.length} events`}
                        onClick={() => {
                          setSelected(day);
                          if (!inMonth) setMonth(day);
                        }}
                        className={cn(
                          "flex min-h-16 flex-col items-stretch gap-1 border border-border px-1.5 py-1 text-left transition-colors hover:bg-primary-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset md:min-h-20",
                          !inMonth && "bg-muted/60 text-muted-foreground",
                          inMonth && "bg-card",
                          isToday(day) && "bg-primary text-primary-foreground",
                          isSelected && "bg-primary-tint ring-2 ring-inset ring-primary",
                          isToday(day) && isSelected && "bg-primary ring-2 ring-inset ring-primary-foreground",
                        )}
                      >
                        <span className={cn("text-xs font-semibold", isToday(day) && "text-primary-foreground")}>
                          {format(day, "d")}
                        </span>
                        <span className="mt-auto flex items-center gap-1">
                          {(Object.keys(EVENT_META) as CalendarEventType[]).map(
                            (type) =>
                              counts[type] > 0 && (
                                <span
                                  key={type}
                                  className={cn(
                                    "size-1.5 rounded-full",
                                    isToday(day) && type === "reported"
                                      ? "bg-primary-foreground"
                                      : EVENT_META[type].dot,
                                    isToday(day) && "ring-1 ring-primary-foreground/40",
                                  )}
                                  title={`${counts[type]} ${EVENT_META[type].label.toLowerCase()}`}
                                />
                              ),
                          )}
                          {events.length > 0 && (
                            <span
                              className={cn(
                                "ml-auto text-[10px] font-semibold",
                                isToday(day) ? "text-primary-foreground/80" : "text-muted-foreground",
                              )}
                            >
                              {events.length}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {(Object.keys(EVENT_META) as CalendarEventType[]).map((type) => (
                <span key={type} className="inline-flex items-center gap-1.5">
                  <span className={cn("size-2 rounded-full", EVENT_META[type].dot)} aria-hidden="true" />
                  {EVENT_META[type].label}
                </span>
              ))}
            </div>
          </div>

          <aside aria-label="Selected day issues" className="min-w-0 border-t border-border pt-3 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
            <p className="text-sm font-semibold">
              {format(selected, "EEEE, d MMMM")}
            </p>
            <p className="mb-3 text-xs text-muted-foreground">
              {selectedEvents.length === 0
                ? "No events on this day."
                : `${selectedEvents.length} event${selectedEvents.length === 1 ? "" : "s"}`}
            </p>
            {selectedEvents.length === 0 ? (
              <div className="flex items-center gap-2 rounded-md border border-dashed border-border px-3 py-6 text-sm text-muted-foreground">
                <CalendarDays className="size-4" aria-hidden="true" />
                Nothing reported, resolved, or overdue.
              </div>
            ) : (
              <ul className="grid gap-2">
                {selectedEvents.map((event) => (
                  <EventRow key={`${event.type}-${event.issue.id}`} event={event} />
                ))}
              </ul>
            )}
          </aside>
        </div>
      </CardContent>
    </Card>
  );
}
