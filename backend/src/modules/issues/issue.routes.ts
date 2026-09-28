import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { validateRequest } from '../../middleware/validate-request.js';
import { issueCreationLimiter, commentLimiter } from '../../middleware/rate-limit.js';
import * as controller from './issue.controller.js';
import {
  createIssueSchema,
  commentSchema,
  acknowledgeSchema,
  prioritySchema,
  assignmentSchema,
  statusSchema,
} from './issue.validation.js';

const router: Router = Router();

router.post('/', authenticate, issueCreationLimiter, validateRequest(createIssueSchema), controller.createIssue);
router.get('/', authenticate, controller.listIssues);
router.get('/:issueId', authenticate, controller.getIssue);
router.get('/:issueId/events', authenticate, controller.listEvents);
router.post('/:issueId/comments', authenticate, commentLimiter, validateRequest(commentSchema), controller.addComment);
router.patch('/:issueId/acknowledge', authenticate, validateRequest(acknowledgeSchema), controller.acknowledgeIssue);
router.patch('/:issueId/priority', authenticate, validateRequest(prioritySchema), controller.changePriority);
router.post('/:issueId/assignments', authenticate, validateRequest(assignmentSchema), controller.assignIssue);
router.patch('/:issueId/status', authenticate, validateRequest(statusSchema), controller.updateStatus);
router.post('/:issueId/reopen', authenticate, controller.reopenIssue);

export default router;
