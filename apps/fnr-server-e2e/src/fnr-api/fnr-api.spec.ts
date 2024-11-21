import request from 'supertest';
import express from 'express';
import { Router } from 'express';

// Create a mock router
const mockRouter = Router();
mockRouter.get('/', (req, res) => {
  res.json({ message: 'Hello API' });
});

describe('GET /', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/', mockRouter);
  });

  it('should return a message', async () => {
    const response = await request(app).get('/').expect(200);

    expect(response.body).toEqual({ message: 'Hello API' });
  });
});
