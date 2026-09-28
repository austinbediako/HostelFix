import mongoose from 'mongoose';
import { ISSUE_EVENT_TYPES, type IssueEventType } from '../../shared/constants/issue.js';

export interface IIssueEvent {
  _id: mongoose.Types.ObjectId;
  issueId: mongoose.Types.ObjectId;
  actorId?: mongoose.Types.ObjectId;
  eventType: IssueEventType;
  previousValue?: unknown;
  newValue?: unknown;
  message?: string;
  createdAt: Date;
}

const issueEventSchema = new mongoose.Schema<IIssueEvent>(
  {
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    eventType: { type: String, enum: ISSUE_EVENT_TYPES, required: true },
    previousValue: { type: mongoose.Schema.Types.Mixed },
    newValue: { type: mongoose.Schema.Types.Mixed },
    message: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

issueEventSchema.index({ issueId: 1, createdAt: -1 });
issueEventSchema.index({ actorId: 1, createdAt: -1 });

export const IssueEvent = mongoose.model<IIssueEvent>('IssueEvent', issueEventSchema);
