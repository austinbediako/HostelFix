import Image from "next/image";
import { BrandLogo } from "@/components/shared/brand-logo";

// Shared auth layout, modelled on the UG Students/Staff Services sign-in:
// duotone campus photo fading into a solid UG Blue panel. See design.md §34.

export const authInputClass =
  "h-12 w-full rounded-none border border-white/60 bg-transparent px-4 text-base text-white placeholder:text-white/50 outline-none transition-colors focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40 aria-invalid:border-gold-light";

export const authLabelClass = "text-sm font-medium text-white/85";

export const authButtonClass =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-none bg-accent text-base font-semibold text-foreground transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark disabled:pointer-events-none disabled:opacity-60";

export const authLinkClass =
  "text-sm font-medium text-white/85 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function AuthFieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="bg-danger-bg px-3 py-1.5 text-sm font-medium text-danger">
      {message}
    </p>
  );
}

interface AuthShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-primary-dark text-white">
      <div className="relative flex flex-1">
        <div className="absolute inset-0 lg:right-auto lg:w-[60%]" aria-hidden="true">
          <Image
            src="/ug.jpeg"
            alt=""
            fill
            loading="eager"
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover grayscale"
          />
          <div className="absolute inset-0 bg-primary mix-blend-multiply" />
          <div className="absolute inset-0 bg-primary-dark/80 lg:bg-transparent lg:bg-[linear-gradient(to_right,transparent_35%,var(--primary-dark)_100%)]" />
        </div>

        <div className="relative z-10 hidden flex-1 items-end p-12 lg:flex">
          <div className="max-w-md">
            <div className="mb-4 h-1 w-12 bg-accent" />
            <p className="text-[26px] font-bold leading-tight">
              Report hall maintenance issues. Track them until they are fixed.
            </p>
          </div>
        </div>

        <main className="relative z-10 flex w-full items-center justify-center px-6 py-12 lg:w-[44%] lg:px-16">
          <div className="w-full max-w-sm">
            <div className="mb-10 text-center">
              <BrandLogo variant="reversed" size="auth" className="mx-auto" />
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                University of Ghana · Legon Halls
              </p>
            </div>
            <h1 className="text-center text-xl font-bold">{title}</h1>
            <p className="mb-8 mt-1 text-center text-sm text-white/75">{description}</p>
            {children}
          </div>
        </main>
      </div>

      <footer className="relative z-10 border-t border-white/15 px-4 py-3 text-center text-xs text-white/70">
        HostelFix · Hall maintenance reporting for University of Ghana, Legon residents
      </footer>
    </div>
  );
}
