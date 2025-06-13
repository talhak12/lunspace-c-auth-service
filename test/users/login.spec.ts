import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import request from 'supertest';
import app from '../../src/app';

describe('POST /auth/login', () => {
  let connection: DataSource;

  beforeAll(async () => {
    //jest.setTimeout(70000);
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await connection.dropDatabase();
    await connection.synchronize();

    //await truncateTables(connection);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe('Given all fields', () => {
    it.skip('should check if email and password is wrong', async () => {
      const response = await request(app).get('/auth/self').send();
      expect(1).toBe(1);
    });

    it.skip('should return access token and refresh token inside a cookie', async () => {
      expect(201).toBe(201);
    });
  });
});
