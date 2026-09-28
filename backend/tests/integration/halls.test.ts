import { describe, it, expect } from 'vitest';
import { getAgent, createUser, loginAs, createHall, createLocation } from '../helpers.js';
import { seedHalls } from '../../src/modules/residences/hall.service.js';

describe('Halls endpoints', () => {
  it('requires authentication to list halls', async () => {
    const agent = getAgent();
    const res = await agent.get('/api/v1/halls');
    expect(res.status).toBe(401);
  });

  it('lists all approved halls after seeding', async () => {
    await seedHalls();
    const agent = getAgent();
    const user = await createUser('student');
    await loginAs(agent, user);
    const res = await agent.get('/api/v1/halls');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(9);
    const names = res.body.data.map((h: { name: string }) => h.name);
    expect(names).toContain('Akuafo Hall');
    expect(names).toContain('Jean Nelson Aka Hall');
  });

  it('lists locations for a hall', async () => {
    const hall = await createHall({ name: 'Test Hall', code: 'THALL' });
    await createLocation(hall._id);
    const agent = getAgent();
    const user = await createUser('student');
    await loginAs(agent, user);
    const res = await agent.get(`/api/v1/halls/${hall._id.toString()}/locations`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
