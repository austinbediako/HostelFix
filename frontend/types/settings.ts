import type { IssuePriority } from "./issue";

export interface SystemSettings {
  disputeWindowHours: number;
  priorityTargetHours: Record<IssuePriority, number>;
  supportEmail: string;
}
