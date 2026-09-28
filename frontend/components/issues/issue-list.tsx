"use client";

import type { ComponentProps } from "react";
import { IssueCard } from "./issue-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { Issue } from "@/types/issue";

interface IssueListProps {
  issues: Issue[];
  hrefPrefix: string;
  empty?: ComponentProps<typeof EmptyState>;
}

export function IssueList({
  issues,
  hrefPrefix,
  empty = { title: "No issues found", description: "There are no issues to show right now." },
}: IssueListProps) {
  if (issues.length === 0) {
    return <EmptyState {...empty} />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} href={`${hrefPrefix}/${issue.id}`} />
      ))}
    </div>
  );
}
