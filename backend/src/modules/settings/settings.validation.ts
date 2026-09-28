import { z } from 'zod';

const hours = z.number().int().min(1).max(720);

export const updateSettingsSchema = z.object({
  disputeWindowHours: hours,
  priorityTargetHours: z.object({
    emergency: hours,
    high: hours,
    normal: hours,
    low: hours,
  }).strict(),
  supportEmail: z.string().email(),
}).strict();
