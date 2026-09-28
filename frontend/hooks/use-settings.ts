"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { SystemSettings } from "@/types/settings";

const SETTINGS_QUERY_KEY = ["settings"];

export function useSettings() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const response = await api.get<SystemSettings>("/settings");
      return response.data;
    },
    enabled: typeof window !== "undefined",
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: SystemSettings) => {
      const response = await api.patch<SystemSettings>("/settings", settings);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(SETTINGS_QUERY_KEY, data);
      toast.success("Settings saved.");
    },
    onError: () => {
      toast.error("Could not save settings. Please try again.");
    },
  });
}
