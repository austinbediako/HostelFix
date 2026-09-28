import type mongoose from 'mongoose';
import { SystemSettings, type ISystemSettings } from './settings.model.js';
import { PRIORITY_TARGET_HOURS, type IssuePriority } from '../../shared/constants/issue.js';
import { env } from '../../config/environment.js';
import * as auditLogService from '../audit-logs/audit-log.service.js';

export interface SystemSettingsView {
  disputeWindowHours: number;
  priorityTargetHours: Record<IssuePriority, number>;
  supportEmail: string;
}

const DEFAULTS: SystemSettingsView = {
  disputeWindowHours: env.resolveDisputeWindowHours,
  priorityTargetHours: { ...PRIORITY_TARGET_HOURS },
  supportEmail: env.systemAdminEmail,
};

let cache: SystemSettingsView | null = null;

function toView(doc: Pick<ISystemSettings, 'disputeWindowHours' | 'priorityTargetHours' | 'supportEmail'>): SystemSettingsView {
  return {
    disputeWindowHours: doc.disputeWindowHours,
    priorityTargetHours: { ...doc.priorityTargetHours },
    supportEmail: doc.supportEmail,
  };
}

/** Sync read for code paths that cannot await — returns cached values or env defaults. */
export function getCachedSettings(): SystemSettingsView {
  return cache ?? DEFAULTS;
}

export async function getSettings(): Promise<SystemSettingsView> {
  const doc = await SystemSettings.findOne({ key: 'system' }).lean();
  if (!doc) {
    const created = await SystemSettings.findOneAndUpdate(
      { key: 'system' },
      { $setOnInsert: DEFAULTS },
      { upsert: true, returnDocument: 'after', lean: true },
    );
    cache = toView(created!);
    return cache;
  }
  cache = toView(doc);
  return cache;
}

export async function updateSettings(
  actorId: mongoose.Types.ObjectId,
  input: SystemSettingsView,
  requestId?: string,
): Promise<SystemSettingsView> {
  const previous = await getSettings();
  const doc = await SystemSettings.findOneAndUpdate(
    { key: 'system' },
    { $set: input },
    { upsert: true, returnDocument: 'after', lean: true },
  );
  cache = toView(doc!);

  await auditLogService.createAuditLog(
    'settings.update',
    actorId,
    'SystemSettings',
    'system',
    { previous, updated: cache },
    requestId,
  );

  return cache;
}
