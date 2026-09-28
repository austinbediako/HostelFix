import type { Request, Response } from 'express';
import { AppError } from '../shared/errors/app-error.js';
import { ErrorCodes } from '../shared/errors/error-codes.js';

export function notFoundHandler(req: Request, _res: Response, next: (err: Error) => void) {
  next(new AppError(404, ErrorCodes.NOT_FOUND, `Cannot ${req.method} ${req.path}`));
}
