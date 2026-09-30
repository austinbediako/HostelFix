import { describe, it, expect } from 'vitest';
import { getAgent, createUser, loginAs, createLocation } from '../helpers.js';
import { seedHalls } from '../../src/modules/residences/hall.service.js';
import { Hall } from '../../src/modules/residences/hall.model.js';

describe('Issue lifecycle', () => {
  it('student can create and track an issue', async () => {
    await seedHalls();
    const hall = await Hall.findOne({ code: 'AKU' });
    await createLocation(hall!._id);
    const student = await createUser('student');
    const agent = getAgent();
    await loginAs(agent, student);

    const createRes = await agent.post('/api/v1/issues').send({
      hallId: hall!._id.toString(),
      room: 'C310',
      category: 'plumbing',
      description: 'Leaking shower head',
      reportedPriority: 'high',
      imageUrls: ['https://res.cloudinary.com/test-cloud/image/upload/sample.jpg'],
    });
    expect(createRes.status).toBe(201);
    expect(createRes.body.data.status).toBe('submitted');
    expect(createRes.body.data.referenceNumber).toMatch(/^HF-/);

    const listRes = await agent.get('/api/v1/issues');
    expect(listRes.status).toBe(200);
    expect(listRes.body.data).toHaveLength(1);
  });

  it('denies creation with invalid image URL', async () => {
    await seedHalls();
    const hall = await Hall.findOne({ code: 'LEG' });
    await createLocation(hall!._id);
    const student = await createUser('student');
    const agent = getAgent();
    await loginAs(agent, student);

    const res = await agent.post('/api/v1/issues').send({
      hallId: hall!._id.toString(),
      room: 'C310',
      category: 'plumbing',
      description: 'Leaking shower head',
      reportedPriority: 'high',
      imageUrls: ['https://evil.com/image.jpg'],
    });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_IMAGE_URL');
  });

  it('runs the acknowledge → resolve → manual close workflow', async () => {
    await seedHalls();
    const hall = await Hall.findOne({ code: 'MSH' });
    await createLocation(hall!._id);
    const student = await createUser('student');
    const manager = await createUser('hall_manager', { assignedHallIds: [hall!._id] });
    const maint = await createUser('maintenance', { assignedHallIds: [hall!._id] });

    const studentAgent = getAgent();
    await loginAs(studentAgent, student);
    const createRes = await studentAgent.post('/api/v1/issues').send({
      hallId: hall!._id.toString(),
      room: 'C310',
      category: 'electrical',
      description: 'Flickering light',
      reportedPriority: 'normal',
    });
    expect(createRes.status).toBe(201);
    expect(createRes.body.data).toBeDefined();
    const issueId = createRes.body.data.id;

    const managerAgent = getAgent();
    await loginAs(managerAgent, manager);

    const ackRes = await managerAgent.patch(`/api/v1/issues/${issueId}/acknowledge`).send({
      action: 'acknowledge',
    });
    expect(ackRes.status).toBe(200);
    expect(ackRes.body.data.status).toBe('under_review');

    const priorityRes = await managerAgent.patch(`/api/v1/issues/${issueId}/priority`).send({
      priority: 'high',
    });
    expect(priorityRes.status).toBe(200);
    expect(priorityRes.body.data.priority).toBe('high');

    // Maintenance can resolve without explicit assignment, but only once in progress
    const maintAgent = getAgent();
    await loginAs(maintAgent, maint);
    const progressRes = await maintAgent.patch(`/api/v1/issues/${issueId}/status`).send({
      status: 'in_progress',
    });
    expect(progressRes.status).toBe(200);
    const resolveRes = await maintAgent.patch(`/api/v1/issues/${issueId}/status`).send({
      status: 'resolved',
    });
    expect(resolveRes.status).toBe(200);
    expect(resolveRes.body.data.status).toBe('resolved');
    expect(resolveRes.body.data.disputeWindowExpiresAt).toBeDefined();

    const closeRes = await managerAgent.patch(`/api/v1/issues/${issueId}/status`).send({
      status: 'closed',
    });
    expect(closeRes.status).toBe(200);
    expect(closeRes.body.data.status).toBe('closed');
  });

  it('requires work to be in progress before an issue can be resolved', async () => {
    await seedHalls();
    const hall = await Hall.findOne({ code: 'CMH' });
    await createLocation(hall!._id);
    const student = await createUser('student');
    const manager = await createUser('hall_manager', { assignedHallIds: [hall!._id] });

    const studentAgent = getAgent();
    await loginAs(studentAgent, student);
    const createRes = await studentAgent.post('/api/v1/issues').send({
      hallId: hall!._id.toString(),
      room: 'C310',
      category: 'plumbing',
      description: 'Broken tap',
      reportedPriority: 'normal',
    });
    const issueId = createRes.body.data.id;

    const managerAgent = getAgent();
    await loginAs(managerAgent, manager);

    const ackRes = await managerAgent.patch(`/api/v1/issues/${issueId}/acknowledge`).send({
      action: 'acknowledge',
    });
    expect(ackRes.status).toBe(200);

    const earlyRes = await managerAgent.patch(`/api/v1/issues/${issueId}/status`).send({
      status: 'resolved',
    });
    expect(earlyRes.status).toBe(400);

    await managerAgent.patch(`/api/v1/issues/${issueId}/status`).send({ status: 'in_progress' });
    const resolveRes = await managerAgent.patch(`/api/v1/issues/${issueId}/status`).send({
      status: 'resolved',
    });
    expect(resolveRes.status).toBe(200);
    expect(resolveRes.body.data.status).toBe('resolved');
  });

  it('allows student to reopen a resolved issue', async () => {
    await seedHalls();
    const hall = await Hall.findOne({ code: 'VOL' });
    await createLocation(hall!._id);
    const student = await createUser('student');
    const manager = await createUser('hall_manager', { assignedHallIds: [hall!._id] });

    const studentAgent = getAgent();
    await loginAs(studentAgent, student);
    const createRes = await studentAgent.post('/api/v1/issues').send({
      hallId: hall!._id.toString(),
      room: '101',
      category: 'plumbing',
      description: 'Broken tap',
      reportedPriority: 'normal',
    });
    const issueId = createRes.body.data.id;

    const managerAgent = getAgent();
    await loginAs(managerAgent, manager);
    await managerAgent.patch(`/api/v1/issues/${issueId}/acknowledge`).send({ action: 'acknowledge' });
    await managerAgent.patch(`/api/v1/issues/${issueId}/status`).send({ status: 'in_progress' });
    await managerAgent.patch(`/api/v1/issues/${issueId}/status`).send({ status: 'resolved' });

    const reopenRes = await studentAgent.post(`/api/v1/issues/${issueId}/reopen`);
    expect(reopenRes.status).toBe(200);
    expect(reopenRes.body.data.status).toBe('reopened');
  });

  it('rejects invalid status transitions', async () => {
    await seedHalls();
    const hall = await Hall.findOne({ code: 'HLH' });
    await createLocation(hall!._id);
    const student = await createUser('student');
    const manager = await createUser('hall_manager', { assignedHallIds: [hall!._id] });

    const studentAgent = getAgent();
    await loginAs(studentAgent, student);
    const createRes = await studentAgent.post('/api/v1/issues').send({
      hallId: hall!._id.toString(),
      room: '3105',
      category: 'plumbing',
      description: 'Broken tap',
      reportedPriority: 'normal',
    });
    const issueId = createRes.body.data.id;

    const managerAgent = getAgent();
    await loginAs(managerAgent, manager);
    const res = await managerAgent.patch(`/api/v1/issues/${issueId}/status`).send({
      status: 'closed',
    });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_STATUS_TRANSITION');
  });
});
