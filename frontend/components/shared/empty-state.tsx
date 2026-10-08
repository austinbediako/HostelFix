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
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-5 rounded-none border-2 border-dashed border-border/60 bg-primary-tint/10 px-6 py-12 text-center transition-all hover:border-primary/30">
      {illustration ? (
        <div className="transition-transform duration-500 hover:scale-105">
          <Illustration name={illustration} className="w-40 drop-shadow-sm md:w-48" />
        </div>
      ) : (
        <div className="rounded-none bg-primary-tint/50 p-4 transition-transform hover:scale-110">
          <Inbox className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>
      )}
      <div className="max-w-sm space-y-1.5">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action?.href && (
        <Link href={action.href} className={buttonVariants({ size: "lg", className: "mt-2 shadow-sm transition-all hover:-translate-y-0.5" })}>
          {action.label}
        </Link>
      )}
      {action?.onClick && (
        <Button variant="outline" size="lg" className="mt-2 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary-tint" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
