import mongoose from 'mongoose';

export interface INotification {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  issueId?: mongoose.Types.ObjectId;
  channel: 'in_app' | 'email';
  template: string;
  deliveryStatus: 'pending' | 'sent' | 'failed';
  attempts: number;
  data: Record<string, unknown>;
  sentAt?: Date;
  createdAt: Date;
}

const notificationSchema = new mongoose.Schema<INotification>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },
    channel: { type: String, enum: ['in_app', 'email'], required: true },
    template: { type: String, required: true },
    deliveryStatus: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    attempts: { type: Number, default: 0 },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    sentAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

notificationSchema.index({ userId: 1, deliveryStatus: 1, createdAt: -1 });
notificationSchema.index({ issueId: 1, channel: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
