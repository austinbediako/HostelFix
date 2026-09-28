"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RoleGuard } from "@/components/auth/role-guard";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { useAnalyticsOverview } from "@/hooks/use-analytics";
import { useIssues } from "@/hooks/use-issues";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IssueCalendar } from "@/components/issues/issue-calendar";

export default function AdminAnalyticsPage() {
  const { data: analytics, isLoading, error, refetch } = useAnalyticsOverview();
  const { data: issues } = useIssues();

  return (
    <RoleGuard allowedRoles={["university_admin", "system_admin"]}>
      <PageHeader title="Analytics" description="Cross-hall maintenance metrics." />
      {isLoading && <LoadingState message="Loading analytics..." />}
      {error && <ErrorState onRetry={refetch} />}
      {issues && <div className="mb-8"><IssueCalendar issues={issues} /></div>}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle>Issues by Hall</CardTitle>
            <CardDescription>Total issues per hall</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.hallBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-30} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="var(--primary)" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </RoleGuard>
  );
}
