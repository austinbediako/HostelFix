"use client";

import { Badge } from "@/components/ui/badge";
import { getStatusLabel } from "@/constants/issue-statuses";
import type { IssueStatus } from "@/types/issue";
import { cn } from "cn";
import {
  Archive,
  CheckCircle2,
  FilePlus,
  RotateCcw,
  Search,
  UserCheck,
  Wrench,
  XCircle,
  type LucideIcon,
} from "lucide-react";

interface IssueStatusBadgeProps {
  status: IssueStatus;
  className?: string;
}

const statusStyles: Record<IssueStatus, { className: string; icon: LucideIcon }> = {
  submitted: { className: "bg-info-bg text-info hover:bg-info-bg", icon: FilePlus },
  under_review: { className: "bg-primary-tint text-primary-dark hover:bg-primary-tint", icon: Search },
  assigned: { className: "bg-gold-tint text-assigned hover:bg-gold-tint", icon: UserCheck },
  in_progress: { className: "bg-warning-bg text-warning hover:bg-warning-bg", icon: Wrench },
  resolved: { className: "bg-success-bg text-success hover:bg-success-bg", icon: CheckCircle2 },
  reopened: { className: "bg-warning-bg text-warning hover:bg-warning-bg", icon: RotateCcw },
  rejected: { className: "bg-danger-bg text-danger hover:bg-danger-bg", icon: XCircle },
  closed: { className: "bg-muted text-muted-foreground hover:bg-muted", icon: Archive },
};

export function IssueStatusBadge({ status, className }: IssueStatusBadgeProps) {
  const { className: statusClass, icon: Icon } = statusStyles[status];
  return (
    <Badge className={cn("gap-1", statusClass, className)} variant="secondary">
      <Icon className="size-3.5" aria-hidden="true" />
      {getStatusLabel(status)}
    </Badge>
  );
}
