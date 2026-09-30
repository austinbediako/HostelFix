"use client";

import { useParams } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/role-guard";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { IssueStatusBadge } from "@/components/issues/issue-status-badge";
import { IssuePriorityBadge } from "@/components/issues/issue-priority-badge";
import { useIssue, useIssueEvents, useUpdateStatus } from "@/hooks/use-issues";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardWorkOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: issue, isLoading, error, refetch } = useIssue(params.id);
  const { data: events } = useIssueEvents(params.id);
  const updateStatus = useUpdateStatus();

  async function handleStartProgress() {
    try {
      await updateStatus.mutateAsync({
        issueId: params.id,
        data: { status: "in_progress" },
      });
      toast.success("Work started");
    } catch {
      toast.error("Failed to start work");
    }
  }

  async function handleResolve() {
    try {
      await updateStatus.mutateAsync({
        issueId: params.id,
        data: { status: "resolved" },
      });
      toast.success("Issue resolved");
    } catch {
      toast.error("Failed to resolve issue");
    }
  }

  return (
    <RoleGuard allowedRoles={["maintenance"]}>
      <PageHeader title="Work Order Details" />
      {isLoading && <LoadingState message="Loading work order..." />}
      {error && <ErrorState onRetry={refetch} />}
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
                <div>
                  <span className="text-muted-foreground">Location:</span>{" "}
                  <span>
                    {issue.location?.block} {issue.location?.room || issue.location?.commonArea || issue.location?.type}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Submitted:</span>{" "}
                  <span>{format(new Date(issue.submittedAt ?? issue.createdAt), "PPP")}</span>
                </div>
              </div>

              <div className="space-y-2">
                {(issue.status === "under_review" || issue.status === "assigned" || issue.status === "reopened") && (
                  <Button variant="outline" onClick={handleStartProgress} disabled={updateStatus.isPending}>
                    Start Work
                  </Button>
                )}
                {issue.status === "in_progress" && (
                  <Button onClick={handleResolve} disabled={updateStatus.isPending}>
                    Mark Resolved
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {events?.length === 0 && <p className="text-sm text-muted-foreground">No events yet.</p>}
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
