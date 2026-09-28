import cron from 'node-cron';
import { closeResolvedIssue } from '../modules/issues/issue.service.js';
import { Issue } from '../modules/issues/issue.model.js';
import { logger } from '../config/logger.js';

let task: cron.ScheduledTask | null = null;

export function startAutoCloseResolvedIssuesJob(): void {
  task = cron.schedule('0 * * * *', async () => {
    await autoCloseResolvedIssues();
  });
}

export function stopAutoCloseResolvedIssuesJob(): void {
  if (task) {
    task.stop();
  }
}

async function autoCloseResolvedIssues(): Promise<void> {
  const now = new Date();
  const issues = await Issue.find({
    status: 'resolved',
    disputeWindowExpiresAt: { $lte: now },
  })
    .select('_id')
    .lean();

  for (const issue of issues) {
    try {
      await closeResolvedIssue(issue._id.toString());
      logger.info({ issueId: issue._id }, 'Auto-closed resolved issue');
    } catch (err) {
      logger.error({ err, issueId: issue._id }, 'Failed to auto-close resolved issue');
    }
  }
}
