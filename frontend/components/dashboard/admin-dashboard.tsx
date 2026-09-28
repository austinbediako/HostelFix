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
          <Card>
            <CardHeader>
              <CardTitle>Total Issues</CardTitle>
              <CardDescription>All reported issues</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics.totalIssues}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Open</CardTitle>
              <CardDescription>Unresolved issues</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics.openIssues}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Resolved</CardTitle>
              <CardDescription>Completed issues</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{(analytics.statusCounts.resolved ?? 0) + (analytics.statusCounts.closed ?? 0)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Overdue</CardTitle>
              <CardDescription>Past due issues</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics.overdueIssues}</p>
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
