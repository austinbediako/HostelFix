"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalyticsOverview } from "@/hooks/use-analytics";
import { useIssues } from "@/hooks/use-issues";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { IssueList } from "@/components/issues/issue-list";
import { AdminWeekStrip } from "./admin-week-strip";

export function AdminDashboard() {
  const { data: analytics, isLoading, error, refetch } = useAnalyticsOverview();
  const { data: issues } = useIssues();

  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        description="Overview of maintenance operations across all halls."
      />
      {isLoading && <LoadingState message="Loading analytics..." />}
      {error && <ErrorState onRetry={refetch} />}
      {analytics && (
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card className="relative overflow-hidden border-t-4 border-t-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Total Issues</CardTitle>
                <CardDescription>All reported issues</CardDescription>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-tint/50 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{analytics.totalIssues}</p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden border-t-4 border-t-danger">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Open</CardTitle>
                <CardDescription>Unresolved issues</CardDescription>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-bg text-danger">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-danger">{analytics.openIssues}</p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden border-t-4 border-t-success">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Resolved</CardTitle>
                <CardDescription>Completed issues</CardDescription>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-bg text-success">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-success">{(analytics.statusCounts.resolved ?? 0) + (analytics.statusCounts.closed ?? 0)}</p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden border-t-4 border-t-warning">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Overdue</CardTitle>
                <CardDescription>Past due issues</CardDescription>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-bg text-warning">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-warning">{analytics.overdueIssues}</p>
            </CardContent>
          </Card>
        </div>
      )}
      {issues && (
        <div className="grid gap-4">
          <AdminWeekStrip issues={issues} />
          <div>
            <h2 className="mb-4 text-lg font-semibold">Recent Issues</h2>
            <IssueList
              issues={issues.slice(0, 6)}
              hrefPrefix="/dashboard/issues"
              empty={{
                title: "No issues found",
                description: "No issues have been reported across the halls yet.",
                illustration: "no-results",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
