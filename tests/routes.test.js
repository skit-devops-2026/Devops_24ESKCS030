const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const mongoose = require('mongoose');
process.env.NODE_ENV = 'test';
const app = require('../server');

test.after(async () => {
  try {
    await mongoose.disconnect();
  } catch (err) {
    // Ignore error on disconnect
  }
});

test('API & Static Routes - HTTP Endpoints & Responses', async (t) => {
  await t.test('GET /login.html should serve authentication HTML page', async () => {
    const res = await request(app).get('/login.html');
    assert.strictEqual(res.status, 200);
    assert.match(res.headers['content-type'], /html/);
  });

  await t.test('GET /register.html should serve student registration page', async () => {
    const res = await request(app).get('/register.html');
    assert.strictEqual(res.status, 200);
    assert.match(res.headers['content-type'], /html/);
  });

  await t.test('POST /api/auth/login with invalid data should return 400 or 500 error', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@test.com', password: 'random', role: 'student' });
    assert.ok(res.status === 400 || res.status === 500);
  });

  await t.test('POST /api/auth/register with missing fields should return error', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'incomplete@test.com' });
    assert.ok(res.status === 400 || res.status === 500);
  });

  await t.test('GET /api/events/live should return live events collection with 200 OK', async () => {
    const res = await request(app).get('/api/events/live');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body), 'Response body should be an array of events');
  });

  await t.test('POST /api/events/propose with missing required fields should return 400', async () => {
    const res = await request(app)
      .post('/api/events/propose')
      .send({ title: 'Incomplete Event' });
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.error, 'Should contain validation error message');
  });

  await t.test('PATCH /api/events/:id/faculty-status with invalid id format should return 400', async () => {
    const res = await request(app)
      .patch('/api/events/invalid-mongo-id-format/faculty-status')
      .send({ status: 'Approved' });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'Invalid event ID format.');
  });

  await t.test('GET /api/registrations/student/:roll should return student passes with 200 OK', async () => {
    const res = await request(app).get('/api/registrations/student/24ESKCS030');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body), 'Response body should be an array of student registrations');
  });
});
