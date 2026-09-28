import { describe, it, expect } from 'vitest';
import { getAgent, createUser, loginAs } from '../helpers.js';

describe('Auth endpoints', () => {
  it('logs in and returns user profile', async () => {
    const agent = getAgent();
    const user = await createUser('student');
    const res = await agent.post('/api/v1/auth/login').send({ id: user.email, pin: '12345' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(user.email);
  });

  it('rejects invalid credentials', async () => {
    const agent = getAgent();
    const user = await createUser('student');
    const res = await agent.post('/api/v1/auth/login').send({ id: user.email, pin: '99999' });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('returns current user after login', async () => {
    const agent = getAgent();
    const user = await createUser('hall_manager');
    await loginAs(agent, user);
    const res = await agent.get('/api/v1/auth/me');
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(user.email);
  });

  it('requires authentication for /auth/me', async () => {
    const agent = getAgent();
    const res = await agent.get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });
});
