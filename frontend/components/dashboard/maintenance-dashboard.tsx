"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IssueList } from "@/components/issues/issue-list";
import { useIssues } from "@/hooks/use-issues";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";

export function MaintenanceDashboard() {
  const { data: issues, isLoading, error, refetch } = useIssues();

  const assignedCount = issues?.filter((i) => ["assigned", "in_progress"].includes(i.status)).length ?? 0;
  const resolvedTodayCount =
    issues?.filter((i) => {
      if (i.status !== "resolved" && i.status !== "closed") return false;
      const resolvedAt = i.resolvedAt ? new Date(i.resolvedAt) : null;
      if (!resolvedAt) return false;
      const now = new Date();
      return (
        resolvedAt.getDate() === now.getDate() &&
        resolvedAt.getMonth() === now.getMonth() &&
        resolvedAt.getFullYear() === now.getFullYear()
      );
    }).length ?? 0;
  const openCount = issues?.filter((i) => ["under_review", "assigned", "in_progress", "reopened"].includes(i.status)).length ?? 0;

  return (
    <>
      <PageHeader
        title="Maintenance Dashboard"
        description="View your work orders and update progress."
      />
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Assigned / In Progress</CardTitle>
            <CardDescription>Work assigned to your halls</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{isLoading ? "—" : assignedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Open</CardTitle>
            <CardDescription>Issues needing attention</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{isLoading ? "—" : openCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resolved Today</CardTitle>
            <CardDescription>Issues resolved by you today</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{isLoading ? "—" : resolvedTodayCount}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-4 text-lg font-semibold">My Work Orders</h2>
      {isLoading && <LoadingState message="Loading work orders..." />}
      {error && <ErrorState onRetry={refetch} />}
      {issues && <IssueList issues={issues.slice(0, 6)} hrefPrefix="/dashboard/work-orders" />}
    </>
  );
}
