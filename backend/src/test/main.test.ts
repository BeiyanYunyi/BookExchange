/* eslint-disable import/no-extraneous-dependencies */
import supertest from 'supertest';
import { describe, it } from 'vitest';
import app from '../app.js';

describe.sequential('main', () => {
  const api = supertest(app);
  it('should pass', async ({ expect }) => {
    const res = await api.get('/api/book').expect(200).expect('Content-Type', /json/);
    expect(res.body).toBeInstanceOf(Array);
  });
});
