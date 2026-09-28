import { describe, it, expect } from 'vitest';
import { getAgent, createUser, loginAs } from '../helpers.js';

describe('Role escalation prevention', () => {
  it('rejects role changes by non-system-admin users', async () => {
    const target = await createUser('student');
    const hallManager = await createUser('hall_manager');

    const agent = getAgent();
    await loginAs(agent, hallManager);

    const res = await agent.patch(`/api/v1/users/${target._id.toString()}/roles`).send({
      role: 'system_admin',
    });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('allows system admin to change a role', async () => {
    const target = await createUser('student');
    const admin = await createUser('system_admin');

    const agent = getAgent();
    await loginAs(agent, admin);

    const res = await agent.patch(`/api/v1/users/${target._id.toString()}/roles`).send({
      role: 'hall_manager',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe('hall_manager');
  });
});
