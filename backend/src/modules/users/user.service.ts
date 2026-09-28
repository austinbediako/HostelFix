import type mongoose from 'mongoose';
import { User } from './user.model.js';
import { RefreshToken } from '../auth/refresh-token.model.js';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCodes } from '../../shared/errors/error-codes.js';
import { ROLES, type Role } from '../../shared/constants/roles.js';
import * as auditLogService from '../audit-logs/audit-log.service.js';
import { jobQueue } from '../../jobs/queue.js';

export async function listUsers(options: { role?: Role; limit?: number; offset?: number } = {}) {
  const query: Record<string, unknown> = {};
  if (options.role) query.role = options.role;
  const limit = options.limit ?? 50;
  const offset = options.offset ?? 0;
  const [items, total] = await Promise.all([
    User.find(query)
      .populate('assignedHallIds', 'name code')
      .populate('allocatedLocationId', 'block floor room commonArea type')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);
  return { items, total, limit, offset };
}

export async function getUserById(userId: string) {
  const user = await User.findById(userId)
    .populate('assignedHallIds', 'name code')
    .populate('allocatedLocationId', 'block floor room commonArea type')
    .lean();
  if (!user) throw new AppError(404, ErrorCodes.NOT_FOUND, 'User not found');
  return user;
}

export async function updateUserRole(
  actorId: mongoose.Types.ObjectId,
  targetUserId: string,
  newRole: Role,
  requestId?: string,
) {
  if (!Object.values(ROLES).includes(newRole)) {
    throw new AppError(400, ErrorCodes.BAD_REQUEST, 'Invalid role');
  }

  const user = await User.findById(targetUserId);
  if (!user) throw new AppError(404, ErrorCodes.NOT_FOUND, 'User not found');

  const previousRole = user.role;
  user.role = newRole;
  await user.save();

  // Revoke all refresh tokens for the affected user to force re-auth
  await RefreshToken.deleteMany({ userId: user._id });

  await auditLogService.createAuditLog(
    'user.role.update',
    actorId,
    'User',
    user._id,
    { previousRole, newRole },
    requestId,
  );

  jobQueue.enqueue('notification', {
    userId: user._id.toString(),
    template: 'role_changed',
    data: { previousRole, newRole },
  });

  return user;
}
