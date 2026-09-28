import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/environment.js';
import { logger } from './config/logger.js';
import { jobQueue } from './jobs/queue.js';
import { sendNotificationJob } from './jobs/send-notification.job.js';
import { startOverdueEscalationJob, stopOverdueEscalationJob } from './jobs/escalate-overdue-issues.job.js';
import {
  startAutoCloseResolvedIssuesJob,
  stopAutoCloseResolvedIssuesJob,
} from './jobs/auto-close-resolved-issues.job.js';

const app = createApp();
const server = app.listen(env.port, async () => {
  await connectDatabase();
  logger.info(`HostelFix API listening on port ${env.port}`);

  jobQueue.registerWorker('notification', sendNotificationJob);
  jobQueue.start();
  startOverdueEscalationJob();
  startAutoCloseResolvedIssuesJob();
});

async function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    await stopOverdueEscalationJob();
    await stopAutoCloseResolvedIssuesJob();
    await jobQueue.stop();
    await disconnectDatabase();
    process.exit(0);
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled promise rejection');
});
