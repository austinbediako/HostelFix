import type { Role } from "@/types/auth";

export const ROLE_DEFAULT_ROUTES: Record<Role, string> = {
  student: "/dashboard",
  hall_manager: "/dashboard",
  maintenance: "/dashboard",
  university_admin: "/dashboard",
  system_admin: "/dashboard",
};

export function getDefaultRoute(role: Role): string {
  return ROLE_DEFAULT_ROUTES[role] ?? "/login";
}

export const ROLE_LABELS: Record<Role, string> = {
  student: "Student",
  hall_manager: "Hall Manager",
  maintenance: "Maintenance",
  university_admin: "University Admin",
  system_admin: "System Admin",
};
