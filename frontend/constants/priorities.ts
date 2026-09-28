import type { IssuePriority } from "@/types/issue";

export const ISSUE_PRIORITIES: { value: IssuePriority; label: string }[] = [
  { value: "emergency", label: "Emergency" },
  { value: "high", label: "High" },
  { value: "normal", label: "Normal" },
  { value: "low", label: "Low" },
];

export function getPriorityLabel(priority: string) {
  return ISSUE_PRIORITIES.find((p) => p.value === priority)?.label ?? priority;
}
