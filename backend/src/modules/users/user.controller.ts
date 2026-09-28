import type { Request, Response } from 'express';
import type { Role } from '../../shared/constants/roles.js';
import { asyncHandler } from '../../shared/utilities/async-handler.js';
import * as userService from './user.service.js';
import * as userPolicy from '../../policies/user.policy.js';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCodes } from '../../shared/errors/error-codes.js';

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  if (!userPolicy.canListUsers(req.user!)) {
    throw new AppError(403, ErrorCodes.FORBIDDEN, 'You cannot list users');
  }
  const result = await userService.listUsers({
    role: (req.query.role as Role | undefined) || undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    offset: req.query.offset ? Number(req.query.offset) : undefined,
  });
  res.status(200).json({ success: true, data: result });
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const targetId = (req.params.userId as string);
  if (!userPolicy.canViewUser(req.user!, targetId)) {
    throw new AppError(403, ErrorCodes.FORBIDDEN, 'You cannot view this user');
  }
  const user = await userService.getUserById(targetId);
  res.status(200).json({ success: true, data: user });
});

export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const targetId = (req.params.userId as string);
  if (!userPolicy.canChangeRole(req.user!)) {
    throw new AppError(403, ErrorCodes.FORBIDDEN, 'Only system administrators can change roles');
  }
  const user = await userService.updateUserRole(req.user!._id, targetId, req.body.role, req.requestId);
  res.status(200).json({ success: true, data: user });
});
