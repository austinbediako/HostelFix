"use client";

import { PageHeader } from "@/components/shared/page-header";
import { FeatureCard } from "@/components/shared/feature-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIssues } from "@/hooks/use-issues";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { IssueList } from "@/components/issues/issue-list";
import { HallCrest } from "@/components/shared/hall-crest";
import { useAuthContext } from "@/providers/auth-provider";

export function StudentDashboard() {
  const { user } = useAuthContext();
  const hall = user?.allocatedLocation?.hall;
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
      >
        {hall && <HallCrest hall={hall} />}
      </PageHeader>

      <FeatureCard
        title="Something in your hall needs fixing?"
        description="Report a broken tap, faulty socket, or any maintenance problem in your room or hall. Hall management is notified and you can follow every update here."
        illustration="report-issue"
        action={{ label: "Report an Issue", href: "/dashboard/issues/new" }}
        secondaryAction={{ label: "View my reports", href: "/dashboard/issues" }}
      />

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-t-4 border-t-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Total Reports</CardTitle>
              <CardDescription>All issues you have reported</CardDescription>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-tint/50 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{isLoading ? "—" : totalCount}</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-t-4 border-t-danger">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Open</CardTitle>
              <CardDescription>Awaiting review or reopened</CardDescription>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-bg text-danger">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-danger">{isLoading ? "—" : openCount}</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-t-4 border-t-warning">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>In Progress</CardTitle>
              <CardDescription>Being handled by hall staff</CardDescription>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-bg text-warning">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 9.36l-7.19 7.19a2.12 2.12 0 0 1-3-3l7.19-7.19a6 6 0 0 1 9.36-7.94z"/></svg>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-warning">{isLoading ? "—" : inProgressCount}</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-t-4 border-t-success">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Resolved</CardTitle>
              <CardDescription>Marked resolved or closed</CardDescription>
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
