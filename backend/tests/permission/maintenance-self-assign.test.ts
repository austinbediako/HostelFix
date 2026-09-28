import { describe, it, expect } from 'vitest';
import { getAgent, createUser, loginAs, createHall, createLocation, createIssue } from '../helpers.js';

describe('Maintenance self-assignment prevention', () => {
  it('prevents maintenance personnel from assigning themselves to arbitrary issues', async () => {
    const hall = await createHall({ name: 'Maint Hall', code: 'MTH' });
    const location = await createLocation(hall._id);
    const maint = await createUser('maintenance', { assignedHallIds: [hall._id] });
    const issue = await createIssue(await createUser('student'), location._id, {
      hallId: hall._id,
      status: 'under_review',
    });

    const agent = getAgent();
    await loginAs(agent, maint);

    const res = await agent.post(`/api/v1/issues/${issue._id.toString()}/assignments`).send({
      personnelIds: [maint._id.toString()],
    });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });
});
