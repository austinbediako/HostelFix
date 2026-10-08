interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-2 border-b border-border/50 pb-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground md:text-base">{description}</p>
        )}
      </div>
      {children && <div className="mt-4 flex items-center gap-4 md:mt-0">{children}</div>}
    </div>
  );
}
