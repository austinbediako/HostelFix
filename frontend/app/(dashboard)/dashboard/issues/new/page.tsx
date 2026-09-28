"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/role-guard";
import { IssueForm, type IssueFormData } from "@/components/forms/issue-form";
import { PageHeader } from "@/components/shared/page-header";
import { Illustration } from "@/components/shared/illustration";
import { useCreateIssue } from "@/hooks/use-issues";

const NEXT_STEPS = [
  { title: "Submitted", body: "You get a reference number straight away." },
  { title: "Reviewed", body: "Hall management checks the report and may assign it." },
  { title: "Fixed", body: "Maintenance carries out the repair and marks it resolved." },
  { title: "Confirmed", body: "You have 48 hours to reopen it if the problem persists." },
];

export default function NewIssuePage() {
  const router = useRouter();
  const createIssue = useCreateIssue();

  async function onSubmit(data: IssueFormData) {
    try {
      const issue = await createIssue.mutateAsync({
        hallId: data.hallId,
        room: data.room,
        category: data.category,
        description: data.description,
        reportedPriority: data.reportedPriority,
        imageUrls: data.imageUrls,
      });
      router.push(`/dashboard/issues/${issue.id}?submitted=1`);
    } catch {
      toast.error("Failed to submit issue. Please try again.");
    }
  }

  return (
    <RoleGuard allowedRoles={["student"]}>
      <PageHeader
        title="Report an Issue"
        description="Describe the problem and where it is located."
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-md border border-border bg-card p-4 md:p-6">
          <IssueForm onSubmit={onSubmit} isSubmitting={createIssue.isPending} />
        </div>
        <aside className="hidden self-start rounded-md border border-border bg-card p-6 lg:block">
          <Illustration name="issue-tracking" eager className="mb-4 w-full" />
          <h2 className="mb-4 text-base font-semibold">What happens next</h2>
          <ol className="space-y-4">
            {NEXT_STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-tint text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="text-sm text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </RoleGuard>
  );
}
