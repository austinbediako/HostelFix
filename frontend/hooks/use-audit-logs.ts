"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/api";

export interface AuditLogActor {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuditLog {
  id: string;
  actorId?: AuditLogActor | string | null;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: unknown;
  requestId?: string;
  createdAt: string;
}

/** "issue.status.update" → "Issue status update" */
export function getActionLabel(action: string): string {
  return action
    .split(/[._-]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getActionTone(action: string): "primary" | "gold" | "muted" {
  if (action.startsWith("issue.")) return "primary";
  if (action.startsWith("user.") || action.startsWith("settings.")) return "gold";
  return "muted";
}

export function useAuditLogs() {
  return useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<AuditLog>>("/audit-logs");
      return response.data;
    },
    enabled: typeof window !== "undefined",
  });
}
