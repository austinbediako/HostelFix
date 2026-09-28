"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  AssignmentInput,
  CommentInput,
  CreateIssueInput,
  Issue,
  IssueEvent,
  IssueFilters,
  PriorityInput,
  StatusInput,
  AcknowledgeInput,
} from "@/types/issue";

const ISSUES_QUERY_KEY = "issues";

export function useIssues(
  filters?: IssueFilters,
  options?: Partial<UseQueryOptions<Issue[], Error>>,
) {
  return useQuery({
    queryKey: [ISSUES_QUERY_KEY, filters],
    queryFn: async () => {
      const response = await api.get<Issue[]>("/issues", { params: filters });
      return response.data;
    },
    enabled: typeof window !== "undefined",
    ...options,
  });
}

export function useIssue(issueId?: string) {
  return useQuery({
    queryKey: [ISSUES_QUERY_KEY, issueId],
    queryFn: async () => {
      const response = await api.get<Issue>(`/issues/${issueId}`);
      return response.data;
    },
    enabled: typeof window !== "undefined" && !!issueId,
  });
}

export function useIssueEvents(issueId?: string) {
  return useQuery({
    queryKey: [ISSUES_QUERY_KEY, issueId, "events"],
    queryFn: async () => {
      const response = await api.get<IssueEvent[]>(`/issues/${issueId}/events`);
      return response.data;
    },
    enabled: typeof window !== "undefined" && !!issueId,
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateIssueInput) => {
      const response = await api.post<Issue>("/issues", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEY] });
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      issueId,
      data,
    }: {
      issueId: string;
      data: CommentInput;
    }) => {
      const response = await api.post<Issue>(`/issues/${issueId}/comments`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ISSUES_QUERY_KEY, variables.issueId],
      });
      queryClient.invalidateQueries({
        queryKey: [ISSUES_QUERY_KEY, variables.issueId, "events"],
      });
    },
  });
}

export function useAcknowledgeIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      issueId,
      data,
    }: {
      issueId: string;
      data: AcknowledgeInput;
    }) => {
      const response = await api.patch<Issue>(
        `/issues/${issueId}/acknowledge`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ISSUES_QUERY_KEY, variables.issueId],
      });
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEY] });
    },
  });
}

export function useChangePriority() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      issueId,
      data,
    }: {
      issueId: string;
      data: PriorityInput;
    }) => {
      const response = await api.patch<Issue>(`/issues/${issueId}/priority`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ISSUES_QUERY_KEY, variables.issueId],
      });
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEY] });
    },
  });
}

export function useAssignIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      issueId,
      data,
    }: {
      issueId: string;
      data: AssignmentInput;
    }) => {
      const response = await api.post<Issue>(
        `/issues/${issueId}/assignments`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ISSUES_QUERY_KEY, variables.issueId],
      });
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEY] });
    },
  });
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      issueId,
      data,
    }: {
      issueId: string;
      data: StatusInput;
    }) => {
      const response = await api.patch<Issue>(`/issues/${issueId}/status`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ISSUES_QUERY_KEY, variables.issueId],
      });
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEY] });
    },
  });
}

export function useReopenIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (issueId: string) => {
      const response = await api.post<Issue>(`/issues/${issueId}/reopen`);
      return response.data;
    },
    onSuccess: (_, issueId) => {
      queryClient.invalidateQueries({
        queryKey: [ISSUES_QUERY_KEY, issueId],
      });
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEY] });
    },
  });
}
