import type mongoose from 'mongoose';
import type { Express } from 'express';
import { ROLES } from '../shared/constants/roles.js';

function isAdmin(user: Express.User) {
  return user.role === ROLES.UNIVERSITY_ADMIN || user.role === ROLES.SYSTEM_ADMIN;
}

export function canAccessHall(user: Express.User, hallId: mongoose.Types.ObjectId): boolean {
  if (isAdmin(user)) return true;
  if (user.role === ROLES.HALL_MANAGER || user.role === ROLES.MAINTENANCE) {
    return user.assignedHallIds.some((id) => id.equals(hallId));
  }
  // Students may view approved hall locations for reporting; dashboard uses a separate role guard.
  if (user.role === ROLES.STUDENT) return true;
  return false;
}

export function canManageHall(user: Express.User, hallId: mongoose.Types.ObjectId): boolean {
  if (user.role === ROLES.SYSTEM_ADMIN) return true;
  if (user.role === ROLES.UNIVERSITY_ADMIN) return true;
  if (user.role === ROLES.HALL_MANAGER) {
    return user.assignedHallIds.some((id) => id.equals(hallId));
  }
  return false;
}
