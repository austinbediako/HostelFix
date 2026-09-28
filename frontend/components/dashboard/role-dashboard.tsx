"use client";

import { useAuthContext } from "@/providers/auth-provider";
import { LoadingState } from "@/components/shared/loading-state";
import { StudentDashboard } from "./student-dashboard";
import { HallManagerDashboard } from "./hall-manager-dashboard";
import { MaintenanceDashboard } from "./maintenance-dashboard";
import { AdminDashboard } from "./admin-dashboard";

export function RoleDashboard() {
  const { user, isLoading, isAuthenticated } = useAuthContext();

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState message="Loading your dashboard..." />
      </div>
    );
  }

  switch (user.role) {
    case "student":
      return <StudentDashboard />;
    case "hall_manager":
      return <HallManagerDashboard />;
    case "maintenance":
      return <MaintenanceDashboard />;
    case "university_admin":
    case "system_admin":
      return <AdminDashboard />;
    default:
      return (
        <div className="flex min-h-screen items-center justify-center">
          <LoadingState message="Unknown user role." />
        </div>
      );
  }
}
