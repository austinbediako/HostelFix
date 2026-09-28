import cron from 'node-cron';
import mongoose from 'mongoose';
import { Issue } from '../modules/issues/issue.model.js';
import { IssueEvent } from '../modules/issues/issue-event.model.js';
import { User } from '../modules/users/user.model.js';
import {
  type IssuePriority,
  type IssueStatus,
} from '../shared/constants/issue.js';
import { getSettings } from '../modules/settings/settings.service.js';
import { jobQueue } from './queue.js';
import { logger } from '../config/logger.js';

let task: cron.ScheduledTask | null = null;

export function startOverdueEscalationJob(): void {
  task = cron.schedule('0 * * * *', async () => {
    await escalateOverdueIssues();
  });
}

export function stopOverdueEscalationJob(): void {
  if (task) {
    task.stop();
  }
}

async function escalateOverdueIssues(): Promise<void> {
  const unresolvedStatuses: IssueStatus[] = [
    'submitted',
    'under_review',
    'assigned',
    'in_progress',
    'reopened',
  ];
  const issues = await Issue.find({ status: { $in: unresolvedStatuses } })
    .populate('hallId', 'name code')
    .lean();

  const settings = await getSettings();
  const now = new Date();
  for (const issue of issues) {
    const target = new Date(
      issue.submittedAt.getTime() +
        settings.priorityTargetHours[issue.priority as IssuePriority] * 60 * 60 * 1000,
    );
    if (now <= target) continue;

    await IssueEvent.create({
      issueId: issue._id,
      actorId: null as unknown as mongoose.Types.ObjectId,
      eventType: 'escalated',
      message: `Issue overdue for priority ${issue.priority}`,
    });

    // Notify hall managers assigned to this hall
    const hallId = (issue.hallId as unknown as { _id: mongoose.Types.ObjectId })._id;
    const managers = await User.find({ role: 'hall_manager', assignedHallIds: hallId }).lean();
    for (const manager of managers) {
      jobQueue.enqueue('notification', {
        userId: manager._id.toString(),
        issueId: issue._id.toString(),
        template: 'overdue',
        data: { referenceNumber: issue.referenceNumber, priority: issue.priority },
      });
    }

    logger.info({ issueId: issue._id }, 'Escalated overdue issue');
  }
}
