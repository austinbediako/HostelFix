import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { requireMinimumRole, requireRole } from '../../middleware/authorize.js';
import { validateRequest } from '../../middleware/validate-request.js';
import { ROLES } from '../../shared/constants/roles.js';
import * as controller from './settings.controller.js';
import { updateSettingsSchema } from './settings.validation.js';

const router: Router = Router();

router.get('/', authenticate, requireMinimumRole(ROLES.UNIVERSITY_ADMIN), controller.getSettings);
router.patch('/', authenticate, requireRole(ROLES.SYSTEM_ADMIN), validateRequest(updateSettingsSchema), controller.updateSettings);

export default router;
