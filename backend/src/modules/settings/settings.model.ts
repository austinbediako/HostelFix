import mongoose from 'mongoose';
import type { IssuePriority } from '../../shared/constants/issue.js';

export interface ISystemSettings {
  key: string;
  disputeWindowHours: number;
  priorityTargetHours: Record<IssuePriority, number>;
  supportEmail: string;
  updatedAt: Date;
  createdAt: Date;
}

const settingsSchema = new mongoose.Schema<ISystemSettings>(
  {
    key: { type: String, required: true, unique: true, default: 'system' },
    disputeWindowHours: { type: Number, required: true, min: 1, max: 720 },
    priorityTargetHours: {
      emergency: { type: Number, required: true, min: 1, max: 720 },
      high: { type: Number, required: true, min: 1, max: 720 },
      normal: { type: Number, required: true, min: 1, max: 720 },
      low: { type: Number, required: true, min: 1, max: 720 },
    },
    supportEmail: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const SystemSettings = mongoose.model<ISystemSettings>('SystemSettings', settingsSchema);
