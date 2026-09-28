import mongoose from 'mongoose';
import {
  ISSUE_STATUSES,
  ISSUE_CATEGORIES,
  ISSUE_PRIORITIES,
  type IssueStatus,
  type IssueCategory,
  type IssuePriority,
} from '../../shared/constants/issue.js';

export interface IIssue {
  _id: mongoose.Types.ObjectId;
  referenceNumber: string;
  reporterId: mongoose.Types.ObjectId;
  hallId: mongoose.Types.ObjectId;
  locationId: mongoose.Types.ObjectId;
  category: IssueCategory;
  reportedPriority: IssuePriority;
  priority: IssuePriority;
  status: IssueStatus;
  description: string;
  imageUrls: string[];
  assignedToIds: mongoose.Types.ObjectId[];
  submittedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  disputeWindowExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const issueSchema = new mongoose.Schema<IIssue>(
  {
    referenceNumber: { type: String, required: true, unique: true, index: true },
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hallId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall', required: true },
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    category: { type: String, enum: ISSUE_CATEGORIES, required: true },
    reportedPriority: { type: String, enum: ISSUE_PRIORITIES, required: true },
    priority: { type: String, enum: ISSUE_PRIORITIES, required: true },
    status: { type: String, enum: ISSUE_STATUSES, default: 'submitted', index: true },
    description: { type: String, required: true, trim: true },
    imageUrls: [{ type: String }],
    assignedToIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    submittedAt: { type: Date, required: true, default: Date.now },
    resolvedAt: { type: Date },
    closedAt: { type: Date },
    disputeWindowExpiresAt: { type: Date },
  },
  { timestamps: true },
);

issueSchema.index({ hallId: 1, status: 1, priority: 1, createdAt: -1 });
issueSchema.index({ reporterId: 1, createdAt: -1 });
issueSchema.index({ assignedToIds: 1, status: 1, updatedAt: -1 });
issueSchema.index({ category: 1, hallId: 1, createdAt: -1 });
issueSchema.index({ status: 1, priority: 1, submittedAt: 1 });

export const Issue = mongoose.model<IIssue>('Issue', issueSchema);
