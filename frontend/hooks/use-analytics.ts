"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Issue, IssuePriority, IssueStatus } from "@/types/issue";

export interface HallMetrics {
  hallId: string;
  totalIssues: number;
  openIssues: number;
  statusCounts: Record<IssueStatus, number>;
  priorityCounts: Record<IssuePriority, number>;
  recurringCategories: { _id: string; count: number }[];
  overdueIssues: number;
  averageResolutionHours: number | null;
  recentIssues: Issue[];
}

export interface OverviewMetrics {
  totalIssues: number;
  openIssues: number;
  statusCounts: Record<IssueStatus, number>;
  priorityCounts: Record<IssuePriority, number>;
  hallBreakdown: {
    hallId: string;
    name?: string;
    code?: string;
    count: number;
  }[];
  recurringCategories: { _id: string; count: number }[];
  overdueIssues: number;
  averageResolutionHours: number | null;
  recentIssues: Issue[];
}

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: async () => {
      const response = await api.get<OverviewMetrics>("/analytics/overview");
      return response.data;
    },
    enabled: typeof window !== "undefined",
  });
}

export function useHallDashboard(hallId?: string) {
  return useQuery({
    queryKey: ["halls", hallId, "dashboard"],
    queryFn: async () => {
      const response = await api.get<HallMetrics>(`/halls/${hallId}/dashboard`);
      return response.data;
    },
    enabled: typeof window !== "undefined" && !!hallId,
  });
}
