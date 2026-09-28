import type { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utilities/async-handler.js';
import * as analyticsService from './analytics.service.js';

export const getOverview = asyncHandler(async (_req: Request, res: Response) => {
  const data = await analyticsService.getOverview();
  res.status(200).json({ success: true, data });
});

export const getHallAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const data = await analyticsService.getHallMetrics((req.params.hallId as string));
  res.status(200).json({ success: true, data });
});
