"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ME_QUERY_KEY, useMe } from "@/hooks/use-auth";
import type { CurrentUser } from "@/types/auth";

interface AuthContextValue {
  user: CurrentUser | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data: user, isLoading, isError } = useMe();

  useEffect(() => {
    if (isError) {
      queryClient.setQueryData(ME_QUERY_KEY, undefined);
    }
  }, [isError, queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
