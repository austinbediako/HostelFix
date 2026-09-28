import { describe, it, expect } from "vitest";
import { ISSUE_STATUSES, getStatusLabel } from "@/constants/issue-statuses";

describe("issue status helpers", () => {
  it("returns label for each known status", () => {
    for (const status of ISSUE_STATUSES) {
      expect(getStatusLabel(status.value)).toBe(status.label);
    }
  });

  it("returns fallback for unknown status", () => {
    expect(getStatusLabel("unknown")).toBe("unknown");
  });
});
