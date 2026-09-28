"use client";

import { format } from "date-fns";
import { RoleGuard } from "@/components/auth/role-guard";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { getActionLabel, getActionTone, useAuditLogs, type AuditLog } from "@/hooks/use-audit-logs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "cn";

const toneStyles: Record<ReturnType<typeof getActionTone>, string> = {
  primary: "bg-primary-tint text-primary-dark hover:bg-primary-tint",
  gold: "bg-gold-tint text-assigned hover:bg-gold-tint",
  muted: "bg-muted text-muted-foreground hover:bg-muted",
};

function actorLabel(log: AuditLog): string {
  if (log.actorId && typeof log.actorId === "object") return log.actorId.name;
  return "System";
}

export default function AdminAuditLogsPage() {
  const { data: logs, isLoading, error, refetch } = useAuditLogs();

  return (
    <RoleGuard allowedRoles={["university_admin", "system_admin"]}>
      <PageHeader
        title="Audit Logs"
        description="Immutable record of every significant action — who did what, when, and on which record."
      />
      {isLoading && <LoadingState message="Loading audit logs..." />}
      {error && <ErrorState onRetry={refetch} />}
      {logs && logs.items.length === 0 && (
        <EmptyState
          illustration="audit-trail"
          title="No activity recorded yet"
          description="Every issue action, role change, and settings update is written here automatically as it happens."
        />
      )}
      {logs && logs.items.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Record</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.items.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    <span className="block text-sm">{format(new Date(log.createdAt), "PP")}</span>
                    <span className="text-xs text-muted-foreground">{format(new Date(log.createdAt), "p")}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn("font-medium", toneStyles[getActionTone(log.action)])}>
                      {getActionLabel(log.action)}
                    </Badge>
                  </TableCell>
                  <TableCell>{actorLabel(log)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.resourceType}
                    {log.resourceId && (
                      <span className="font-mono"> · {log.resourceId.slice(-8)}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </RoleGuard>
  );
}
