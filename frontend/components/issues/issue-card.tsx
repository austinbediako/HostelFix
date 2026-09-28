"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IssueStatusBadge } from "./issue-status-badge";
import { IssuePriorityBadge } from "./issue-priority-badge";
import { cn } from "cn";
import type { Issue } from "@/types/issue";

interface IssueCardProps {
  issue: Issue;
  href: string;
}

function formatLocation(issue: Issue): string | null {
  const parts = [
    issue.hall?.name,
    issue.location?.room ?? issue.location?.commonArea ?? issue.location?.block,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" • ") : null;
}

export function IssueCard({ issue, href }: IssueCardProps) {
  const location = formatLocation(issue);
  const isCritical = issue.priority === "emergency";

  return (
    <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
      <Card
        className={cn(
          "rounded-md transition-colors hover:border-primary",
          isCritical && "border-l-[3px] border-l-danger",
        )}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs font-medium text-muted-foreground">
                {issue.referenceNumber}
              </p>
              <CardTitle className="line-clamp-2 text-base">{issue.description}</CardTitle>
            </div>
            <IssueStatusBadge status={issue.status} />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <IssuePriorityBadge priority={issue.priority} />
            <span className="capitalize">{issue.category.replace("_", " ")}</span>
            {location && <span className="truncate">{location}</span>}
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Updated {formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true })}
        </CardFooter>
      </Card>
    </Link>
  );
}
