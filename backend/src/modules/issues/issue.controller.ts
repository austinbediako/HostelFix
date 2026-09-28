import type { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utilities/async-handler.js';
import * as issueService from './issue.service.js';

export const createIssue = asyncHandler(async (req: Request, res: Response) => {
  const issue = await issueService.createIssue(req.user!, req.body, req.requestId);
  res.status(201).json({ success: true, data: issue });
});

export const listIssues = asyncHandler(async (req: Request, res: Response) => {
  const issues = await issueService.listIssues(req.user!, req.query);
  res.status(200).json({ success: true, data: issues });
});

export const getIssue = asyncHandler(async (req: Request, res: Response) => {
  const issue = await issueService.getIssue(req.user!, (req.params.issueId as string));
  res.status(200).json({ success: true, data: issue });
});

export const addComment = asyncHandler(async (req: Request, res: Response) => {
  const issue = await issueService.addComment(req.user!, (req.params.issueId as string), req.body.message, req.requestId);
  res.status(201).json({ success: true, data: issue });
});

export const acknowledgeIssue = asyncHandler(async (req: Request, res: Response) => {
  const issue = await issueService.acknowledgeIssue(
    req.user!,
    (req.params.issueId as string),
    req.body.action,
    req.body.message,
    req.requestId,
  );
  res.status(200).json({ success: true, data: issue });
});

export const changePriority = asyncHandler(async (req: Request, res: Response) => {
  const issue = await issueService.changePriority(
    req.user!,
    (req.params.issueId as string),
    req.body.priority,
    req.requestId,
  );
  res.status(200).json({ success: true, data: issue });
});

export const assignIssue = asyncHandler(async (req: Request, res: Response) => {
  const issue = await issueService.assignIssue(
    req.user!,
    (req.params.issueId as string),
    req.body.personnelIds,
    req.requestId,
  );
  res.status(200).json({ success: true, data: issue });
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const issue = await issueService.updateIssueStatus(
    req.user!,
    (req.params.issueId as string),
    req.body.status,
    req.requestId,
  );
  res.status(200).json({ success: true, data: issue });
});

export const reopenIssue = asyncHandler(async (req: Request, res: Response) => {
  const issue = await issueService.reopenIssue(req.user!, (req.params.issueId as string), req.requestId);
  res.status(200).json({ success: true, data: issue });
});

export const listEvents = asyncHandler(async (req: Request, res: Response) => {
  const events = await issueService.getIssueEvents(req.user!, (req.params.issueId as string));
  res.status(200).json({ success: true, data: events });
});
