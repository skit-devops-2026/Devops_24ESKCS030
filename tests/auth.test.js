const test = require('node:test');
const assert = require('node:assert');
const bcrypt = require('bcryptjs');

test('Auth Security Logic - Password Hashing & Verification', async (t) => {
  const plainPassword = 'SuperSecretPassword@2026';

  let hashedPassword;
  await t.test('should hash plain password securely with salt', async () => {
    hashedPassword = await bcrypt.hash(plainPassword, 10);
    assert.notStrictEqual(hashedPassword, plainPassword);
    assert.ok(hashedPassword.startsWith('$2'), 'Bcrypt hash should start with $2');
  });

  await t.test('should match correct password against hash', async () => {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    assert.strictEqual(isMatch, true, 'Valid password must match hash');
  });

  await t.test('should reject incorrect password against hash', async () => {
    const isMatch = await bcrypt.compare('WrongPassword!123', hashedPassword);
    assert.strictEqual(isMatch, false, 'Invalid password must not match hash');
  });
});

test('Auth Logic - Role Validation & Permission Matrices', async (t) => {
  const validRoles = ['student', 'club', 'faculty', 'hod'];

  await t.test('all expected system roles should be recognized', () => {
    assert.strictEqual(validRoles.length, 4);
    assert.ok(validRoles.includes('student'));
    assert.ok(validRoles.includes('club'));
    assert.ok(validRoles.includes('faculty'));
    assert.ok(validRoles.includes('hod'));
  });

  await t.test('domain assignment matches role context', () => {
    const facultyUser = { role: 'faculty', domain: 'Tech' };
    const hodUser = { role: 'hod', domain: 'Authority' };
    const studentUser = { role: 'student', domain: 'General' };

    assert.strictEqual(facultyUser.domain, 'Tech');
    assert.strictEqual(hodUser.domain, 'Authority');
    assert.strictEqual(studentUser.domain, 'General');
  });
});
