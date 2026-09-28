import { sendNotificationJob as sendNotification } from '../modules/notifications/notification.service.js';
import type { NotificationPayload } from '../modules/notifications/notification.service.js';

export async function sendNotificationJob(payload: unknown): Promise<void> {
  const notificationPayload = payload as NotificationPayload;
  await sendNotification(notificationPayload);
}
