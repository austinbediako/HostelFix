"use client";

import { PageHeader } from "@/components/shared/page-header";
import { FeatureCard } from "@/components/shared/feature-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIssues } from "@/hooks/use-issues";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { IssueList } from "@/components/issues/issue-list";

export function StudentDashboard() {
  const { data: issues, isLoading, error, refetch } = useIssues({ status: undefined });

  const totalCount = issues?.length ?? 0;
  const openCount = issues?.filter((i) => ["submitted", "reopened"].includes(i.status)).length ?? 0;
  const inProgressCount = issues?.filter((i) => ["under_review", "assigned", "in_progress"].includes(i.status)).length ?? 0;
  const resolvedCount = issues?.filter((i) => ["resolved", "closed"].includes(i.status)).length ?? 0;

  return (
    <>
      <PageHeader
        title="Student Dashboard"
        description="Track your maintenance requests and report new issues."
      />

      <FeatureCard
        title="Something in your hall needs fixing?"
        description="Report a broken tap, faulty socket, or any maintenance problem in your room or hall. Hall management is notified and you can follow every update here."
        illustration="report-issue"
        action={{ label: "Report an Issue", href: "/dashboard/issues/new" }}
        secondaryAction={{ label: "View my reports", href: "/dashboard/issues" }}
      />

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Reports</CardTitle>
            <CardDescription>All issues you have reported</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{isLoading ? "—" : totalCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Open</CardTitle>
            <CardDescription>Awaiting review or reopened</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{isLoading ? "—" : openCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>In Progress</CardTitle>
            <CardDescription>Being handled by hall staff</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{isLoading ? "—" : inProgressCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resolved</CardTitle>
            <CardDescription>Marked resolved or closed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{isLoading ? "—" : resolvedCount}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-4 text-lg font-semibold">Recent Issues</h2>
      {isLoading && <LoadingState message="Loading your issues..." />}
      {error && <ErrorState onRetry={refetch} />}
      {issues && (
        <IssueList
          issues={issues.slice(0, 6)}
          hrefPrefix="/dashboard/issues"
          empty={{
            title: "No reports yet",
            description: "Your recent reports and their status will appear here.",
          }}
        />
      )}
    </>
  );
}
