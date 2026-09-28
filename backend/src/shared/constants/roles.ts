export const ROLES = {
  STUDENT: 'student',
  HALL_MANAGER: 'hall_manager',
  MAINTENANCE: 'maintenance',
  UNIVERSITY_ADMIN: 'university_admin',
  SYSTEM_ADMIN: 'system_admin',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_RANK: Record<Role, number> = {
  [ROLES.STUDENT]: 1,
  [ROLES.MAINTENANCE]: 2,
  [ROLES.HALL_MANAGER]: 3,
  [ROLES.UNIVERSITY_ADMIN]: 4,
  [ROLES.SYSTEM_ADMIN]: 5,
};
