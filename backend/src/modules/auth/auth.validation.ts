import { z } from 'zod';

export const loginSchema = z.object({
  id: z.string().min(8, 'ID must be at least 8 characters'),
  pin: z.string().regex(/^\d{5}$/, 'PIN must be exactly 5 digits'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().regex(/^\d{5}$/, 'PIN must be exactly 5 digits'),
});
