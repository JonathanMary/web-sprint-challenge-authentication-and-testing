const server = require('./server');
const request = require('supertest');
const db = require('../data/dbConfig');

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
  describe('[POST] /api/auth/register', () => {
    
  })
  describe('[POST] /api/auth/login', () => {
    
  })
  describe('[GET] /api/jokes', () => {
    
  })
})
