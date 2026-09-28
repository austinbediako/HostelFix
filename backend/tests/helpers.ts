import bcrypt from 'bcryptjs';
import supertest from 'supertest';
import { User } from '../src/modules/users/user.model.js';
import { Hall } from '../src/modules/residences/hall.model.js';
import { Location } from '../src/modules/residences/location.model.js';
import { Issue } from '../src/modules/issues/issue.model.js';
import { createApp } from '../src/app.js';
import type { Role } from '../src/shared/constants/roles.js';
import type mongoose from 'mongoose';

const DEFAULT_PIN = '12345';

export function getAgent() {
  return supertest.agent(createApp());
}

export async function createUser(role: Role, overrides: Record<string, unknown> = {}) {
  const passwordHash = await bcrypt.hash(DEFAULT_PIN, 10);
  const email = overrides.email as string | undefined ?? `${role}-${Date.now()}@hostelfix.ug.edu.gh`;
  const name = (overrides.name as string | undefined) ?? `Test ${role}`;
  const payload: Record<string, unknown> = {
    name,
    email,
    passwordHash,
    role,
    active: true,
    assignedHallIds: [],
    ...overrides,
  };
  if (role === 'student' && !overrides.studentId) {
    payload.studentId = `STU${Date.now()}`;
  }
  return User.create(payload);
}

export async function loginAs(agent: supertest.TestAgent, user: { email: string }) {
  const res = await agent.post('/api/v1/auth/login').send({ id: user.email, pin: DEFAULT_PIN });
  if (res.status !== 200) {
    throw new Error(`Login failed for ${user.email}: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return agent;
}

export async function createHall(overrides: Record<string, unknown> = {}) {
  return Hall.create({
    name: `Test Hall ${Date.now()}`,
    code: `TH${Date.now()}`,
    type: 'traditional',
    active: true,
    ...overrides,
  });
}

export async function createLocation(
  hallId: mongoose.Types.ObjectId,
  overrides: Record<string, unknown> = {},
) {
  return Location.create({
    hallId,
    type: 'room',
    block: 'A',
    floor: '1',
    room: `101`,
    active: true,
    ...overrides,
  });
}

export async function createIssue(
  reporter: { _id: mongoose.Types.ObjectId },
  locationId: mongoose.Types.ObjectId,
  overrides: Record<string, unknown> = {},
) {
  const hallId = (overrides.hallId as mongoose.Types.ObjectId) ?? new mongoose.Types.ObjectId();
  return Issue.create({
    referenceNumber: `HF-${Date.now()}`,
    reporterId: reporter._id,
    hallId,
    locationId,
    category: 'plumbing',
    reportedPriority: 'normal',
    priority: 'normal',
    status: 'submitted',
    description: 'Test issue description',
    imageUrls: [],
    assignedToIds: [],
    submittedAt: new Date(),
    ...overrides,
  });
}
