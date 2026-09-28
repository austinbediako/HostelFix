"use client";

import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { useAuthContext } from "@/providers/auth-provider";
import { RoleGuard } from "@/components/auth/role-guard";
import { IssueList } from "@/components/issues/issue-list";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useIssues } from "@/hooks/use-issues";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";

export default function DashboardIssuesPage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { data: issues, isLoading, error, refetch } = useIssues();

  const isStudent = user?.role === "student";
  const isAdmin = user?.role === "university_admin" || user?.role === "system_admin";

  return (
    <RoleGuard allowedRoles={["student", "hall_manager", "university_admin", "system_admin"]}>
      <PageHeader
        title={isStudent ? "My Reports" : isAdmin ? "All Issues" : "Issues Queue"}
        description={
          isStudent
            ? "Track the status of your maintenance reports."
            : isAdmin
              ? "All reported issues across halls."
              : "Review, prioritize, and assign reported issues."
        }
      >
        {isStudent && (
          <Button onClick={() => router.push("/dashboard/issues/new")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Report Issue
          </Button>
        )}
      </PageHeader>
      {isLoading && <LoadingState message="Loading issues..." />}
      {error && <ErrorState onRetry={refetch} />}
      {issues && (
        <IssueList
          issues={issues}
          hrefPrefix="/dashboard/issues"
          empty={
            isStudent
              ? {
                  title: "No reports yet",
                  description:
                    "When something in your room or hall needs fixing, report it here and track it until it's resolved.",
                  illustration: "empty-reports",
                  action: { label: "Report an Issue", href: "/dashboard/issues/new" },
                }
              : isAdmin
                ? {
                    title: "No issues found",
                    description: "No issues have been reported across the halls yet.",
                    illustration: "no-results",
                  }
                : {
                    title: "Your queue is clear",
                    description: "There are no reported issues in your halls right now. New reports will appear here.",
                    illustration: "resolved",
                  }
          }
        />
      )}
    </RoleGuard>
  );
}
