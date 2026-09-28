import { z } from 'zod';
import { ROLES } from '../../shared/constants/roles.js';

export const updateRoleSchema = z.object({
  role: z.enum([ROLES.STUDENT, ROLES.HALL_MANAGER, ROLES.MAINTENANCE, ROLES.UNIVERSITY_ADMIN, ROLES.SYSTEM_ADMIN]),
}).strict();
