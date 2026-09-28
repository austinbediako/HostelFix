"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "@/providers/auth-provider";
import { LoadingState } from "@/components/shared/loading-state";
import { getDefaultRoute } from "@/lib/auth";

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user!.role)) {
      router.replace(getDefaultRoute(user!.role));
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router, pathname]);

  if (isLoading || !isAuthenticated || !allowedRoles.includes(user!.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState message="Checking permissions..." />
      </div>
    );
  }

  return <>{children}</>;
}
