"use client";

import { useState } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Illustration } from "@/components/shared/illustration";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthContext } from "@/providers/auth-provider";
import { useUsers, useUpdateUserRole } from "@/hooks/use-users";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLE_LABELS } from "@/lib/auth";
import type { Role } from "@/types/auth";
import type { User } from "@/types/user";

const ROLE_OPTIONS = Object.entries(ROLE_LABELS) as [Role, string][];

export default function AdminUsersPage() {
  const { user: currentUser } = useAuthContext();
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const { data: users, isLoading, error, refetch } = useUsers(roleFilter === "all" ? undefined : roleFilter);
  const updateRole = useUpdateUserRole();
  const [pendingChange, setPendingChange] = useState<{ user: User; role: Role } | null>(null);

  const canEditRoles = currentUser?.role === "system_admin";

  const confirmRoleChange = () => {
    if (!pendingChange) return;
    updateRole.mutate(
      { userId: pendingChange.user.id, role: pendingChange.role },
      { onSettled: () => setPendingChange(null) },
    );
  };

  return (
    <RoleGuard allowedRoles={["university_admin", "system_admin"]}>
      <PageHeader title="Users" description="Manage users and their roles.">
        <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as Role | "all")}>
          <SelectTrigger aria-label="Filter by role" className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {ROLE_OPTIONS.map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageHeader>
      {isLoading && <LoadingState message="Loading users..." />}
      {error && <ErrorState onRetry={refetch} />}
      {users && users.items.length === 0 && (
        <EmptyState
          illustration="users-directory"
          title="No users found"
          description="No accounts match the selected role filter."
        />
      )}
      {users && users.items.length > 0 && (
        <Card className="mb-4">
          <CardContent className="flex items-center justify-between gap-4 py-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
              <p className="text-sm">
                <span className="text-2xl font-bold">{users.total}</span>
                <span className="ml-1.5 text-muted-foreground">accounts</span>
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {users.items.filter((u) => u.active).length}
                </span>{" "}
                active
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {users.items.filter((u) => u.role !== "student").length}
                </span>{" "}
                staff &amp; administrators
              </p>
            </div>
            <Illustration name="users-directory" eager className="hidden w-32 shrink-0 sm:block" />
          </CardContent>
        </Card>
      )}
      {users && users.items.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-x-auto">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Assigned Halls</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                {canEditRoles && <TableHead className="text-right">Change role</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.items.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
                      >
                        {user.name
                          .split(/\s+/)
                          .slice(0, 2)
                          .map((p) => p[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium leading-tight">
                          {user.name}
                          {user.id === currentUser?.id && (
                            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                              (you)
                            </span>
                          )}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
                  </TableCell>
                  <TableCell className="max-w-52">
                    <p className="truncate text-sm text-muted-foreground">
                      {user.assignedHallIds.length > 0
                        ? user.assignedHallIds.map((h) => h.name).join(", ")
                        : "—"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.active
                          ? "bg-success-bg text-success hover:bg-success-bg"
                          : "bg-muted text-muted-foreground hover:bg-muted"
                      }
                      variant="secondary"
                    >
                      {user.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  {canEditRoles && (
                    <TableCell className="text-right">
                      {user.id === currentUser?.id ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <Select
                          value={user.role}
                          onValueChange={(role) => setPendingChange({ user, role: role as Role })}
                        >
                          <SelectTrigger
                            aria-label={`Change role for ${user.name}`}
                            className="ml-auto w-40"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLE_OPTIONS.map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!pendingChange} onOpenChange={(open) => !open && setPendingChange(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change role for {pendingChange?.user.name}?</DialogTitle>
            <DialogDescription>
              {pendingChange?.user.name} will become a{" "}
              {pendingChange && ROLE_LABELS[pendingChange.role]}. They will be signed out and must log
              in again for the change to take effect. This action is recorded in the audit log.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton>
            <Button onClick={confirmRoleChange} disabled={updateRole.isPending}>
              {updateRole.isPending ? "Updating…" : "Confirm change"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RoleGuard>
  );
}
