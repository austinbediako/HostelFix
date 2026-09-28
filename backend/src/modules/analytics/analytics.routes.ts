import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { requireMinimumRole } from '../../middleware/authorize.js';
import { ROLES } from '../../shared/constants/roles.js';
import * as controller from './analytics.controller.js';

const router: Router = Router();

router.get('/overview', authenticate, requireMinimumRole(ROLES.UNIVERSITY_ADMIN), controller.getOverview);
router.get('/halls/:hallId', authenticate, requireMinimumRole(ROLES.HALL_MANAGER), controller.getHallAnalytics);

export default router;
