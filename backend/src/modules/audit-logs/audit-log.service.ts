import { AuditLog } from './audit-log.model.js';
import type mongoose from 'mongoose';

export async function createAuditLog(
  action: string,
  actorId: mongoose.Types.ObjectId | string | undefined,
  resourceType: string,
  resourceId: mongoose.Types.ObjectId | string | undefined,
  metadata: Record<string, unknown> = {},
  requestId?: string,
) {
  return AuditLog.create({
    actorId,
    action,
    resourceType,
    resourceId,
    metadata,
    requestId,
  });
}

export async function listAuditLogs(filters: {
  resourceType?: string;
  resourceId?: string;
  actorId?: string;
  action?: string;
  limit?: number;
  offset?: number;
}) {
  const query: Record<string, unknown> = {};
  if (filters.resourceType) query.resourceType = filters.resourceType;
  if (filters.resourceId) query.resourceId = filters.resourceId;
  if (filters.actorId) query.actorId = filters.actorId;
  if (filters.action) query.action = filters.action;

  const limit = filters.limit ?? 50;
  const offset = filters.offset ?? 0;

  const [items, total] = await Promise.all([
    AuditLog.find(query)
      .populate('actorId', 'name email role')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean(),
    AuditLog.countDocuments(query),
  ]);

  return { items, total, limit, offset };
}
