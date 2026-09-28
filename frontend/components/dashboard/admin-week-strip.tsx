"use client";

import Link from "next/link";
import { format, isToday } from "date-fns";
import { ArrowRight } from "lucide-react";
import { cn } from "cn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildDayMap, countByType, dayKey, getWeekStrip } from "@/lib/issue-calendar";
import type { Issue } from "@/types/issue";

const DOTS = {
  reported: "bg-primary",
  resolved: "bg-success",
  due: "bg-danger",
} as const;

export function AdminWeekStrip({ issues }: { issues: Issue[] }) {
  const today = new Date();
  const week = getWeekStrip(today);
  const dayMap = buildDayMap(issues, today);
  const weekTotal = week.reduce((sum, d) => sum + (dayMap.get(dayKey(d))?.length ?? 0), 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle>This Week</CardTitle>
            <CardDescription>{weekTotal} calendar events across all halls</CardDescription>
          </div>
          <Link
            href="/dashboard/analytics"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Open calendar
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-px rounded-md border border-border bg-border">
          {week.map((day) => {
            const events = dayMap.get(dayKey(day)) ?? [];
            const counts = countByType(events);
            return (
              <div
                key={dayKey(day)}
                className={cn(
                  "flex min-h-16 flex-col gap-1 bg-card px-2 py-2",
                  isToday(day) && "bg-primary",
                )}
              >
                <span
                  className={cn(
                    "text-[10px] font-medium uppercase",
                    isToday(day) ? "text-primary-foreground/80" : "text-muted-foreground",
                  )}
                >
                  {format(day, "EEE")}
                </span>
                <span className={cn("text-sm font-semibold", isToday(day) && "text-primary-foreground")}>
                  {format(day, "d")}
                </span>
                <span className="mt-auto flex items-center gap-1">
                  {(Object.keys(DOTS) as (keyof typeof DOTS)[]).map(
                    (type) =>
                      counts[type] > 0 && (
                        <span
                          key={type}
                          className={cn(
                            "size-1.5 rounded-full",
                            isToday(day) && type === "reported" ? "bg-primary-foreground" : DOTS[type],
                            isToday(day) && "ring-1 ring-primary-foreground/40",
                          )}
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
              </div>
            );
          })}
        </div>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" />Reported</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-success" />Resolved</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-danger" />Overdue</span>
        </p>
      </CardContent>
    </Card>
  );
}
