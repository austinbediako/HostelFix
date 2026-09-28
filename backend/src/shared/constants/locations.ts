export const LOCATION_TYPES = [
  'room',
  'washroom',
  'corridor',
  'laundry',
  'common_area',
  'other',
] as const;

export type LocationType = (typeof LOCATION_TYPES)[number];

export const HALL_TYPES = ['traditional', 'ugel'] as const;

export type HallType = (typeof HALL_TYPES)[number];
