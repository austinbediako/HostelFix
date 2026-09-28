"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/api";
import type { Role } from "@/types/auth";
import type { User } from "@/types/user";

export function useUsers(role?: Role) {
  return useQuery({
    queryKey: ["users", role ?? "all"],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<User>>("/users", {
        params: role ? { role } : undefined,
      });
      return response.data;
    },
    enabled: typeof window !== "undefined",
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: Role }) => {
      const response = await api.patch<User>(`/users/${userId}/roles`, { role });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Role updated. The user will be signed out on their next session refresh.");
    },
    onError: () => {
      toast.error("Could not update the role. Please try again.");
    },
  });
}
