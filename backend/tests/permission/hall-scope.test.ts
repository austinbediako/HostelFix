import { describe, it, expect } from 'vitest';
import { getAgent, createUser, loginAs, createHall, createLocation } from '../helpers.js';

describe('Hall scope isolation', () => {
  it('prevents hall manager from accessing another halls dashboard and locations', async () => {
    const hallA = await createHall({ name: 'Hall A', code: 'HALLA' });
    const hallB = await createHall({ name: 'Hall B', code: 'HALLB' });
    await createLocation(hallB._id);
    const manager = await createUser('hall_manager', { assignedHallIds: [hallA._id] });

    const agent = getAgent();
    await loginAs(agent, manager);

    const dashboardRes = await agent.get(`/api/v1/halls/${hallB._id.toString()}/dashboard`);
    expect(dashboardRes.status).toBe(403);

    const locationsRes = await agent.get(`/api/v1/halls/${hallB._id.toString()}/locations`);
    expect(locationsRes.status).toBe(403);
  });
});
