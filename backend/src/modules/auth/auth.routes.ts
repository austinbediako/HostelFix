import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { validateRequest } from '../../middleware/validate-request.js';
import { loginLimiter } from '../../middleware/rate-limit.js';
import * as controller from './auth.controller.js';
import { loginSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.validation.js';

const router: Router = Router();

router.post('/login', loginLimiter, validateRequest(loginSchema), controller.login);
router.post('/logout', controller.logout);
router.post('/refresh', controller.refresh);
router.post('/forgot-password', loginLimiter, validateRequest(forgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password', loginLimiter, validateRequest(resetPasswordSchema), controller.resetPassword);
router.get('/me', authenticate, controller.me);

export default router;
