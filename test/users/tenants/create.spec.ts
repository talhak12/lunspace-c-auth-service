import { DataSource } from 'typeorm';
import { AppDataSource } from '../../../src/config/data-source';
import request from 'supertest';
import app from '../../../src/app';
import { Tenant } from '../../../src/entity/Tenant';

describe('POST /tenants', () => {
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
    it('should return a 201 status code', async () => {
      const tenantData = {
        name: 'Tenant name',
        address: 'Tenant address',
      };
      //Act
      const response = await request(app).post('/tenants').send(tenantData);

      expect(response.statusCode).toBe(201);
    });

    it('should create a tenant in the database', async () => {
      const tenantData = {
        name: 'Tenant nameq',
        address: 'Tenant address',
      };

      await request(app).post('/tenants').send(tenantData);
      //Act
      const tenantRepository = connection.getRepository(Tenant);

      const tenants = await tenantRepository.find();
      expect(tenants).toHaveLength(1);
      expect(tenants[0].name).toBe(tenantData.name);
    });
  });
});
