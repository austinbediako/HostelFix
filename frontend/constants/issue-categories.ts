import type { IssueCategory } from "@/types/issue";

export const ISSUE_CATEGORIES: { value: IssueCategory; label: string }[] = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "sanitation", label: "Sanitation" },
  { value: "internet", label: "Internet" },
  { value: "structural", label: "Structural" },
  { value: "other", label: "Other" },
];
