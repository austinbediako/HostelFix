"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IssueList } from "@/components/issues/issue-list";
import { useIssues } from "@/hooks/use-issues";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { HallCrest } from "@/components/shared/hall-crest";
import { useAuthContext } from "@/providers/auth-provider";

export function MaintenanceDashboard() {
  const { user } = useAuthContext();
  const halls = user?.assignedHalls ?? [];
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
        <Card className="relative overflow-hidden border-t-4 border-t-assigned">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Assigned / In Progress</CardTitle>
              <CardDescription>Work assigned to your halls</CardDescription>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-bg text-assigned">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 9.36l-7.19 7.19a2.12 2.12 0 0 1-3-3l7.19-7.19a6 6 0 0 1 9.36-7.94z"/></svg>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-assigned">{isLoading ? "—" : assignedCount}</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-t-4 border-t-danger">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Open</CardTitle>
              <CardDescription>Issues needing attention</CardDescription>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-bg text-danger">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-danger">{isLoading ? "—" : openCount}</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-t-4 border-t-success">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Resolved Today</CardTitle>
              <CardDescription>Issues resolved by you today</CardDescription>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-bg text-success">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">{isLoading ? "—" : resolvedTodayCount}</p>
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
