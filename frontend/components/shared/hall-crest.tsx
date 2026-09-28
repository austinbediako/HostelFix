import Image from "next/image";
import { getHallLogo } from "@/lib/hall-logos";
import type { HallAssignment } from "@/types/auth";

interface HallCrestProps {
  hall: HallAssignment | null | undefined;
  size?: number;
  showName?: boolean;
}

export function HallCrest({ hall, size = 44, showName = true }: HallCrestProps) {
  const logo = getHallLogo(hall?.code);

  return (
    <div className="flex items-center gap-3">
      {logo ? (
        <Image
          src={logo}
          alt={hall ? `${hall.name} crest` : "Hall crest"}
          width={size}
          height={size}
          className="h-11 w-11 object-contain"
        />
      ) : (
        <span
          aria-hidden
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
        >
          {hall?.code ?? "?"}
        </span>
      )}
      {showName && hall && (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-tight">{hall.name}</p>
          <p className="text-xs text-muted-foreground">Hall of residence</p>
        </div>
      )}
    </div>
  );
}
