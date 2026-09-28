// Hall crests displayed on dashboards. CMH and MSH are the halls' official
// crests; the rest are project-owned flat shield badges in the design-system
// palette (see design.md). Keyed by hall code.

export const HALL_LOGOS: Record<string, string> = {
  AKU: "/halls/AKU.svg",
  LEG: "/halls/LEG.svg",
  VOL: "/halls/VOL.svg",
  CMH: "/halls/CMH.png",
  MSH: "/halls/MSH.png",
  HLH: "/halls/HLH.svg",
  AAK: "/halls/AAK.svg",
  EFS: "/halls/EFS.svg",
  JNA: "/halls/JNA.svg",
  DJH: "/halls/DJH.svg",
};

export function getHallLogo(code: string | undefined): string | null {
  if (!code) return null;
  return HALL_LOGOS[code.toUpperCase()] ?? null;
}
