"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";
import { useAuthContext } from "@/providers/auth-provider";

export function TopBar() {
  const { user } = useAuthContext();

  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:left-64">
      <MobileSidebar />
      <div className="ml-auto flex items-center gap-2">
        {user?.role === "student" && (
          <Link
            href="/dashboard/issues/new"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <PlusCircle className="h-4 w-4" aria-hidden="true" />
            Report Issue
          </Link>
        )}
        <UserNav />
      </div>
    </header>
  );
}
