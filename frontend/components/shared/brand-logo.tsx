import Image from "next/image";
import { cn } from "cn";

interface BrandLogoProps {
  variant?: "default" | "reversed";
  size?: "compact" | "auth";
  className?: string;
}

export function BrandLogo({ variant = "default", size = "compact", className }: BrandLogoProps) {
  return (
    <Image
      src={`/brand/hostelfix-logo${variant === "reversed" ? "-reversed" : ""}.svg`}
      alt="HostelFix"
      width={259}
      height={64}
      loading="eager"
      draggable={false}
      className={cn("h-auto max-w-full select-none", size === "auth" ? "w-72" : "w-44", className)}
    />
  );
}
