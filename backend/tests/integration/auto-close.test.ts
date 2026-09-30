import { describe, it, expect } from 'vitest';
import { getAgent, createUser, loginAs, createLocation } from '../helpers.js';
import { seedHalls } from '../../src/modules/residences/hall.service.js';
import { Hall } from '../../src/modules/residences/hall.model.js';
import { Issue } from '../../src/modules/issues/issue.model.js';
import { closeResolvedIssue } from '../../src/modules/issues/issue.service.js';

describe('Auto-close resolved issues', () => {
  it('auto-closes a resolved issue whose dispute window has expired', async () => {
    await seedHalls();
    const hall = await Hall.findOne({ code: 'AAK' });
    await createLocation(hall!._id);
    const student = await createUser('student');
    const manager = await createUser('hall_manager', { assignedHallIds: [hall!._id] });

    const studentAgent = getAgent();
    await loginAs(studentAgent, student);
    const createRes = await studentAgent.post('/api/v1/issues').send({
      hallId: hall!._id.toString(),
      room: '3105',
      category: 'plumbing',
      description: 'Dripping tap',
      reportedPriority: 'normal',
    });
    const issueId = createRes.body.data.id;

    const managerAgent = getAgent();
    await loginAs(managerAgent, manager);
    await managerAgent.patch(`/api/v1/issues/${issueId}/acknowledge`).send({ action: 'acknowledge' });
    await managerAgent.patch(`/api/v1/issues/${issueId}/status`).send({ status: 'in_progress' });
    await managerAgent.patch(`/api/v1/issues/${issueId}/status`).send({ status: 'resolved' });

    // Simulate expiry by moving the dispute window to the past
    await Issue.findByIdAndUpdate(issueId, {
      $set: { disputeWindowExpiresAt: new Date(Date.now() - 1000) },
    });

    await closeResolvedIssue(issueId);

    const res = await managerAgent.get(`/api/v1/issues/${issueId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('closed');
  });

  it('does not auto-close a resolved issue within the dispute window', async () => {
    await seedHalls();
    const hall = await Hall.findOne({ code: 'EFS' });
    await createLocation(hall!._id);
    const student = await createUser('student');
    const manager = await createUser('hall_manager', { assignedHallIds: [hall!._id] });

    const studentAgent = getAgent();
    await loginAs(studentAgent, student);
    const createRes = await studentAgent.post('/api/v1/issues').send({
      hallId: hall!._id.toString(),
      room: '2105',
      category: 'plumbing',
      description: 'Dripping tap',
      reportedPriority: 'normal',
    });
    const issueId = createRes.body.data.id;

    const managerAgent = getAgent();
    await loginAs(managerAgent, manager);
    await managerAgent.patch(`/api/v1/issues/${issueId}/acknowledge`).send({ action: 'acknowledge' });
    await managerAgent.patch(`/api/v1/issues/${issueId}/status`).send({ status: 'in_progress' });
    await managerAgent.patch(`/api/v1/issues/${issueId}/status`).send({ status: 'resolved' });

    await closeResolvedIssue(issueId);

    const res = await managerAgent.get(`/api/v1/issues/${issueId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('resolved');
  });
});
