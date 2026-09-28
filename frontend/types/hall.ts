export type HallType = "traditional" | "ugel";

export interface Hall {
  id: string;
  name: string;
  code: string;
  type: HallType;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type LocationType =
  | "room"
  | "washroom"
  | "corridor"
  | "laundry"
  | "common_area"
  | "other";

export interface Location {
  id: string;
  hallId: string;
  block?: string;
  floor?: string;
  room?: string;
  commonArea?: string;
  type: LocationType;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
