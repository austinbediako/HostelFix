import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/app-error.js';
import { ErrorCodes } from '../shared/errors/error-codes.js';
import { logger } from '../config/logger.js';
import { isProduction } from '../config/environment.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const requestId = req.requestId ?? 'unknown';

  if (err instanceof AppError) {
    logger.warn({ err, requestId, path: req.path }, 'Operational error');
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        requestId,
      },
    });
    return;
  }

  if (err.name === 'ValidationError') {
    logger.warn({ err, requestId, path: req.path }, 'Mongoose validation error');
    res.status(400).json({
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: err.message,
        requestId,
      },
    });
    return;
  }

  if (err.name === 'CastError') {
    logger.warn({ err, requestId, path: req.path }, 'Mongoose cast error');
    res.status(400).json({
      error: {
        code: ErrorCodes.BAD_REQUEST,
        message: 'Invalid identifier',
        requestId,
      },
    });
    return;
  }

  if (err.name === 'MongoServerError' && (err as unknown as { code: number }).code === 11000) {
    logger.warn({ err, requestId, path: req.path }, 'Duplicate key error');
    res.status(409).json({
      error: {
        code: ErrorCodes.CONFLICT,
        message: 'Resource already exists',
        requestId,
      },
    });
    return;
  }

  logger.error({ err, requestId, path: req.path }, 'Unexpected error');
  res.status(500).json({
    error: {
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: isProduction ? 'An unexpected error occurred' : err.message,
      requestId,
    },
  });
}
