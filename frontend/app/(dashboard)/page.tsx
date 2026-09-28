"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/auth-provider";
import { getDefaultRoute } from "@/lib/auth";
import { LoadingState } from "@/components/shared/loading-state";

export default function DashboardRedirectPage() {
  const { user, isLoading, isAuthenticated } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    router.replace(getDefaultRoute(user!.role));
  }, [isLoading, isAuthenticated, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingState message="Redirecting..." />
    </div>
  );
}
