import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema, ZodError } from 'zod';
import { AppError } from '../shared/errors/app-error.js';
import { ErrorCodes } from '../shared/errors/error-codes.js';

export function validateRequest(schema: ZodSchema<unknown>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = formatZodError(result.error);
      next(new AppError(400, ErrorCodes.VALIDATION_ERROR, message));
      return;
    }
    req.body = result.data as Record<string, unknown>;
    next();
  };
}

function formatZodError(error: ZodError): string {
  return error.issues
    .map((e) => `${e.path.join('.')}: ${e.message}`)
    .join('; ');
}
