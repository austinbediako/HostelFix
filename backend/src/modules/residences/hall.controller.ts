import type { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utilities/async-handler.js';
import * as hallService from './hall.service.js';
import * as hallPolicy from '../../policies/hall.policy.js';
import * as analyticsService from '../analytics/analytics.service.js';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCodes } from '../../shared/errors/error-codes.js';

export const listHalls = asyncHandler(async (_req: Request, res: Response) => {
  const halls = await hallService.getAllHalls();
  res.status(200).json({ success: true, data: halls });
});

export const getHall = asyncHandler(async (req: Request, res: Response) => {
  const hall = await hallService.getHallById((req.params.hallId as string));
  res.status(200).json({ success: true, data: hall });
});

export const listLocations = asyncHandler(async (req: Request, res: Response) => {
  const hallId = (req.params.hallId as string);
  const hall = await hallService.getHallById(hallId);
  if (!hallPolicy.canAccessHall(req.user!, hall._id as import('mongoose').Types.ObjectId)) {
    throw new AppError(403, ErrorCodes.FORBIDDEN, 'You do not have access to this hall');
  }
  const locations = await hallService.getLocationsByHallId(hallId);
  res.status(200).json({ success: true, data: locations });
});

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const hallId = (req.params.hallId as string);
  const hall = await hallService.getHallById(hallId);
  if (!hallPolicy.canAccessHall(req.user!, hall._id as import('mongoose').Types.ObjectId)) {
    throw new AppError(403, ErrorCodes.FORBIDDEN, 'You do not have access to this hall');
  }
  const metrics = await analyticsService.getHallMetrics(hallId);
  res.status(200).json({ success: true, data: metrics });
});

export const updateHall = asyncHandler(async (req: Request, res: Response) => {
  const hallId = (req.params.hallId as string);
  const hall = await hallService.getHallById(hallId);
  if (!hallPolicy.canManageHall(req.user!, hall._id as import('mongoose').Types.ObjectId)) {
    throw new AppError(403, ErrorCodes.FORBIDDEN, 'You do not have permission to update this hall');
  }
  const updated = await hallService.updateHall(hallId, req.body);
  res.status(200).json({ success: true, data: updated });
});
