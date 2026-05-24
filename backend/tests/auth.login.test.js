const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const DbManager = require('../dbManager');
const bcrypt = require('bcrypt');

describe('POST /api/auth/login', () => {
  const mockUser = {
    username: 'loginuser',
    email: 'loginuser@unisabana.edu.co',
    password: 'password123'
  };

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash(mockUser.password, 10);
    await DbManager.addUser({ ...mockUser, password: hashedPassword });
  });

  afterAll(async () => {
    await mongoose.connection.db.collection('users').deleteOne({ username: 'loginuser' });
    await mongoose.connection.close();
    await DbManager.closeConnection();
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        userOrEmail: 'loginuser',
        password: 'password123'
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        userOrEmail: 'loginuser',
        password: 'wrongpassword'
      });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });
});
