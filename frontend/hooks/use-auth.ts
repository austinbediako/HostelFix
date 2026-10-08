"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { LoginInput, CurrentUser } from "@/types/auth";

export const ME_QUERY_KEY = ["me"];

export function useMe() {
  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: async () => {
      const response = await api.get<CurrentUser>("/auth/me");
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: typeof window !== "undefined",
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await api.post<CurrentUser>("/auth/login", data);
      return response.data;
    },
    onSuccess: (user) => {
      queryClient.clear();
      queryClient.setQueryData(ME_QUERY_KEY, user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSettled: () => {
      queryClient.clear();
    },
  });
}
