"use client";

import { useState } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ISSUE_PRIORITIES } from "@/constants/priorities";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import type { SystemSettings } from "@/types/settings";
import type { IssuePriority } from "@/types/issue";

function SettingsForm({ initial }: { initial: SystemSettings }) {
  const updateSettings = useUpdateSettings();
  const [form, setForm] = useState<SystemSettings>(initial);

  const setPriority = (priority: IssuePriority, value: number) =>
    setForm((f) => ({
      ...f,
      priorityTargetHours: { ...f.priorityTargetHours, [priority]: value },
    }));

  return (
    <form
      className="grid max-w-2xl gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        updateSettings.mutate(form);
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Response Targets</CardTitle>
          <CardDescription>
            Hours staff have to act before an issue is flagged overdue on dashboards and the activity calendar.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {ISSUE_PRIORITIES.map(({ value, label }) => (
            <div key={value} className="grid gap-1.5">
              <Label htmlFor={`priority-${value}`}>{label} (hours)</Label>
              <Input
                id={`priority-${value}`}
                type="number"
                min={1}
                max={720}
                required
                value={form.priorityTargetHours[value]}
                onChange={(e) => setPriority(value, Number(e.target.value))}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resolution Window</CardTitle>
          <CardDescription>
            Time a student has to dispute a fix before a resolved issue closes automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="dispute-window">Dispute window (hours)</Label>
            <Input
              id="dispute-window"
              type="number"
              min={1}
              max={720}
              required
              value={form.disputeWindowHours}
              onChange={(e) => setForm({ ...form, disputeWindowHours: Number(e.target.value) })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="support-email">Support contact email</Label>
            <Input
              id="support-email"
              type="email"
              required
              value={form.supportEmail}
              onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Shown to users when they need help with their account.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={updateSettings.isPending}>
          {updateSettings.isPending ? "Saving…" : "Save settings"}
        </Button>
      </div>
    </form>
  );
}

export default function DashboardSettingsPage() {
  const { data: settings, isLoading, error, refetch } = useSettings();

  return (
    <RoleGuard allowedRoles={["system_admin"]}>
      <PageHeader
        title="Settings"
        description="Operational rules for the portal. Changes apply to new issues going forward."
      />
      {isLoading && <LoadingState message="Loading settings..." />}
      {error && <ErrorState onRetry={refetch} />}
      {settings && <SettingsForm initial={settings} />}
    </RoleGuard>
  );
}
