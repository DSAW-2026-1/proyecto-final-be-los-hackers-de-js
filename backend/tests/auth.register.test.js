const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const DbManager = require('../dbManager');

describe('POST /api/auth/register', () => {
  afterAll(async () => {
    // Clean up created user if necessary, or let DB handle it
    await mongoose.connection.db.collection('users').deleteOne({ username: 'newuser' });
    await mongoose.connection.close();
    await DbManager.closeConnection();
  });

  it('should register a new user with valid details', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'newuser',
        email: 'newuser@unisabana.edu.co',
        password: 'password123'
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject registration with invalid email domain', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'bademailuser',
        email: 'user@gmail.com',
        password: 'password123'
      });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
