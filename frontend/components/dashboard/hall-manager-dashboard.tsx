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
        <Card className="relative overflow-hidden border-t-4 border-t-danger">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Pending Review</CardTitle>
              <CardDescription>Issues awaiting triage</CardDescription>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-bg text-danger">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-danger">{isLoading ? "—" : pendingCount}</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-t-4 border-t-warning">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Active</CardTitle>
              <CardDescription>Under review, assigned, or in progress</CardDescription>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-bg text-warning">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 9.36l-7.19 7.19a2.12 2.12 0 0 1-3-3l7.19-7.19a6 6 0 0 1 9.36-7.94z"/></svg>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-warning">{isLoading ? "—" : activeCount}</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-t-4 border-t-success">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Resolved</CardTitle>
              <CardDescription>Completed or closed issues</CardDescription>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-bg text-success">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">{isLoading ? "—" : resolvedCount}</p>
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
