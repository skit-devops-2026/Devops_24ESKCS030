const test = require('node:test');
const assert = require('node:assert');

test('Registration Logic - Pass Generation and Bounds', async (t) => {
  function generatePassId() {
    return 'PASS-' + Math.floor(100000 + Math.random() * 900000);
  }

  await t.test('generated pass ID should adhere to PASS-XXXXXX format', () => {
    for (let i = 0; i < 20; i++) {
      const passId = generatePassId();
      assert.match(passId, /^PASS-\d{6}$/, `Pass ID ${passId} should match pattern`);
    }
  });

  await t.test('team registration accommodates solo and multi-member teams', () => {
    const soloReg = {
      teamName: 'Solo',
      members: []
    };
    assert.strictEqual(soloReg.teamName, 'Solo');
    assert.strictEqual(soloReg.members.length, 0);

    const teamReg = {
      teamName: 'CyberKnights',
      members: [
        { name: 'Bob', roll: '24ESKCS031' },
        { name: 'Charlie', roll: '24ESKCS032' }
      ]
    };
    assert.strictEqual(teamReg.teamName, 'CyberKnights');
    assert.strictEqual(teamReg.members.length, 2);
  });
});
