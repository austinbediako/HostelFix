import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Illustration, type IllustrationName } from "./illustration";

interface FeatureCardProps {
  title: string;
  description: string;
  illustration: IllustrationName;
  action: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
}

// Asymmetric content-led card: text carries the message, the illustration supports it.
// Use at most one per page (design.md §33).
export function FeatureCard({ title, description, illustration, action, secondaryAction }: FeatureCardProps) {
  return (
    <section className="group relative mb-8 overflow-hidden rounded-none border border-primary/20 bg-primary-tint/30 shadow-sm transition-all hover:shadow-md">
      <div className="absolute inset-y-0 left-0 w-1 bg-accent" aria-hidden="true" />
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
        <div className="max-w-md space-y-3">
          <h2 className="text-xl font-bold text-foreground md:text-[22px]">{title}</h2>
          <p className="text-sm text-muted-foreground md:text-base">{description}</p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={action.href}
              className="inline-flex h-10 items-center gap-2 rounded-none bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {action.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                className="text-sm font-semibold text-primary underline-offset-4 transition-colors hover:text-primary-dark hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-none"
              >
                {secondaryAction.label}
              </Link>
            )}
          </div>
        </div>
        <div className="hidden shrink-0 transition-transform duration-500 hover:-rotate-1 hover:scale-105 sm:block">
          <Illustration name={illustration} eager className="w-52 drop-shadow-sm lg:w-60" />
        </div>
      </div>
    </section>
  );
}
