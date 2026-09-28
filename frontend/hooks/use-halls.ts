"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Hall, Location } from "@/types/hall";

export function useHalls() {
  return useQuery({
    queryKey: ["halls"],
    queryFn: async () => {
      const response = await api.get<Hall[]>("/halls");
      return response.data;
    },
    enabled: typeof window !== "undefined",
  });
}

export function useLocations(hallId?: string) {
  return useQuery({
    queryKey: ["halls", hallId, "locations"],
    queryFn: async () => {
      const response = await api.get<Location[]>(`/halls/${hallId}/locations`);
      return response.data;
    },
    enabled: typeof window !== "undefined" && !!hallId,
  });
}
