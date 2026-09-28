import { Assignment } from './assignment.model.js';
import { Issue } from '../issues/issue.model.js';
import { User } from '../users/user.model.js';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCodes } from '../../shared/errors/error-codes.js';
import type mongoose from 'mongoose';

export async function assignPersonnel(
  issueId: mongoose.Types.ObjectId | string,
  personnelIds: mongoose.Types.ObjectId[] | string[],
  assignedById: mongoose.Types.ObjectId | string,
): Promise<void> {
  const uniquePersonnelIds = [...new Set(personnelIds.map((id) => id.toString()))];
  const personnel = await User.find({
    _id: { $in: uniquePersonnelIds },
    role: 'maintenance',
    active: true,
  }).lean();

  if (personnel.length !== uniquePersonnelIds.length) {
    throw new AppError(
      400,
      ErrorCodes.BAD_REQUEST,
      'One or more invalid or inactive maintenance personnel IDs',
    );
  }

  await Assignment.create({
    issueId,
    personnelIds: uniquePersonnelIds,
    assignedById,
    assignedAt: new Date(),
  });

  await Issue.findByIdAndUpdate(issueId, {
    $set: { assignedToIds: uniquePersonnelIds },
  });
}

export async function getAssignmentsForIssue(issueId: string) {
  return Assignment.find({ issueId })
    .sort({ assignedAt: -1 })
    .populate('personnelIds', 'name email')
    .populate('assignedById', 'name email role')
    .lean();
}
