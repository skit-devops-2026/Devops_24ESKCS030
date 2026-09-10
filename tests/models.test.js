const test = require('node:test');
const assert = require('node:assert');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

test('User Model - Schema Constraints & Defaults', async (t) => {
  await t.test('should validate a correctly formatted user', () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@college.edu',
      password: 'hashedpassword123',
      role: 'student',
      uniqueId: 'STU-1001',
      domain: 'Tech',
      year: '3rd Year'
    });

    const err = user.validateSync();
    assert.strictEqual(err, undefined, 'Valid user should not produce validation errors');
  });

  await t.test('should require name, email, password, role, and uniqueId', () => {
    const user = new User({});
    const err = user.validateSync();
    assert.ok(err, 'Empty user must produce validation errors');
    assert.ok(err.errors.name, 'Name is required');
    assert.ok(err.errors.email, 'Email is required');
    assert.ok(err.errors.password, 'Password is required');
    assert.ok(err.errors.role, 'Role is required');
    assert.ok(err.errors.uniqueId, 'UniqueId is required');
  });

  await t.test('should reject invalid roles outside allowed enum', () => {
    const user = new User({
      name: 'Hacker',
      email: 'hacker@test.com',
      password: 'secret',
      role: 'superadmin',
      uniqueId: 'BAD-01'
    });
    const err = user.validateSync();
    assert.ok(err && err.errors.role, 'Invalid role must fail enum validation');
  });

  await t.test('should assign default domain as General', () => {
    const user = new User({
      name: 'Student Simple',
      email: 'simple@college.edu',
      password: 'secret',
      role: 'student',
      uniqueId: 'STU-1002'
    });
    assert.strictEqual(user.domain, 'General');
  });
});

test('Event Model - Schema Constraints & Defaults', async (t) => {
  await t.test('should validate a correctly formatted event proposal', () => {
    const event = new Event({
      title: 'Hackathon 2026',
      category: 'Tech',
      date: '2026-10-15',
      venue: 'Auditorium',
      budget: 10000
    });
    const err = event.validateSync();
    assert.strictEqual(err, undefined, 'Valid event should pass validation');
    assert.strictEqual(event.facultyStatus, 'Pending');
    assert.strictEqual(event.hodStatus, 'Pending');
    assert.strictEqual(event.isLive, false);
    assert.strictEqual(event.fee, 0);
    assert.strictEqual(event.maxTeamSize, 1);
  });

  await t.test('should enforce allowed event categories', () => {
    const event = new Event({
      title: 'Invalid Fest',
      category: 'Gaming', // Not in ['NSS', 'Tech', 'Non-Tech', 'Sports', 'Robotics']
      date: '2026-10-15',
      venue: 'Ground',
      budget: 5000
    });
    const err = event.validateSync();
    assert.ok(err && err.errors.category, 'Unknown category must be rejected');
  });

  await t.test('should require title, category, date, venue, and budget', () => {
    const event = new Event({});
    const err = event.validateSync();
    assert.ok(err, 'Event without required fields must fail validation');
    assert.ok(err.errors.title);
    assert.ok(err.errors.category);
    assert.ok(err.errors.date);
    assert.ok(err.errors.venue);
    assert.ok(err.errors.budget);
  });
});

test('Registration Model - Schema Constraints & Defaults', async (t) => {
  await t.test('should validate a complete participant registration', () => {
    const reg = new Registration({
      eventName: 'Robowars 2026',
      category: 'Robotics',
      leaderName: 'Alice Sharma',
      leaderRoll: '24ESKCS030',
      branch: 'Computer Science',
      year: '3rd Year',
      passId: 'PASS-982341'
    });
    const err = reg.validateSync();
    assert.strictEqual(err, undefined);
    assert.strictEqual(reg.teamName, 'Solo');
    assert.strictEqual(reg.fee, 0);
    assert.strictEqual(reg.mentorStatus, 'Pending');
  });

  await t.test('should require passId, leaderRoll, and event details', () => {
    const reg = new Registration({});
    const err = reg.validateSync();
    assert.ok(err, 'Empty registration must fail validation');
    assert.ok(err.errors.eventName);
    assert.ok(err.errors.category);
    assert.ok(err.errors.leaderName);
    assert.ok(err.errors.leaderRoll);
    assert.ok(err.errors.branch);
    assert.ok(err.errors.year);
    assert.ok(err.errors.passId);
  });
});
