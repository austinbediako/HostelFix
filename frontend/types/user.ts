import type { Role } from "./auth";
import type { LocationType } from "./hall";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  studentId?: string;
  staffId?: string;
  assignedHallIds: { id: string; name: string; code: string }[];
  allocatedLocationId?: {
    id: string;
    block?: string;
    floor?: string;
    room?: string;
    commonArea?: string;
    type: LocationType;
  };
  createdAt: string;
  updatedAt: string;
}
