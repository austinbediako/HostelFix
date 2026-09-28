import type { Express } from 'express';
import mongoose from 'mongoose';
import { Issue, type IIssue } from './issue.model.js';
import { IssueEvent } from './issue-event.model.js';
import { Hall } from '../residences/hall.model.js';
import { resolveRoomLocation } from '../residences/room-parser.js';
import { ReferenceCounter } from './reference-counter.model.js';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCodes } from '../../shared/errors/error-codes.js';
import * as issuePolicy from '../../policies/issue.policy.js';
import { ROLES } from '../../shared/constants/roles.js';
import { isCloudinaryImageUrl, moveImagesToFolder } from '../../config/cloudinary.js';
import { env } from '../../config/environment.js';
import { type IssuePriority, type IssueEventType } from '../../shared/constants/issue.js';
import * as assignmentService from '../assignments/assignment.service.js';
import * as settingsService from '../settings/settings.service.js';
import * as auditLogService from '../audit-logs/audit-log.service.js';
import * as notificationService from '../notifications/notification.service.js';
import { jobQueue } from '../../jobs/queue.js';
import { logger } from '../../config/logger.js';

interface CreateIssueInput {
  hallId: string;
  room: string;
  category: string;
  description: string;
  reportedPriority: IssuePriority;
  imageUrls: string[];
}

import type { IssueCategory } from '../../shared/constants/issue.js';

export async function createIssue(user: Express.User, input: CreateIssueInput, requestId?: string) {
  const hall = await Hall.findById(input.hallId).lean();
  if (!hall) {
    throw new AppError(400, ErrorCodes.BAD_REQUEST, 'Invalid hall');
  }

  const location = await resolveRoomLocation(input.hallId, input.room);

  for (const url of input.imageUrls) {
    if (!isCloudinaryImageUrl(url)) {
      throw new AppError(400, ErrorCodes.INVALID_IMAGE_URL, `Invalid image URL: ${url}`);
    }
  }

  const referenceNumber = await allocateReferenceNumber(hall.code);

  // Move uploaded images from unsorted/ into the issue-specific folder
  const userId = user.studentId ?? user.staffId ?? user._id.toString();
  const targetFolder = `${env.cloudinaryFolder}/${userId}/${referenceNumber}`;
  let finalImageUrls = input.imageUrls;
  if (input.imageUrls.length > 0) {
    try {
      finalImageUrls = await moveImagesToFolder(input.imageUrls, targetFolder);
    } catch (err) {
      // Log but don't block issue creation – images stay in unsorted/
      logger.warn({ err, imageUrls: input.imageUrls, targetFolder }, 'Failed to move images to issue folder');
    }
  }

  const issue = await Issue.create({
    referenceNumber,
    reporterId: user._id,
    hallId: hall._id,
    locationId: location._id,
    category: input.category as IssueCategory,
    reportedPriority: input.reportedPriority,
    priority: input.reportedPriority,
    status: 'submitted',
    description: input.description,
    imageUrls: finalImageUrls,
    assignedToIds: [],
    submittedAt: new Date(),
  });

  await IssueEvent.create({
    issueId: issue._id,
    actorId: user._id,
    eventType: 'created',
    newValue: { status: 'submitted', priority: input.reportedPriority },
  });

  await auditLogService.createAuditLog(
    'issue.create',
    user._id,
    'Issue',
    issue._id,
    { referenceNumber, hallId: hall._id, locationId: location._id },
    requestId,
  );

  enqueueIssueNotification(issue, 'issue_created', { actorName: user.name });

  return serializeIssue(issue);
}

async function allocateReferenceNumber(hallCode: string): Promise<string> {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const counter = await ReferenceCounter.findOneAndUpdate(
    { hallCode, date },
    { $inc: { sequence: 1 } },
    { upsert: true, returnDocument: 'after' },
  );
  const sequence = String(counter.sequence).padStart(4, '0');
  return `HF-${hallCode}-${date}-${sequence}`;
}

export async function listIssues(user: Express.User, filters: Record<string, unknown> = {}) {
  const baseQuery = buildListQuery(user);
  const query = { ...baseQuery, ...filters };
  await settingsService.getSettings();
  const issues = await Issue.find(query)
    .sort({ createdAt: -1 })
    .populate('reporterId', 'name email')
    .populate('hallId', 'name code')
    .populate('locationId', 'block floor room commonArea type')
    .populate('assignedToIds', 'name email')
    .lean();
  return issues.map((issue) => serializeIssueRaw(issue as unknown as Record<string, unknown>));
}

function buildListQuery(user: Express.User): Record<string, unknown> {
  if (user.role === ROLES.UNIVERSITY_ADMIN || user.role === ROLES.SYSTEM_ADMIN) return {};
  if (user.role === ROLES.STUDENT) return { reporterId: user._id };
  if (user.role === ROLES.HALL_MANAGER || user.role === ROLES.MAINTENANCE) {
    return { hallId: { $in: user.assignedHallIds } };
  }
  return {};
}

export async function getIssue(user: Express.User, issueId: string) {
  const issue = await Issue.findById(issueId)
    .populate('reporterId', 'name email')
    .populate('hallId', 'name code')
    .populate('locationId', 'block floor room commonArea type')
    .populate('assignedToIds', 'name email')
    .lean();
  if (!issue) throw new AppError(404, ErrorCodes.NOT_FOUND, 'Issue not found');
  if (!issuePolicy.canViewIssue(user, issue as unknown as IIssue)) {
    throw new AppError(403, ErrorCodes.FORBIDDEN, 'You do not have permission to view this issue');
  }
  return serializeIssueRaw(issue as unknown as Record<string, unknown>);
}

export async function addComment(
  user: Express.User,
  issueId: string,
  message: string,
  requestId?: string,
) {
  const issue = await findIssueOrThrow(issueId);
  if (!issuePolicy.canCommentOnIssue(user, issue)) {
    throw new AppError(403, ErrorCodes.FORBIDDEN, 'You cannot comment on this issue');
  }

  await IssueEvent.create({
    issueId: issue._id,
    actorId: user._id,
    eventType: 'commented',
    message,
  });

  await auditLogService.createAuditLog(
    'issue.comment',
    user._id,
    'Issue',
    issue._id,
    { message },
    requestId,
  );

  enqueueIssueNotification(issue, 'commented', { actorName: user.name, message });
  return serializeIssue(issue);
}

export async function acknowledgeIssue(
  user: Express.User,
  issueId: string,
  action: 'acknowledge' | 'reject' | 'clarify',
  message?: string,
  requestId?: string,
) {
  const issue = await findIssueOrThrow(issueId);
  if (!issuePolicy.canTriageIssue(user, issue)) {
    throw new AppError(403, ErrorCodes.FORBIDDEN, 'You cannot triage this issue');
  }

  const transitions: Record<typeof action, { status: IIssue['status']; eventType: IssueEventType }> = {
    acknowledge: { status: 'under_review', eventType: 'under_review' },
    reject: { status: 'rejected', eventType: 'rejected' },
    clarify: { status: 'submitted', eventType: 'clarification_requested' },
  };

  const { status, eventType } = transitions[action];

  const updated = await Issue.findByIdAndUpdate(
    issueId,
    { $set: { status } },
    { returnDocument: 'after' },
  );

  await IssueEvent.create({
    issueId: issue._id,
    actorId: user._id,
    eventType,
    previousValue: { status: issue.status },
    newValue: { status },
    message,
  });

  await auditLogService.createAuditLog(
    `issue.${eventType}`,
    user._id,
    'Issue',
    issue._id,
    { previousStatus: issue.status, status, message },
    requestId,
  );

  enqueueIssueNotification(issue, eventType, { actorName: user.name, message });
  return serializeIssue(updated!);
}

export async function assignIssue(
  user: Express.User,
  issueId: string,
  personnelIds: string[],
  requestId?: string,
) {
  const issue = await findIssueOrThrow(issueId);
  if (!issuePolicy.canTriageIssue(user, issue)) {
    throw new AppError(403, ErrorCodes.FORBIDDEN, 'You cannot assign personnel to this issue');
  }

  await assignmentService.assignPersonnel(issue._id, personnelIds, user._id);

  const assignableStatuses: IIssue['status'][] = ['submitted', 'under_review', 'reopened'];
  const nextStatus = assignableStatuses.includes(issue.status) ? 'assigned' : issue.status;

  const updated = await Issue.findByIdAndUpdate(
    issueId,
    { $set: { assignedToIds: personnelIds, status: nextStatus } },
    { returnDocument: 'after' },
  );

  await IssueEvent.create({
    issueId: issue._id,
    actorId: user._id,
    eventType: 'assigned',
    previousValue: { assignedToIds: issue.assignedToIds.map((id) => id.toString()), status: issue.status },
    newValue: { assignedToIds: personnelIds, status: nextStatus },
  });

  await auditLogService.createAuditLog(
    'issue.assign',
    user._id,
    'Issue',
    issue._id,
    { assignedToIds: personnelIds },
    requestId,
  );

  enqueueIssueNotification(issue, 'assigned', { actorName: user.name, assignedToIds: personnelIds });
  return serializeIssue(updated!);
}

export async function changePriority(
  user: Express.User,
  issueId: string,
  priority: IssuePriority,
  requestId?: string,
) {
  const issue = await findIssueOrThrow(issueId);
  if (!issuePolicy.canChangeIssuePriority(user, issue)) {
    throw new AppError(403, ErrorCodes.FORBIDDEN, 'You cannot change this issue priority');
  }

  const updated = await Issue.findByIdAndUpdate(
    issueId,
    { $set: { priority } },
    { returnDocument: 'after' },
  );

  await IssueEvent.create({
    issueId: issue._id,
    actorId: user._id,
    eventType: 'priority_changed',
    previousValue: { priority: issue.priority },
    newValue: { priority },
  });

  await auditLogService.createAuditLog(
    'issue.priority.update',
    user._id,
    'Issue',
    issue._id,
    { previousPriority: issue.priority, priority },
    requestId,
  );

  enqueueIssueNotification(issue, 'priority_changed', { actorName: user.name, priority });
  return serializeIssue(updated!);
}

export async function updateIssueStatus(
  user: Express.User,
  issueId: string,
  status: IIssue['status'],
  requestId?: string,
) {
  const issue = await findIssueOrThrow(issueId);
  if (!issuePolicy.canTransitionStatus(user, issue, status)) {
    throw new AppError(
      400,
      ErrorCodes.INVALID_STATUS_TRANSITION,
      `Cannot transition issue from ${issue.status} to ${status}`,
    );
  }

  const now = new Date();
  const update: Record<string, unknown> = { status };

  if (status === 'resolved') {
    update.resolvedAt = now;
    const settings = await settingsService.getSettings();
    update.disputeWindowExpiresAt = new Date(
      now.getTime() + settings.disputeWindowHours * 60 * 60 * 1000,
    );
  }

  if (status === 'closed' && !issue.closedAt) {
    update.closedAt = now;
  }

  // When reopening, clear dispute window and resolved timestamp so it can be re-resolved
  if (status === 'reopened') {
    update.resolvedAt = null;
    update.disputeWindowExpiresAt = null;
  }

  const updated = await Issue.findByIdAndUpdate(issueId, { $set: update }, { returnDocument: 'after' });

  const statusEventTypes: Partial<Record<IIssue['status'], IssueEventType>> = {
    under_review: 'under_review',
    assigned: 'assigned',
    in_progress: 'in_progress',
    resolved: 'resolved',
    reopened: 'reopened',
    closed: 'closed',
    rejected: 'rejected',
  };
  const eventType = statusEventTypes[status] ?? 'status_changed';

  await IssueEvent.create({
    issueId: issue._id,
    actorId: user._id,
    eventType,
    previousValue: { status: issue.status },
    newValue: { status },
  });

  await auditLogService.createAuditLog(
    'issue.status.update',
    user._id,
    'Issue',
    issue._id,
    { previousStatus: issue.status, status },
    requestId,
  );

  enqueueIssueNotification(issue, eventType, { actorName: user.name, status });
  return serializeIssue(updated!);
}

export async function reopenIssue(user: Express.User, issueId: string, requestId?: string) {
  return updateIssueStatus(user, issueId, 'reopened', requestId);
}

export async function closeResolvedIssue(issueId: string, requestId?: string): Promise<void> {
  const issue = await Issue.findById(issueId);
  if (!issue || issue.status !== 'resolved') return;

  const now = new Date();
  if (issue.disputeWindowExpiresAt && issue.disputeWindowExpiresAt > now) return;
  await Issue.findByIdAndUpdate(issueId, {
    $set: { status: 'closed', closedAt: now },
  });

  await IssueEvent.create({
    issueId: issue._id,
    actorId: null as unknown as mongoose.Types.ObjectId,
    eventType: 'closed',
    previousValue: { status: 'resolved' },
    newValue: { status: 'closed' },
    message: `Auto-closed after ${settingsService.getCachedSettings().disputeWindowHours}h dispute window`,
  });

  await auditLogService.createAuditLog(
    'issue.status.auto_close',
    null as unknown as mongoose.Types.ObjectId,
    'Issue',
    issue._id,
    { previousStatus: 'resolved', status: 'closed' },
    requestId,
  );

  enqueueIssueNotification(issue, 'auto_closed', {
    referenceNumber: issue.referenceNumber,
    message: `Auto-closed after ${settingsService.getCachedSettings().disputeWindowHours}h dispute window`,
  });
}

export async function getIssueEvents(user: Express.User, issueId: string) {
  const issue = await findIssueOrThrow(issueId);
  if (!issuePolicy.canViewIssue(user, issue)) {
    throw new AppError(403, ErrorCodes.FORBIDDEN, 'You cannot view this issue history');
  }
  return IssueEvent.find({ issueId: issue._id })
    .sort({ createdAt: -1 })
    .populate('actorId', 'name email role')
    .lean();
}

async function findIssueOrThrow(issueId: string): Promise<IIssue> {
  const issue = await Issue.findById(issueId).lean();
  if (!issue) throw new AppError(404, ErrorCodes.NOT_FOUND, 'Issue not found');
  return issue as unknown as IIssue;
}

function enqueueIssueNotification(
  issue: IIssue,
  template: string,
  data: Record<string, unknown>,
) {
  try {
    const userIds = new Set<string>();
    userIds.add(issue.reporterId.toString());
    issue.assignedToIds.forEach((id) => userIds.add(id.toString()));

    for (const userId of userIds) {
      jobQueue.enqueue('notification', {
        userId,
        issueId: issue._id.toString(),
        template,
        data,
      } as notificationService.NotificationPayload);
    }
  } catch (err) {
    logger.error({ err, issueId: issue._id }, 'Failed to enqueue notification');
  }
}

function serializeIssue(issue: IIssue | { toObject(): IIssue } | null) {
  if (!issue) return null;
  const raw = 'toObject' in issue ? issue.toObject() : issue;
  return serializeIssueRaw(raw as unknown as Record<string, unknown>);
}

function serializeIssueRaw(raw: Record<string, unknown>) {
  const assignedTo = ((raw.assignedToIds as unknown[] | undefined) ?? []).map((u: unknown) => ({
    id: (u as { _id?: { toString(): string } })._id?.toString(),
    name: (u as { name?: string }).name,
    email: (u as { email?: string }).email,
  }));

  const reporter = raw.reporterId
    ? {
        id: (raw.reporterId as { _id?: { toString(): string }; name?: string; email?: string })._id?.toString(),
        name: (raw.reporterId as { name?: string }).name,
        email: (raw.reporterId as { email?: string }).email,
      }
    : null;

  const hall = raw.hallId
    ? {
        id: (raw.hallId as { _id?: { toString(): string }; name?: string; code?: string })._id?.toString(),
        name: (raw.hallId as { name?: string }).name,
        code: (raw.hallId as { code?: string }).code,
      }
    : null;

  const location = raw.locationId
    ? {
        id: (raw.locationId as { _id?: { toString(): string } })._id?.toString(),
        block: (raw.locationId as { block?: string }).block,
        floor: (raw.locationId as { floor?: string }).floor,
        room: (raw.locationId as { room?: string }).room,
        commonArea: (raw.locationId as { commonArea?: string }).commonArea,
        type: (raw.locationId as { type?: string }).type,
      }
    : null;

  const submittedAt = raw.submittedAt as Date | undefined;
  const priority = (raw.priority as string) ?? 'normal';
  const targetResponseAt = submittedAt
    ? new Date(
        submittedAt.getTime() +
          settingsService.getCachedSettings().priorityTargetHours[priority as IssuePriority] *
            60 * 60 * 1000,
      )
    : null;

  return {
    id: (raw._id as { toString(): string }).toString(),
    referenceNumber: raw.referenceNumber,
    status: raw.status,
    category: raw.category,
    reportedPriority: raw.reportedPriority,
    priority: raw.priority,
    description: raw.description,
    imageUrls: raw.imageUrls,
    reporter,
    hall,
    location,
    assignedTo,
    resolvedAt: raw.resolvedAt,
    closedAt: raw.closedAt,
    disputeWindowExpiresAt: raw.disputeWindowExpiresAt,
    submittedAt,
    targetResponseAt,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}
