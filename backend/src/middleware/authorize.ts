import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/app-error.js';
import { ErrorCodes } from '../shared/errors/error-codes.js';
import { ROLE_RANK, type Role } from '../shared/constants/roles.js';

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required'));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new AppError(403, ErrorCodes.FORBIDDEN, 'Insufficient role'));
      return;
    }
    next();
  };
}

export function requireMinimumRole(role: Role) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required'));
      return;
    }
    if (ROLE_RANK[req.user.role] < ROLE_RANK[role]) {
      next(new AppError(403, ErrorCodes.FORBIDDEN, 'Insufficient privileges'));
      return;
    }
    next();
  };
}
