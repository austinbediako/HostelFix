import type { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utilities/async-handler.js';
import * as uploadService from './upload.service.js';

export const getSignature = asyncHandler(async (req: Request, res: Response) => {
  const signature = uploadService.createUploadSignature(req.user!);
  res.status(200).json({ success: true, data: signature });
});
