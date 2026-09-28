import Link from "next/link";
import { Inbox } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Illustration, type IllustrationName } from "./illustration";

type EmptyStateAction =
  | { label: string; onClick: () => void; href?: never }
  | { label: string; href: string; onClick?: never };

interface EmptyStateProps {
  title?: string;
  description?: string;
  illustration?: IllustrationName;
  action?: EmptyStateAction;
}

export function EmptyState({
  title = "No items found",
  description = "There is nothing to show here yet.",
  illustration,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-md border border-border bg-card px-6 py-10 text-center">
      {illustration ? (
        <Illustration name={illustration} className="w-40 md:w-48" />
      ) : (
        <Inbox className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      )}
      <div className="max-w-sm space-y-1">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action?.href && (
        <Link href={action.href} className={buttonVariants({ size: "lg" })}>
          {action.label}
        </Link>
      )}
      {action?.onClick && (
        <Button variant="outline" size="lg" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
