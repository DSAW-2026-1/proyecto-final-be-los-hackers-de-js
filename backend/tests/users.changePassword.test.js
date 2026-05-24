const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const DbManager = require('../dbManager');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

describe('POST /api/users/change-password', () => {
  let authToken;
  const mockUID = new mongoose.Types.ObjectId();
  const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
  const oldPassword = 'oldPassword123';
  const newPassword = 'newPassword123';

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash(oldPassword, 10);
    await DbManager.addUser({
      _id: mockUID,
      username: 'pwuser',
      email: 'pwuser@unisabana.edu.co',
      password: hashedPassword
    });

    authToken = jwt.sign({ UID: mockUID.toString() }, JWT_SECRET);
  });

  afterAll(async () => {
    await mongoose.connection.db.collection('users').deleteOne({ _id: mockUID });
    await mongoose.connection.close();
    await DbManager.closeConnection();
  });

  it('should change password with valid credentials', async () => {
    const res = await request(app)
      .post('/api/users/change-password')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        currentPassword: oldPassword,
        newPassword: newPassword
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Password updated successfully');
  });
});
