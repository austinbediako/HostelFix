import { Illustration, type IllustrationName } from "./illustration";

interface SuccessStateProps {
  title: string;
  description: React.ReactNode;
  illustration?: IllustrationName;
  children?: React.ReactNode;
}

export function SuccessState({
  title,
  description,
  illustration = "submission-success",
  children,
}: SuccessStateProps) {
  return (
    <section
      role="status"
      className="mb-6 flex flex-col items-center gap-6 rounded-md border border-border bg-card p-6 text-center sm:flex-row sm:text-left md:p-8"
    >
      <Illustration name={illustration} eager className="w-36 shrink-0 md:w-44" />
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <div className="text-sm text-muted-foreground">{description}</div>
        {children && <div className="flex flex-wrap justify-center gap-3 pt-2 sm:justify-start">{children}</div>}
      </div>
    </section>
  );
}
