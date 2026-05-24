const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const app = require('../app');
const DbManager = require('../dbManager');

describe('Messaging System Benchmark', () => {
  let authToken;
  const mockUID = new ObjectId();
  const chatId = new ObjectId();
  const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

  beforeAll(async () => {
    await DbManager.addUser({ _id: mockUID, email: 'bench@test.com', username: 'bench', password: 'password', isSeller: false, isSuspended: false });
    await mongoose.connection.db.collection('chats').insertOne({ _id: chatId, buyerID: mockUID, sellerID: new ObjectId() });
    await mongoose.connection.db.collection('messages').insertMany(
        Array.from({ length: 50 }).map((_, i) => ({ chatId, senderId: mockUID, content: `msg ${i}`, createdAt: new Date() }))
    );
    authToken = jwt.sign({ UID: mockUID.toString() }, JWT_SECRET);
  });

  afterAll(async () => {
    await mongoose.connection.db.collection('users').deleteOne({ _id: mockUID });
    await mongoose.connection.db.collection('chats').deleteOne({ _id: chatId });
    await mongoose.connection.db.collection('messages').deleteMany({ chatId });
    await mongoose.connection.close();
    await DbManager.closeConnection();
  });

  async function benchmark(endpoint, method, data = null, expectedStatus = 200) {
    const latencies = [];
    const runs = 50;
    for (let i = 0; i < runs; i++) {
      const start = Date.now();
      const req = request(app)[method.toLowerCase()](endpoint)
        .set('Authorization', `Bearer ${authToken}`);
      if (data) req.send(data);
      const res = await req;
      if (res.status !== expectedStatus) {
        console.log('Error body:', res.body);
      }
      expect(res.status).toBe(expectedStatus); // Verify success
      latencies.push(Date.now() - start);
    }
    
    latencies.sort((a, b) => a - b);
    const avg = latencies.reduce((a, b) => a + b) / runs;
    const median = latencies[Math.floor(runs / 2)];
    const p99 = latencies[Math.floor(runs * 0.99)];
    
    return { avg, median, p99 };
  }

  it('benchmark GET /api/chat/:chatId/messages', async () => {
    const res = await benchmark(`/api/chat/${chatId}/messages`, 'GET');
    console.log('GET results:', res);
  });

  it('benchmark POST /api/chat/:chatId/messages/polling', async () => {
    const res = await benchmark(`/api/chat/${chatId}/messages/polling`, 'POST', { content: 'hello' }, 201);
    console.log('POST results:', res);
  });
});
