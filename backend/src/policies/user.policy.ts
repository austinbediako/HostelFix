import type { Express } from 'express';
import { ROLES } from '../shared/constants/roles.js';

export function canListUsers(user: Express.User): boolean {
  return user.role === ROLES.UNIVERSITY_ADMIN || user.role === ROLES.SYSTEM_ADMIN;
}

export function canViewUser(user: Express.User, targetUserId: string): boolean {
  if (canListUsers(user)) return true;
  return user._id.toString() === targetUserId;
}

export function canChangeRole(user: Express.User): boolean {
  return user.role === ROLES.SYSTEM_ADMIN;
}
