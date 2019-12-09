const NodeEnvironment = require('jest-environment-node');
const supertest = require('supertest');

const app = require('./src/app');

const req = supertest(app);

class TestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();
    // login user
    const user = {
      name: 'Test',
      email: 'test@test.com',
      password: 'test123',
    };
    // Set up token
    const token = { Authorization: '' };
    // Try to register user
    const res = await req.post('/api/register').send(user);
    if (res.body.token) {
      token.Authorization = `Bearer ${res.body.token}`;
    } else {
      // Login with the user
      const resAuth = await req.post('/api/authenticate').send(user);
      token.Authorization = `Bearer ${resAuth.body.token}`;
    }
    this.global.token = token;
  }

  async teardown() {
    this.global.db = null;
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = TestEnvironment;
