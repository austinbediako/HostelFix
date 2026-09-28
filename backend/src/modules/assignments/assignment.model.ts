import mongoose from 'mongoose';

export interface IAssignment {
  _id: mongoose.Types.ObjectId;
  issueId: mongoose.Types.ObjectId;
  personnelIds: mongoose.Types.ObjectId[];
  assignedById: mongoose.Types.ObjectId;
  assignedAt: Date;
  unassignedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new mongoose.Schema<IAssignment>(
  {
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
    personnelIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    assignedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedAt: { type: Date, required: true, default: Date.now },
    unassignedAt: { type: Date },
  },
  { timestamps: true },
);

assignmentSchema.index({ issueId: 1, assignedAt: -1 });
assignmentSchema.index({ personnelIds: 1, unassignedAt: 1 });

export const Assignment = mongoose.model<IAssignment>('Assignment', assignmentSchema);
