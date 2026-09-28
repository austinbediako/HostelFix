"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Illustration } from "@/components/shared/illustration";
import { IssueStatusBadge } from "@/components/issues/issue-status-badge";
import type { IssueStatus } from "@/types/issue";

const STATUS_HELP: { status: IssueStatus; body: string }[] = [
  { status: "submitted", body: "Your report has been received and given a reference number." },
  { status: "under_review", body: "Hall management is reviewing the report. They may ask you for more detail." },
  { status: "assigned", body: "Maintenance staff have been assigned to the job." },
  { status: "in_progress", body: "Work on the repair has started." },
  { status: "resolved", body: "Staff have recorded the repair as done. You can reopen it if the problem remains." },
  { status: "reopened", body: "The issue was reported as not fixed and is back in the queue." },
  { status: "rejected", body: "The report was declined, for example because it is a duplicate or outside hall maintenance." },
  { status: "closed", body: "The issue is complete. Resolved issues close automatically after the dispute window." },
];

const TIPS = [
  "Choose the category that best matches the problem — plumbing, electrical, sanitation, internet, or structural.",
  "Give your exact room number so staff can find it without calling you.",
  "Describe what you see and when it started, for example “water leaking under the sink since Monday”.",
  "Add a photo when it helps show the problem.",
];

export default function HelpPage() {
  return (
    <>
      <PageHeader title="Help" description="How reporting works and what to do in an emergency." />

      <section
        role="note"
        className="mb-8 flex gap-3 rounded-md border border-danger/30 bg-danger-bg p-4 text-sm text-danger"
      >
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-semibold">HostelFix is not an emergency line.</p>
          <p>
            For fire, flooding, exposed wiring, or any immediate danger, alert your hall porter&apos;s lodge, hall
            management, or campus security first. Then report it here so there is a record.
          </p>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <section className="rounded-md border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold">What each status means</h2>
            <dl className="space-y-3">
              {STATUS_HELP.map(({ status, body }) => (
                <div key={status} className="grid gap-1 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-start sm:gap-4">
                  <dt>
                    <IssueStatusBadge status={status} />
                  </dt>
                  <dd className="text-sm text-muted-foreground">{body}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-md border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold">Writing a useful report</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {TIPS.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-md border border-border bg-card p-6">
            <h2 className="mb-2 text-lg font-bold">Your account</h2>
            <p className="text-sm text-muted-foreground">
              HostelFix accounts are created by the University from student and staff records, so there is no
              sign-up form. If you cannot sign in, use{" "}
              <Link href="/forgot-password" className="font-semibold text-primary underline-offset-4 hover:underline">
                Forgot password
              </Link>{" "}
              on the sign-in page to request a reset link by email. For other account problems, contact your hall office.
            </p>
          </section>
        </div>

        <aside className="hidden self-start rounded-md border border-border bg-card p-6 lg:block">
          <Illustration name="support" eager className="mb-4 w-full" />
          <h2 className="mb-2 text-base font-semibold">Still stuck?</h2>
          <p className="text-sm text-muted-foreground">
            Your hall office can help with anything this page does not cover, including reports that need a
            follow-up conversation.
          </p>
        </aside>
      </div>
    </>
  );
}
