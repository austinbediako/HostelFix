import type { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import { getRequestLogger } from '../config/logger.js';

export function requestIdMiddleware(req: Request, _res: Response, next: NextFunction) {
  req.requestId = (req.headers['x-request-id'] as string) ?? `req_${crypto.randomUUID()}`;
  getRequestLogger(req.requestId);
  next();
}
