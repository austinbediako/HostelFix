import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { Response } from 'express';
import { env } from '../../config/environment.js';
import { User } from '../users/user.model.js';
import { RefreshToken } from './refresh-token.model.js';
import { PasswordResetToken } from './password-reset-token.model.js';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCodes } from '../../shared/errors/error-codes.js';
import { logger } from '../../config/logger.js';
import type { Role } from '../../shared/constants/roles.js';
import type mongoose from 'mongoose';

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

interface TokenPayload {
  sub: string;
  email: string;
  role: Role;
  assignedHallIds: string[];
  allocatedLocationId?: string;
  name: string;
}

function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.accessTokenSecret, {
    expiresIn: env.accessTokenExpiry as never,
  });
}

function createRefreshToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
  const cookieOptions = {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite as 'lax' | 'strict' | 'none',
    path: '/',
  };
  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

function clearAuthCookies(res: Response): void {
  res.clearCookie(ACCESS_TOKEN_COOKIE, { path: '/' });
  res.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/' });
}

export async function login(id: string, pin: string, res: Response) {
  const normalizedId = id.toLowerCase();
  const user = await User.findOne({
    $or: [
      { email: normalizedId },
      { studentId: id },
      { staffId: id },
    ],
  })
    .select('+passwordHash')
    .populate('assignedHallIds', 'name code')
    .populate({
      path: 'allocatedLocationId',
      select: 'block floor room commonArea type hallId',
      populate: { path: 'hallId', select: 'name code' },
    });
  if (!user || !user.passwordHash) {
    throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  const valid = await bcrypt.compare(pin, user.passwordHash);
  if (!valid) {
    throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  const accessToken = signAccessToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
    assignedHallIds: user.assignedHallIds.map((id: any) => id._id ? id._id.toString() : id.toString()),
    allocatedLocationId: (user.allocatedLocationId as any)?._id ? (user.allocatedLocationId as any)._id.toString() : user.allocatedLocationId?.toString(),
    name: user.name,
  });

  const rawRefreshToken = createRefreshToken();
  const refreshTokenHash = hashToken(rawRefreshToken);
  await RefreshToken.create({
    userId: user._id,
    tokenHash: refreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  setAuthCookies(res, accessToken, rawRefreshToken);

  return sanitizeUser(user);
}

export async function logout(refreshToken: string | undefined, res: Response) {
  clearAuthCookies(res);
  if (refreshToken) {
    await RefreshToken.deleteOne({ tokenHash: hashToken(refreshToken) });
  }
}

export async function refresh(refreshToken: string | undefined, res: Response) {
  if (!refreshToken) {
    throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Refresh token required');
  }
  const tokenHash = hashToken(refreshToken);
  const stored = await RefreshToken.findOne({ tokenHash }).populate({
    path: 'userId',
    populate: [
      { path: 'assignedHallIds', select: 'name code' },
      { 
        path: 'allocatedLocationId', 
        select: 'block floor room commonArea type hallId',
        populate: { path: 'hallId', select: 'name code' },
      }
    ]
  });
  if (!stored || stored.expiresAt < new Date()) {
    clearAuthCookies(res);
    throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Invalid or expired refresh token');
  }

  const user = stored.userId as unknown as {
    _id: mongoose.Types.ObjectId;
    email: string;
    role: Role;
    assignedHallIds: mongoose.Types.ObjectId[];
    allocatedLocationId?: mongoose.Types.ObjectId;
    name: string;
    active: boolean;
    passwordHash?: string;
  };

  if (!user.active) {
    clearAuthCookies(res);
    throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'User inactive');
  }

  await RefreshToken.deleteOne({ _id: stored._id });

  const newAccessToken = signAccessToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
    assignedHallIds: user.assignedHallIds.map((id: any) => id._id ? id._id.toString() : id.toString()),
    allocatedLocationId: (user.allocatedLocationId as any)?._id ? (user.allocatedLocationId as any)._id.toString() : user.allocatedLocationId?.toString(),
    name: user.name,
  });
  const newRawRefreshToken = createRefreshToken();
  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashToken(newRawRefreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  setAuthCookies(res, newAccessToken, newRawRefreshToken);

  return sanitizeUser(user as unknown as mongoose.Document & { email: string; role: Role; name: string });
}

export async function forgotPassword(email: string) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    // Do not reveal whether email exists
    logger.info({ email }, 'Password reset requested for unknown email');
    return { message: 'If the email exists, a reset link has been sent' };
  }

  await PasswordResetToken.deleteMany({ userId: user._id });
  const rawToken = crypto.randomBytes(32).toString('hex');
  await PasswordResetToken.create({
    userId: user._id,
    tokenHash: hashToken(rawToken),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  // In production, an email adapter sends the token. In dev, log it.
  logger.info({ email, resetToken: rawToken }, 'Password reset token generated');
  return { message: 'If the email exists, a reset link has been sent' };
}

export async function resetPassword(token: string, password: string) {
  const tokenHash = hashToken(token);
  const record = await PasswordResetToken.findOne({ tokenHash });
  if (!record || record.expiresAt < new Date()) {
    throw new AppError(400, ErrorCodes.BAD_REQUEST, 'Invalid or expired reset token');
  }

  const passwordHash = await bcrypt.hash(password, env.bcryptRounds);
  await User.findByIdAndUpdate(record.userId, { passwordHash });
  await PasswordResetToken.deleteOne({ _id: record._id });
  await RefreshToken.deleteMany({ userId: record.userId });
  return { message: 'Password reset successful' };
}

export async function getMe(userId: string) {
  const user = await User.findById(userId)
    .populate('assignedHallIds', 'name code')
    .populate({
      path: 'allocatedLocationId',
      select: 'block floor room commonArea type hallId',
      populate: { path: 'hallId', select: 'name code' },
    });
  if (!user) {
    throw new AppError(404, ErrorCodes.NOT_FOUND, 'User not found');
  }
  return sanitizeUser(user);
}

function sanitizeUser(
  user: mongoose.Document & { email: string; role: Role; name: string; active?: boolean },
) {
  const doc = user.toObject();
  return {
    id: doc._id.toString(),
    email: doc.email,
    name: doc.name,
    role: doc.role,
    active: doc.active,
    assignedHalls: (doc.assignedHallIds ?? []).map((h: { _id?: mongoose.Types.ObjectId; name?: string; code?: string }) => ({
      id: h._id?.toString(),
      name: h.name,
      code: h.code,
    })),
    allocatedLocation: doc.allocatedLocationId
      ? {
          id: doc.allocatedLocationId._id?.toString(),
          block: doc.allocatedLocationId.block,
          floor: doc.allocatedLocationId.floor,
          room: doc.allocatedLocationId.room,
          commonArea: doc.allocatedLocationId.commonArea,
          type: doc.allocatedLocationId.type,
          hall:
            doc.allocatedLocationId.hallId &&
            typeof doc.allocatedLocationId.hallId === 'object'
              ? {
                  id: (doc.allocatedLocationId.hallId as { _id?: mongoose.Types.ObjectId })._id?.toString(),
                  name: (doc.allocatedLocationId.hallId as { name?: string }).name,
                  code: (doc.allocatedLocationId.hallId as { code?: string }).code,
                }
              : undefined,
        }
      : null,
  };
}
