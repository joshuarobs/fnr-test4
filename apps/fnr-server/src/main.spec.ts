import request from 'supertest';
import { app } from './main';

describe('Server API', () => {
  it('GET /api returns welcome message and endpoints', async () => {
    const response = await request(app).get('/api');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Welcome to fnr-server!',
      endpoints: {
        claims: '/api/claims',
        users: '/api/users',
        staff: '/api/staff',
        suppliers: '/api/suppliers',
      },
    });
  });
});
