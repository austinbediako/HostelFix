import { rateLimit } from 'express-rate-limit';
import { env } from '../config/environment.js';
import { AppError } from '../shared/errors/app-error.js';
import { ErrorCodes } from '../shared/errors/error-codes.js';

function createLimiter(windowMs: number, max: number, message: string) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => {
      next(new AppError(429, ErrorCodes.RATE_LIMIT_EXCEEDED, message));
    },
  });
}

export const loginLimiter = createLimiter(
  env.rateLimitLoginWindowMs,
  env.rateLimitLoginMax,
  'Too many login attempts; please try again later.',
);

export const uploadLimiter = createLimiter(
  env.rateLimitUploadWindowMs,
  env.rateLimitUploadMax,
  'Too many upload signature requests; please try again later.',
);

export const issueCreationLimiter = createLimiter(
  env.rateLimitIssueWindowMs,
  env.rateLimitIssueMax,
  'Too many issue creation requests; please try again later.',
);

export const commentLimiter = createLimiter(
  env.rateLimitCommentWindowMs,
  env.rateLimitCommentMax,
  'Too many comments; please try again later.',
);
