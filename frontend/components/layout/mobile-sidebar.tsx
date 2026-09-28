"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "cn";
import { BrandLogo } from "@/components/shared/brand-logo";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthContext } from "@/providers/auth-provider";
import { ROLE_NAVIGATION, getActiveHref } from "@/lib/navigation";
import { useUIStore } from "@/stores/ui-store";

export function MobileSidebar() {
  const { user } = useAuthContext();
  const pathname = usePathname();
  const { sidebarOpen, openSidebar, closeSidebar } = useUIStore();

  if (!user) return null;

  const items = ROLE_NAVIGATION[user.role];
  const activeHref = getActiveHref(items, pathname);

  return (
    <Sheet open={sidebarOpen} onOpenChange={(open) => (open ? openSidebar() : closeSidebar())}>
      <SheetTrigger className="inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring lg:hidden">
        <Menu className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-sidebar p-0">
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <Link href="/dashboard" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4" onClick={closeSidebar}>
            <BrandLogo />
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === activeHref;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                  "relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-secondary",
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r bg-primary" aria-hidden="true" />
                )}
                <Icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
