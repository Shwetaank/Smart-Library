
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { initialize } from '../src/container.js';

initialize();

describe('Books endpoint', () => {
  it('requires authentication', async () => {
    const app = createApp();
    const response = await request(app).get('/api/v1/books');

    expect(response.status).toBe(401);
  });
});
