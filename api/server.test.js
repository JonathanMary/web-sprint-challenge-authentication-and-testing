const server = require('./server');
const request = require('supertest');
const db = require('../data/dbConfig');

const Users = require('./auth/users-model');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})
beforeEach(async () => {
  await db('users').truncate();
})
afterAll(async () => {
  await db.destroy();
})

test('sanity', () => {
  expect(true).toBe(true);
})
test('process.env.DB_ENV must be "testing"', () => {
  expect(process.env.NODE_ENV).toBe('testing');
})

describe('API endpoints', () => {
  let user;
  beforeEach(async () => {
    user = {
      username: 'Captain Marvel',
      password: 'foobar',
    } 
  })
  describe('users-model, insert', () => {
    it('creates a new user in database', async () => {
      await Users.insert(user);
      expect(await db('users')).toHaveLength(1);
      expect((await db('users'))[0]).toEqual({
        id: 1,
        username: 'Captain Marvel',
        password: 'foobar',
      })
    })
    it('returns newly created user', async () => {
      const captain = await Users.insert(user);
      expect(captain).toEqual({
        id: 1,
        username: 'Captain Marvel',
        password: 'foobar',
      })
    })
  })
  describe('[POST] /api/auth/register', () => {
    it('creates a new user in database', async () => {
      await request(server).post('/api/auth/register').send(user);
      expect(await db('users')).toHaveLength(1);
    })
    it('returns newly created user', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send(user);
      expect(res.body.id).toEqual(1);
      expect(res.body.username).toEqual('Captain Marvel');
    })
  })
  describe('[POST] /api/auth/login', () => {
    it('returns a message and token', async () => {
      await request(server).post('/api/auth/register').send(user);
      const res = await request(server)
        .post('/api/auth/login')
        .send(user);
      expect(res.body.message).toBe('welcome, Captain Marvel');
      expect(res.body).toHaveProperty('token');
    })
    it('verifies password', async () => {
      await request(server).post('/api/auth/register').send(user);
      const fakeCaptain = {
        username: 'Captain Marvel',
        password: '1234',
      }
      const res = await request(server)
        .post('/api/auth/login')
        .send(fakeCaptain);
      expect(res.body).toEqual({ message: 'invalid credentials' });
    })
  })
  describe('[GET] /api/jokes', () => {
    it('restricts access if no token', async () => {
      const res = await request(server).get('/api/jokes');
      expect(res.body.message).toEqual('token required');
    })
    it('restricts access to user with invalid token', async () => {
      const res = await request(server)
        .get('/api/jokes')
        .set('Authorization', 'thatsafaketoken');
      expect(res.body.message).toEqual('token invalid');
    })
  })
})
