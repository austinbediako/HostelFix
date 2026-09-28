import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { validateRequest } from '../../middleware/validate-request.js';
import { requireMinimumRole } from '../../middleware/authorize.js';
import * as controller from './user.controller.js';
import { updateRoleSchema } from './user.validation.js';
import { ROLES } from '../../shared/constants/roles.js';

const router: Router = Router();

router.get('/', authenticate, requireMinimumRole(ROLES.UNIVERSITY_ADMIN), controller.listUsers);
router.get('/:userId', authenticate, controller.getUser);
router.patch('/:userId/roles', authenticate, requireMinimumRole(ROLES.SYSTEM_ADMIN), validateRequest(updateRoleSchema), controller.updateRole);

export default router;
