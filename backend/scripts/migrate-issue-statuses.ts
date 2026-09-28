import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { logger } from '../src/config/logger.js';
import { Issue } from '../src/modules/issues/issue.model.js';
import { IssueEvent } from '../src/modules/issues/issue-event.model.js';

const LEGACY_STATUSES = ['acknowledged', 'verified', 'needs_clarification'] as const;

const STATUS_MAP: Record<string, string> = {
  acknowledged: 'under_review',
  verified: 'under_review',
  needs_clarification: 'submitted',
};

async function main() {
  await connectDatabase();

  const issues = await Issue.find({ status: { $in: LEGACY_STATUSES } });
  logger.info(`Found ${issues.length} issues with legacy statuses`);

  for (const issue of issues) {
    const oldStatus = issue.status;
    const newStatus = STATUS_MAP[oldStatus];

    issue.status = newStatus;
    issue.updatedAt = new Date();
    await issue.save();

    await IssueEvent.create({
      issueId: issue._id,
      eventType: 'status_changed',
      previousValue: { status: oldStatus },
      newValue: { status: newStatus },
      message: 'Legacy status migrated to simplified workflow',
    });

    logger.info(`Migrated issue ${issue.referenceNumber}: ${oldStatus} -> ${newStatus}`);
  }

  logger.info('Migration completed');
  await disconnectDatabase();
}

main().catch((err) => {
  logger.error({ err }, 'Migration failed');
  process.exit(1);
});
