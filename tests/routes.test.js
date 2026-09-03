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
});
