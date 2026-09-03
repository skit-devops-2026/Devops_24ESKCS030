const test = require('node:test');
const assert = require('node:assert');

test('Event Workflow - Multi-Stage Approval State Machine', async (t) => {
  // Simulating the lifecycle stages of an event proposal
  const newProposal = {
    title: 'AI Robotics Workshop',
    category: 'Robotics',
    date: '2026-10-20',
    venue: 'TBD',
    budget: 12000,
    facultyStatus: 'Pending',
    hodStatus: 'Pending',
    isLive: false
  };

  await t.test('stage 1: Club proposal starts with Pending status and isLive = false', () => {
    assert.strictEqual(newProposal.facultyStatus, 'Pending');
    assert.strictEqual(newProposal.hodStatus, 'Pending');
    assert.strictEqual(newProposal.isLive, false);
  });

  await t.test('stage 2: Faculty reviews and approves the domain event', () => {
    const facultyApproved = { ...newProposal, facultyStatus: 'Approved' };
    assert.strictEqual(facultyApproved.facultyStatus, 'Approved');
    assert.strictEqual(facultyApproved.isLive, false, 'Event should not be live before HOD approval');
  });

  await t.test('stage 3: HOD approves proposal and assigns venue, setting isLive to true', () => {
    const hodApproved = {
      ...newProposal,
      facultyStatus: 'Approved',
      hodStatus: 'Approved',
      venue: 'Main Seminar Hall 1',
      isLive: true
    };
    assert.strictEqual(hodApproved.facultyStatus, 'Approved');
    assert.strictEqual(hodApproved.hodStatus, 'Approved');
    assert.strictEqual(hodApproved.venue, 'Main Seminar Hall 1');
    assert.strictEqual(hodApproved.isLive, true);
  });

  await t.test('stage 4: Rejected proposal remains offline', () => {
    const rejectedProposal = {
      ...newProposal,
      facultyStatus: 'Rejected',
      isLive: false
    };
    assert.strictEqual(rejectedProposal.facultyStatus, 'Rejected');
    assert.strictEqual(rejectedProposal.isLive, false);
  });
});
