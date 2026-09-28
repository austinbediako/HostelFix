import { z } from 'zod';
import { ISSUE_CATEGORIES, ISSUE_PRIORITIES, ISSUE_STATUSES } from '../../shared/constants/issue.js';

export const createIssueSchema = z.object({
  hallId: z.string().min(1, 'Hall is required'),
  room: z.string().min(1, 'Room number is required').max(20, 'Room number is too long'),
  category: z.enum(ISSUE_CATEGORIES),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  reportedPriority: z.enum(ISSUE_PRIORITIES),
  imageUrls: z.array(z.string().url()).max(5).optional().default([]),
}).strict();

export const commentSchema = z.object({
  message: z.string().min(1, 'Comment message is required'),
}).strict();

export const acknowledgeSchema = z.object({
  action: z.enum(['acknowledge', 'reject', 'clarify']),
  message: z.string().optional(),
}).strict();

export const prioritySchema = z.object({
  priority: z.enum(ISSUE_PRIORITIES),
  message: z.string().optional(),
}).strict();

export const assignmentSchema = z.object({
  personnelIds: z.array(z.string().min(1)).min(1, 'Assign at least one person'),
  message: z.string().optional(),
}).strict();

export const statusSchema = z.object({
  status: z.enum(ISSUE_STATUSES),
  message: z.string().optional(),
}).strict();
