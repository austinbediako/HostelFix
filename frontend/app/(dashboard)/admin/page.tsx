"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalyticsOverview } from "@/hooks/use-analytics";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";

export default function AdminDashboardPage() {
  const { data: analytics, isLoading, error, refetch } = useAnalyticsOverview();

  return (
    <RoleGuard allowedRoles={["university_admin", "system_admin"]}>
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
    </RoleGuard>
  );
}
