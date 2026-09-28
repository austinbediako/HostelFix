import { z } from 'zod';

export const updateHallSchema = z.object({
  name: z.string().min(2).optional(),
  active: z.boolean().optional(),
}).strict();

export type UpdateHallInput = z.infer<typeof updateHallSchema>;
