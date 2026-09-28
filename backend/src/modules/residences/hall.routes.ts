import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { requireMinimumRole } from '../../middleware/authorize.js';
import { validateRequest } from '../../middleware/validate-request.js';
import { updateHallSchema } from './hall.types.js';
import * as controller from './hall.controller.js';
import { ROLES } from '../../shared/constants/roles.js';

const router: Router = Router();

router.get('/', authenticate, controller.listHalls);
router.get('/:hallId', authenticate, controller.getHall);
router.get('/:hallId/locations', authenticate, controller.listLocations);
router.get('/:hallId/dashboard', authenticate, requireMinimumRole(ROLES.HALL_MANAGER), controller.getDashboard);
router.patch('/:hallId', authenticate, requireMinimumRole(ROLES.UNIVERSITY_ADMIN), validateRequest(updateHallSchema), controller.updateHall);

export default router;
