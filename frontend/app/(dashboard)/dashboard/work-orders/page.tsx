"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { IssueList } from "@/components/issues/issue-list";
import { PageHeader } from "@/components/shared/page-header";
import { useIssues } from "@/hooks/use-issues";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";

export default function DashboardWorkOrdersPage() {
  const { data: issues, isLoading, error, refetch } = useIssues();

  return (
    <RoleGuard allowedRoles={["maintenance"]}>
      <PageHeader
        title="Work Orders"
        description="Issues in your assigned halls."
      />
      {isLoading && <LoadingState message="Loading work orders..." />}
      {error && <ErrorState onRetry={refetch} />}
      {issues && (
        <IssueList
          issues={issues}
          hrefPrefix="/dashboard/work-orders"
          empty={{
            title: "No work orders right now",
            description: "Issues reported in your assigned halls will appear here when they need attention.",
            illustration: "maintenance",
          }}
        />
      )}
    </RoleGuard>
  );
}
