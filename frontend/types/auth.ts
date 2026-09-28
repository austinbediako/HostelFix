import type { LocationType } from "./hall";

export type Role = "student" | "hall_manager" | "maintenance" | "university_admin" | "system_admin";

export interface HallAssignment {
  id: string;
  name: string;
  code: string;
}

export interface AllocatedLocation {
  id: string;
  block?: string;
  floor?: string;
  room?: string;
  commonArea?: string;
  type: LocationType;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  assignedHalls: HallAssignment[];
  allocatedLocation: AllocatedLocation | null;
}

export interface LoginInput {
  id: string;
  pin: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface AuthContextValue {
  user: CurrentUser | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
}
