import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Wrench,
  Users,
  BarChart3,
  FileText,
  Settings,
  LifeBuoy,
} from "lucide-react";
import type { Role } from "@/types/auth";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Returns the single most specific nav href matching the current path. */
export function getActiveHref(items: NavItem[], pathname: string): string | undefined {
  return items
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

export const ROLE_NAVIGATION: Record<Role, NavItem[]> = {
  student: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Report Issue", href: "/dashboard/issues/new", icon: PlusCircle },
    { label: "My Reports", href: "/dashboard/issues", icon: ClipboardList },
    { label: "Help", href: "/dashboard/help", icon: LifeBuoy },
  ],
  hall_manager: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Issues Queue", href: "/dashboard/issues", icon: ClipboardList },
    { label: "Help", href: "/dashboard/help", icon: LifeBuoy },
  ],
  maintenance: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Work Orders", href: "/dashboard/work-orders", icon: Wrench },
    { label: "Help", href: "/dashboard/help", icon: LifeBuoy },
  ],
  university_admin: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "All Issues", href: "/dashboard/issues", icon: ClipboardList },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Audit Logs", href: "/dashboard/audit-logs", icon: FileText },
    { label: "Users", href: "/dashboard/users", icon: Users },
  ],
  system_admin: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "All Issues", href: "/dashboard/issues", icon: ClipboardList },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Audit Logs", href: "/dashboard/audit-logs", icon: FileText },
    { label: "Users", href: "/dashboard/users", icon: Users },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ],
};
