"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IssueList } from "@/components/issues/issue-list";
import { useIssues } from "@/hooks/use-issues";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { HallCrest } from "@/components/shared/hall-crest";
import { useAuthContext } from "@/providers/auth-provider";

export function HallManagerDashboard() {
  const { user } = useAuthContext();
  const halls = user?.assignedHalls ?? [];
  const { data: issues, isLoading, error, refetch } = useIssues();

  const pendingCount = issues?.filter((i) => ["submitted", "reopened"].includes(i.status)).length ?? 0;
  const activeCount = issues?.filter((i) => ["under_review", "assigned", "in_progress"].includes(i.status)).length ?? 0;
  const resolvedCount = issues?.filter((i) => ["resolved", "closed"].includes(i.status)).length ?? 0;

  return (
    <>
      <PageHeader
        title="Hall Manager Dashboard"
        description="Manage and assign maintenance issues for your halls."
      >
        {halls.length === 1 && <HallCrest hall={halls[0]} />}
        {halls.length > 1 && (
          <div className="flex -space-x-2">
            {halls.slice(0, 4).map((hall) => (
              <HallCrest key={hall.id} hall={hall} showName={false} />
            ))}
          </div>
        )}
      </PageHeader>
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pending Review</CardTitle>
            <CardDescription>Issues awaiting triage</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{isLoading ? "—" : pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active</CardTitle>
            <CardDescription>Under review, assigned, or in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{isLoading ? "—" : activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resolved</CardTitle>
            <CardDescription>Completed or closed issues</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{isLoading ? "—" : resolvedCount}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-4 text-lg font-semibold">Recent Issues</h2>
      {isLoading && <LoadingState message="Loading issues..." />}
      {error && <ErrorState onRetry={refetch} />}
      {issues && <IssueList issues={issues.slice(0, 6)} hrefPrefix="/dashboard/issues" />}
    </>
  );
}
