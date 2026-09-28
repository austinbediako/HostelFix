import mongoose from 'mongoose';
import { Issue } from '../issues/issue.model.js';
import { Hall } from '../residences/hall.model.js';
import { type IssuePriority } from '../../shared/constants/issue.js';
import { getSettings } from '../settings/settings.service.js';

interface StatusCount {
  _id: string;
  count: number;
}

export async function getHallMetrics(hallId: string) {
  const hallObjectId = new mongoose.Types.ObjectId(hallId);
  const [statusCounts, priorityCounts, categoryCounts, overdueCount, avgResolutionTime, totalOpen, recent] = await Promise.all([
    Issue.aggregate<{ _id: string; count: number }>([
      { $match: { hallId: hallObjectId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Issue.aggregate<{ _id: string; count: number }>([
      { $match: { hallId: hallObjectId } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),
    Issue.aggregate<{ _id: string; count: number }>([
      { $match: { hallId: hallObjectId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    countOverdue(hallObjectId),
    averageResolutionTime(hallObjectId),
    Issue.countDocuments({ hallId: hallObjectId, status: { $nin: ['rejected', 'resolved', 'closed'] } }),
    Issue.find({ hallId: hallObjectId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('referenceNumber status priority category createdAt')
      .lean(),
  ]);

  return {
    hallId,
    totalIssues: statusCounts.reduce((sum, s) => sum + s.count, 0),
    openIssues: totalOpen,
    statusCounts: countsToObject(statusCounts),
    priorityCounts: countsToObject(priorityCounts),
    recurringCategories: categoryCounts,
    overdueIssues: overdueCount,
    averageResolutionHours: avgResolutionTime,
    recentIssues: recent,
  };
}

export async function getOverview() {
  const [statusCounts, priorityCounts, hallCounts, categoryCounts, overdueCount, avgResolutionTime, recent] = await Promise.all([
    Issue.aggregate<{ _id: string; count: number }>([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Issue.aggregate<{ _id: string; count: number }>([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
    Issue.aggregate<{ _id: mongoose.Types.ObjectId; count: number }>([
      { $group: { _id: '$hallId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Issue.aggregate<{ _id: string; count: number }>([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    countOverdue(),
    averageResolutionTime(),
    Issue.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('referenceNumber status priority category hallId createdAt')
      .populate('hallId', 'name code')
      .lean(),
  ]);

  const halls = await Hall.find().lean();
  const hallMap = new Map(halls.map((h) => [h._id.toString(), h]));
  const hallBreakdown = hallCounts.map((h) => ({
    hallId: h._id.toString(),
    name: hallMap.get(h._id.toString())?.name,
    code: hallMap.get(h._id.toString())?.code,
    count: h.count,
  }));

  return {
    totalIssues: statusCounts.reduce((sum, s) => sum + s.count, 0),
    openIssues: await Issue.countDocuments({ status: { $nin: ['rejected', 'resolved', 'closed'] } }),
    statusCounts: countsToObject(statusCounts),
    priorityCounts: countsToObject(priorityCounts),
    hallBreakdown,
    recurringCategories: categoryCounts,
    overdueIssues: overdueCount,
    averageResolutionHours: avgResolutionTime,
    recentIssues: recent,
  };
}

async function countOverdue(hallId?: mongoose.Types.ObjectId): Promise<number> {
  const match: Record<string, unknown> = {
    status: { $nin: ['rejected', 'closed', 'resolved'] },
    resolvedAt: null,
  };
  if (hallId) match.hallId = hallId;

  const [issues, settings] = await Promise.all([
    Issue.find(match).select('submittedAt priority').lean(),
    getSettings(),
  ]);
  const now = new Date();
  return issues.filter((issue) => {
    const target = new Date(
      issue.submittedAt.getTime() +
        settings.priorityTargetHours[issue.priority as IssuePriority] * 60 * 60 * 1000,
    );
    return now > target;
  }).length;
}

async function averageResolutionTime(hallId?: mongoose.Types.ObjectId): Promise<number | null> {
  const match: Record<string, unknown> = { status: { $in: ['resolved', 'closed'] }, resolvedAt: { $ne: null } };
  if (hallId) match.hallId = hallId;
  const docs = await Issue.find(match).select('submittedAt resolvedAt').lean();
  if (docs.length === 0) return null;
  const totalHours = docs.reduce((sum, issue) => {
    const resolved = issue.resolvedAt ?? issue.updatedAt;
    const ms = resolved.getTime() - issue.submittedAt.getTime();
    return sum + ms / (1000 * 60 * 60);
  }, 0);
  return Math.round((totalHours / docs.length) * 100) / 100;
}

function countsToObject(counts: StatusCount[]): Record<string, number> {
  return counts.reduce<Record<string, number>>((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});
}

export async function getTopRecurringLocations(limit = 10) {
  return Issue.aggregate([
    { $match: { status: { $nin: ['rejected', 'closed'] } } },
    { $group: { _id: '$locationId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);
}
