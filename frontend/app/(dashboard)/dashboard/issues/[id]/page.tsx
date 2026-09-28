"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { SuccessState } from "@/components/shared/success-state";
import { buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuthContext } from "@/providers/auth-provider";
import { RoleGuard } from "@/components/auth/role-guard";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { IssueStatusBadge } from "@/components/issues/issue-status-badge";
import { IssuePriorityBadge } from "@/components/issues/issue-priority-badge";
import {
  useIssue,
  useIssueEvents,
  useUpdateStatus,
  useAcknowledgeIssue,
  useReopenIssue,
} from "@/hooks/use-issues";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardIssueDetailPage() {
  const params = useParams<{ id: string }>();
  const justSubmitted = useSearchParams().get("submitted") === "1";
  const { user } = useAuthContext();
  const { data: issue, isLoading, error, refetch } = useIssue(params.id);
  const { data: events } = useIssueEvents(params.id);
  const acknowledge = useAcknowledgeIssue();
  const updateStatus = useUpdateStatus();
  const reopen = useReopenIssue();

  const role = user?.role;
  const isStudent = role === "student";
  const isHallManager = role === "hall_manager";
  const isMaintenance = role === "maintenance";

  async function handleAcknowledge() {
    try {
      await acknowledge.mutateAsync({ issueId: params.id, data: { action: "acknowledge" } });
      toast.success("Issue under review");
    } catch {
      toast.error("Failed to update issue");
    }
  }

  async function handleStartProgress() {
    try {
      await updateStatus.mutateAsync({ issueId: params.id, data: { status: "in_progress" } });
      toast.success("Work started");
    } catch {
      toast.error("Failed to start work");
    }
  }

  async function handleReject() {
    try {
      await acknowledge.mutateAsync({ issueId: params.id, data: { action: "reject" } });
      toast.success("Issue rejected");
    } catch {
      toast.error("Failed to reject issue");
    }
  }

  async function handleResolve() {
    try {
      await updateStatus.mutateAsync({ issueId: params.id, data: { status: "resolved" } });
      toast.success("Issue marked resolved");
    } catch {
      toast.error("Failed to resolve issue");
    }
  }

  async function handleClose() {
    try {
      await updateStatus.mutateAsync({ issueId: params.id, data: { status: "closed" } });
      toast.success("Issue closed");
    } catch {
      toast.error("Failed to close issue");
    }
  }

  async function handleReopen() {
    try {
      await reopen.mutateAsync(params.id);
      toast.success("Issue reopened");
    } catch {
      toast.error("Failed to reopen issue");
    }
  }

  return (
    <RoleGuard allowedRoles={["student", "hall_manager", "maintenance", "university_admin", "system_admin"]}>
      <PageHeader title="Issue Details" />
      {isLoading && <LoadingState message="Loading issue..." />}
      {error && <ErrorState onRetry={refetch} />}
      {issue && isStudent && justSubmitted && (
        <SuccessState
          title="Your report has been submitted"
          description={
            <>
              <p>
                Reference{" "}
                <span className="font-mono font-semibold text-foreground">{issue.referenceNumber}</span>. Hall
                management has been notified and will review it. You can follow its progress on this page.
              </p>
            </>
          }
        >
          <Link href="/dashboard/issues" className={buttonVariants({ variant: "outline", size: "lg" })}>
            View my reports
          </Link>
          <Link href="/dashboard/issues/new" className={buttonVariants({ variant: "ghost", size: "lg" })}>
            Report another issue
          </Link>
        </SuccessState>
      )}
      {issue && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">{issue.referenceNumber}</p>
                  <CardTitle className="text-lg">{issue.description}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <IssueStatusBadge status={issue.status} />
                  <IssuePriorityBadge priority={issue.priority} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 text-sm md:grid-cols-2">
                <div>
                  <span className="text-muted-foreground">Category:</span>{" "}
                  <span className="capitalize">{issue.category}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Priority:</span>{" "}
                  <span className="capitalize">{issue.priority}</span>
                </div>
                {issue.location && (
                  <div>
                    <span className="text-muted-foreground">Location:</span>{" "}
                    <span>
                      {issue.location.block} {issue.location.room || issue.location.commonArea || issue.location.type}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Submitted:</span>{" "}
                  <span>{format(new Date(issue.submittedAt ?? issue.createdAt), "PPP")}</span>
                </div>
                {issue.disputeWindowExpiresAt && (
                  <div>
                    <span className="text-muted-foreground">Dispute window closes:</span>{" "}
                    <span>{format(new Date(issue.disputeWindowExpiresAt), "PPP p")}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {isHallManager && issue.status === "submitted" && (
                  <Button onClick={handleAcknowledge} disabled={acknowledge.isPending}>
                    Mark Under Review
                  </Button>
                )}
                {isHallManager && issue.status === "submitted" && (
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={acknowledge.isPending}
                  >
                    Reject
                  </Button>
                )}
                {(isHallManager || isMaintenance) &&
                  (issue.status === "under_review" || issue.status === "assigned" || issue.status === "reopened") && (
                    <Button variant="outline" onClick={handleStartProgress} disabled={updateStatus.isPending}>
                      Start Work
                    </Button>
                  )}
                {(isHallManager || isMaintenance) &&
                  (issue.status === "submitted" ||
                    issue.status === "under_review" ||
                    issue.status === "assigned" ||
                    issue.status === "in_progress" ||
                    issue.status === "reopened") && (
                    <Button onClick={handleResolve} disabled={updateStatus.isPending}>
                      Mark Resolved
                    </Button>
                  )}
                {isHallManager && issue.status === "resolved" && (
                  <Button onClick={handleClose} disabled={updateStatus.isPending}>
                    Close Now
                  </Button>
                )}
                {isStudent && issue.status === "resolved" && (
                  <Button onClick={handleReopen} disabled={reopen.isPending}>
                    Reopen Issue
                  </Button>
                )}
              </div>

              {isStudent && issue.status === "resolved" && (
                <p className="text-sm text-muted-foreground">
                  If the issue is not fixed, you can reopen it before the dispute window closes.
                </p>
              )}

              {issue.imageUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-3 md:grid-cols-4">
                  {issue.imageUrls.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                    >
                      <img
                        src={url}
                        alt="Issue photo"
                        className="h-full w-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {events?.length === 0 && (
                <p className="text-sm text-muted-foreground">No events yet.</p>
              )}
              {events?.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col gap-1 border-l-2 border-border pl-4"
                >
                  <p className="text-sm font-medium capitalize">
                    {event.eventType.replace("_", " ")}
                  </p>
                  {event.message && (
                    <p className="text-sm text-muted-foreground">{event.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(event.createdAt), "PP p")}
                    {event.actorId?.name && ` • ${event.actorId.name}`}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </RoleGuard>
  );
}
