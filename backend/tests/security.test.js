const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const app = require('../app');
const DbManager = require('../dbManager');

describe('Security & Input Validation Tests', () => {
  let mockUser;
  let authToken;
  const mockUID = new ObjectId();
  const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

  beforeAll(async () => {
    // Insert mock user
    mockUser = {
      _id: mockUID,
      email: 'test@unisabana.edu.co',
      username: 'testuser',
      password: 'hashedpassword',
      isSeller: false,
      isSuspended: false
    };
    await DbManager.addUser(mockUser);
    
    // Sign valid token
    authToken = jwt.sign({ UID: mockUID.toString() }, JWT_SECRET);
  });

  afterAll(async () => {
    // Clean up mock user
    await mongoose.connection.db.collection('users').deleteOne({ _id: mockUID });
    
    // Close connections
    await mongoose.connection.close();
    await DbManager.closeConnection();
  });

  describe('MongoDB NoSQL Injection & Malformed ID Safeguards', () => {
    it('should reject invalid MongoDB ObjectId in polling GET with 400 Bad Request', async () => {
      const res = await request(app)
        .get('/api/chat/null/messages/polling?lastCheckedAt=2026-05-22T21:25:24.015Z')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('Invalid conversation ID');
    });

    it('should reject invalid MongoDB ObjectId in polling POST with 400 Bad Request', async () => {
      const res = await request(app)
        .post('/api/chat/invalid-id-123/messages/polling')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Test message' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('Invalid conversation ID');
    });
  });
});
