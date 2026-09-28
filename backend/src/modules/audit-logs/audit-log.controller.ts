import type { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utilities/async-handler.js';
import * as auditLogService from './audit-log.service.js';

export const listAuditLogs = asyncHandler(async (req: Request, res: Response) => {
  const result = await auditLogService.listAuditLogs({
    resourceType: req.query.resourceType as string | undefined,
    resourceId: req.query.resourceId as string | undefined,
    actorId: req.query.actorId as string | undefined,
    action: req.query.action as string | undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    offset: req.query.offset ? Number(req.query.offset) : undefined,
  });
  res.status(200).json({ success: true, data: result });
});
