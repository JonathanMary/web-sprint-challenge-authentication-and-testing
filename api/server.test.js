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
  //await db.seed.run();
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
    }),
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
    
  })
  describe('[POST] /api/auth/login', () => {
    
  })
  describe('[GET] /api/jokes', () => {
    
  })
})
