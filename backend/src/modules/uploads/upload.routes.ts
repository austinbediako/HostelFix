import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { uploadLimiter } from '../../middleware/rate-limit.js';
import * as controller from './upload.controller.js';

const router: Router = Router();

router.post('/signature', authenticate, uploadLimiter, controller.getSignature);

export default router;
