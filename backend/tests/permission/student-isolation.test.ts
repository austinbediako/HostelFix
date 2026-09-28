import { describe, it, expect } from 'vitest';
import { getAgent, createUser, loginAs, createHall, createLocation, createIssue } from '../helpers.js';

describe('Student isolation', () => {
  it('prevents one student from reading another students issue', async () => {
    const hall = await createHall({ name: 'Iso Hall', code: 'ISO' });
    const location = await createLocation(hall._id);
    const studentA = await createUser('student');
    const studentB = await createUser('student');
    const issue = await createIssue(studentA, location._id, { hallId: hall._id });

    const agentB = getAgent();
    await loginAs(agentB, studentB);

    const res = await agentB.get(`/api/v1/issues/${issue._id.toString()}`);
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });
});
