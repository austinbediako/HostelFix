import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';
import {
  canViewIssue,
  canTransitionStatus,
  canCloseIssue,
} from '../../src/policies/issue.policy.js';
import type { IIssue } from '../../src/modules/issues/issue.model.js';

function makeUser(role: string, assignedHallIds: mongoose.Types.ObjectId[] = []) {
  return {
    _id: new mongoose.Types.ObjectId(),
    email: `${role}@test.com`,
    role,
    assignedHallIds,
    name: role,
  };
}

function makeIssue(status: IIssue['status'], overrides: Partial<IIssue> = {}): IIssue {
  const hallId = new mongoose.Types.ObjectId();
  return {
    _id: new mongoose.Types.ObjectId(),
    referenceNumber: 'HF-TEST-0001',
    reporterId: overrides.reporterId ?? new mongoose.Types.ObjectId(),
    hallId: overrides.hallId ?? hallId,
    locationId: new mongoose.Types.ObjectId(),
    category: 'plumbing',
    reportedPriority: 'normal',
    priority: 'normal',
    status,
    description: 'test',
    imageUrls: [],
    assignedToIds: overrides.assignedToIds ?? [],
    submittedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as IIssue;
}

describe('issue policies', () => {
  it('student can view own issue', () => {
    const student = makeUser('student');
    const issue = makeIssue('submitted', { reporterId: student._id });
    expect(canViewIssue(student, issue)).toBe(true);
  });

  it('student cannot view another students issue', () => {
    const student = makeUser('student');
    const issue = makeIssue('submitted');
    expect(canViewIssue(student, issue)).toBe(false);
  });

  it('hall manager can view issues in assigned hall', () => {
    const hallId = new mongoose.Types.ObjectId();
    const manager = makeUser('hall_manager', [hallId]);
    const issue = makeIssue('submitted', { hallId });
    expect(canViewIssue(manager, issue)).toBe(true);
  });

  it('hall manager cannot view issues in unassigned hall', () => {
    const manager = makeUser('hall_manager', [new mongoose.Types.ObjectId()]);
    const issue = makeIssue('submitted', { hallId: new mongoose.Types.ObjectId() });
    expect(canViewIssue(manager, issue)).toBe(false);
  });

  it('maintenance can view issue in assigned hall', () => {
    const hallId = new mongoose.Types.ObjectId();
    const maint = makeUser('maintenance', [hallId]);
    const issue = makeIssue('under_review', { hallId });
    expect(canViewIssue(maint, issue)).toBe(true);
  });

  it('allows triage, assign, progress, and resolve transitions', () => {
    const hallId = new mongoose.Types.ObjectId();
    const manager = makeUser('hall_manager', [hallId]);
    const maint = makeUser('maintenance', [hallId]);
    maint._id = new mongoose.Types.ObjectId();

    const submitted = makeIssue('submitted', { hallId });
    expect(canTransitionStatus(manager, submitted, 'under_review')).toBe(true);
    expect(canTransitionStatus(manager, submitted, 'assigned')).toBe(true);

    const underReview = makeIssue('under_review', { hallId });
    expect(canTransitionStatus(manager, underReview, 'assigned')).toBe(true);
    expect(canTransitionStatus(maint, underReview, 'in_progress')).toBe(true);
    expect(canTransitionStatus(maint, underReview, 'resolved')).toBe(false);
    expect(canTransitionStatus(manager, underReview, 'resolved')).toBe(false);

    const assigned = makeIssue('assigned', { hallId });
    expect(canTransitionStatus(maint, assigned, 'in_progress')).toBe(true);
    expect(canTransitionStatus(maint, assigned, 'resolved')).toBe(false);

    const inProgress = makeIssue('in_progress', { hallId });
    expect(canTransitionStatus(maint, inProgress, 'resolved')).toBe(true);
  });

  it('rejects invalid status transitions', () => {
    const hallId = new mongoose.Types.ObjectId();
    const manager = makeUser('hall_manager', [hallId]);
    const maint = makeUser('maintenance', [hallId]);
    const submitted = makeIssue('submitted', { hallId });
    expect(canTransitionStatus(manager, submitted, 'closed')).toBe(false);
    expect(canTransitionStatus(manager, submitted, 'resolved')).toBe(false);
    expect(canTransitionStatus(maint, submitted, 'resolved')).toBe(false);
  });

  it('student cannot close issue', () => {
    const student = makeUser('student');
    const issue = makeIssue('resolved', { reporterId: student._id });
    expect(canCloseIssue(student, issue)).toBe(false);
  });
});
