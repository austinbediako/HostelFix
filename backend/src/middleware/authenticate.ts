import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../shared/errors/app-error.js';
import { ErrorCodes } from '../shared/errors/error-codes.js';
import { env } from '../config/environment.js';
import { User } from '../modules/users/user.model.js';
import type { Role } from '../shared/constants/roles.js';
import type mongoose from 'mongoose';

interface AccessTokenPayload {
  sub: string;
  email: string;
  role: Role;
  assignedHallIds: string[];
  allocatedLocationId?: string;
  name: string;
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = extractAccessToken(req);
    if (!token) {
      next(new AppError(401, ErrorCodes.UNAUTHORIZED, 'Access token required'));
      return;
    }

    const decoded = jwt.verify(token, env.accessTokenSecret) as AccessTokenPayload;
    const user = await User.findById(decoded.sub).lean();
    if (!user || !user.active) {
      next(new AppError(401, ErrorCodes.UNAUTHORIZED, 'User inactive or not found'));
      return;
    }

    req.user = {
      _id: user._id as mongoose.Types.ObjectId,
      studentId: user.studentId,
      staffId: user.staffId,
      email: user.email,
      role: user.role,
      assignedHallIds: user.assignedHallIds as mongoose.Types.ObjectId[],
      allocatedLocationId: user.allocatedLocationId as mongoose.Types.ObjectId | undefined,
      name: user.name,
    };

    next();
  } catch {
    next(new AppError(401, ErrorCodes.UNAUTHORIZED, 'Invalid or expired access token'));
  }
}

function extractAccessToken(req: Request): string | undefined {
  if (req.cookies?.access_token) return req.cookies.access_token as string;
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7);
  return undefined;
}
