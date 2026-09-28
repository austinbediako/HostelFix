import Image from "next/image";
import { cn } from "cn";

// Catalog and usage rules: design.md §33 Illustration System.
const ILLUSTRATIONS = {
  "report-issue": { width: 480, height: 360 },
  "issue-tracking": { width: 480, height: 360 },
  maintenance: { width: 480, height: 360 },
  resolved: { width: 480, height: 360 },
  campus: { width: 480, height: 360 },
  support: { width: 480, height: 360 },
  "empty-reports": { width: 320, height: 240 },
  "no-notifications": { width: 320, height: 240 },
  "no-results": { width: 320, height: 240 },
  "submission-success": { width: 320, height: 240 },
  "audit-trail": { width: 320, height: 240 },
  "users-directory": { width: 320, height: 240 },
} as const;

export type IllustrationName = keyof typeof ILLUSTRATIONS;

interface IllustrationProps {
  name: IllustrationName;
  className?: string;
  /** Illustrations are decorative by default; pass alt only when the image carries meaning. */
  alt?: string;
  /** Set for illustrations that render above the fold (Next 16 replaces `priority` with `loading="eager"`). */
  eager?: boolean;
}

export function Illustration({ name, className, alt = "", eager }: IllustrationProps) {
  const { width, height } = ILLUSTRATIONS[name];
  return (
    <Image
      src={`/illustrations/${name}.svg`}
      width={width}
      height={height}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      loading={eager ? "eager" : undefined}
      className={cn("h-auto select-none", className)}
      draggable={false}
    />
  );
}
