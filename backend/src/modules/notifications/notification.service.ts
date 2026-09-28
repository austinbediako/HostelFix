import { Notification } from './notification.model.js';
import { env } from '../../config/environment.js';
import { logger } from '../../config/logger.js';
import type mongoose from 'mongoose';

export interface NotificationPayload {
  userId: string;
  issueId?: string;
  template: string;
  channel?: 'in_app' | 'email';
  data?: Record<string, unknown>;
}

export async function createNotification(payload: NotificationPayload) {
  return Notification.create({
    userId: payload.userId,
    issueId: payload.issueId,
    template: payload.template,
    channel: payload.channel ?? 'in_app',
    deliveryStatus: 'pending',
    attempts: 0,
    data: payload.data ?? {},
  });
}

export async function sendNotificationJob(payload: NotificationPayload): Promise<void> {
  const inApp = await createNotification({ ...payload, channel: 'in_app' });
  inApp.deliveryStatus = 'sent';
  inApp.sentAt = new Date();
  await inApp.save();

  const email = await createNotification({ ...payload, channel: 'email' });
  try {
    await sendEmail(payload);
    email.deliveryStatus = 'sent';
    email.sentAt = new Date();
  } catch (err) {
    logger.error({ err, emailId: email._id }, 'Failed to send email notification');
    email.deliveryStatus = 'failed';
  } finally {
    email.attempts += 1;
    await email.save();
  }
}

async function sendEmail(payload: NotificationPayload): Promise<void> {
  if (env.emailProvider === 'stub') {
    logger.info({ payload }, 'Stub email notification');
    return;
  }
  if (env.emailProvider === 'sendgrid') {
    // Placeholder for SendGrid integration
    logger.info({ payload }, 'SendGrid email notification (not configured)');
    return;
  }
  if (env.emailProvider === 'smtp') {
    // Placeholder for SMTP integration
    logger.info({ payload }, 'SMTP email notification (not configured)');
    return;
  }
  throw new Error(`Unknown email provider: ${env.emailProvider}`);
}

export async function listNotifications(
  userId: string,
  options: { limit?: number; offset?: number; unreadOnly?: boolean } = {},
) {
  const query: Record<string, unknown> = { userId };
  if (options.unreadOnly) {
    query.deliveryStatus = { $in: ['pending', 'sent'] };
  }
  const limit = options.limit ?? 20;
  const offset = options.offset ?? 0;
  const [items, total] = await Promise.all([
    Notification.find(query).sort({ createdAt: -1 }).skip(offset).limit(limit).lean(),
    Notification.countDocuments(query),
  ]);
  return { items, total, limit, offset };
}

export async function markNotificationRead(
  userId: string,
  notificationId: string,
): Promise<void> {
  await Notification.updateOne(
    { _id: notificationId as unknown as mongoose.Types.ObjectId, userId },
    { $set: { deliveryStatus: 'sent', sentAt: new Date() } },
  );
}
