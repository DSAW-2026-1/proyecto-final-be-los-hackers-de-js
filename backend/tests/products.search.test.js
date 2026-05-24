const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const DbManager = require('../dbManager');

describe('GET /api/products/search', () => {
  beforeAll(async () => {
    // Add some test products with stock and images
    await DbManager.addProduct({ name: 'Test Product 1', price: 100, category: 'test', deleted: false, stock: 10, images: ["url1"] });
    await DbManager.addProduct({ name: 'Test Product 2', price: 200, category: 'test', deleted: false, stock: 5, images: ["url2"] });
  });

  afterAll(async () => {
    await mongoose.connection.db.collection('products').deleteMany({ category: 'test' });
    await mongoose.connection.close();
    await DbManager.closeConnection();
  });

  it('should return products based on search query', async () => {
    const res = await request(app)
      .get('/api/products/search')
      .query({ query: 'Test Product 1' });
    expect(res.status).toBe(200);
    expect(res.body.results).toBeDefined();
    // Since Object.assign was used, results are an object
    const resultsArray = Object.values(res.body.results);
    expect(resultsArray.length).toBeGreaterThan(0);
    expect(resultsArray[0].name).toBe('Test Product 1');
  });

  it('should return 400 for invalid sellerID', async () => {
    const res = await request(app)
      .get('/api/products/search')
      .query({ sellerID: 'invalid-id' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid seller ID');
  });
});
