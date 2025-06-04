import { calculateDiscount } from './src/config/utils';
import app from './src/app';
import request from 'supertest';

describe.skip('App', () => {
  it('should return correct discount amount', () => {
    const dicount = calculateDiscount(100, 10);

    expect(dicount).toBe(10);
  });

  it('should return 200 statuus code', async () => {
    const response = await request(app).get('/').send();
    expect(response.statusCode).toBe(200);
  });
});
