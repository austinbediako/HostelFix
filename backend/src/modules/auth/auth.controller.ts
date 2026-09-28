import type { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utilities/async-handler.js';
import * as authService from './auth.service.js';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { id, pin } = req.body;
  const user = await authService.login(id, pin, res);
  res.status(200).json({ success: true, data: user });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refresh_token as string | undefined;
  await authService.logout(refreshToken, res);
  res.status(200).json({ success: true, data: { message: 'Logged out successfully' } });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refresh_token as string | undefined;
  const user = await authService.refresh(refreshToken, res);
  res.status(200).json({ success: true, data: user });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);
  res.status(200).json({ success: true, data: result });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  const result = await authService.resetPassword(token, password);
  res.status(200).json({ success: true, data: result });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!._id.toString());
  res.status(200).json({ success: true, data: user });
});
