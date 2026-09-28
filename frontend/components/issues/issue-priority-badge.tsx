"use client";

import { getPriorityLabel } from "@/constants/priorities";
import type { IssuePriority } from "@/types/issue";
import { cn } from "cn";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Minus,
  type LucideIcon,
} from "lucide-react";

interface IssuePriorityBadgeProps {
  priority: IssuePriority;
  className?: string;
}

// Priority is icon + text (not a filled badge) so it stays visually distinct
// from issue status — see design.md §12.
const priorityStyles: Record<IssuePriority, { className: string; icon: LucideIcon }> = {
  emergency: { className: "text-danger font-semibold", icon: AlertTriangle },
  high: { className: "text-warning font-medium", icon: ArrowUp },
  normal: { className: "text-muted-foreground font-medium", icon: Minus },
  low: { className: "text-text-muted font-medium", icon: ArrowDown },
};

export function IssuePriorityBadge({ priority, className }: IssuePriorityBadgeProps) {
  const { className: priorityClass, icon: Icon } = priorityStyles[priority];
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm", priorityClass, className)}>
      <Icon className="size-3.5" aria-hidden="true" />
      {getPriorityLabel(priority)}
    </span>
  );
}
