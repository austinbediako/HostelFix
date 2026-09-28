import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { requireMinimumRole } from '../../middleware/authorize.js';
import { ROLES } from '../../shared/constants/roles.js';
import * as controller from './audit-log.controller.js';

const router: Router = Router();

router.get('/', authenticate, requireMinimumRole(ROLES.UNIVERSITY_ADMIN), controller.listAuditLogs);

export default router;
