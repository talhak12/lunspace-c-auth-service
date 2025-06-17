import { DataSource } from 'typeorm';
import { AppDataSource } from '../../../src/config/data-source';
import createJWKSMock from 'mock-jwks';
import request from 'supertest';
import app from '../../../src/app';
import { Tenant } from '../../../src/entity/Tenant';
import { response } from 'express';
import { Roles } from '../../../src/constants';

describe('POST /tenants', () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;
  let adminToken: string;

  beforeAll(async () => {
    //jest.setTimeout(70000);

    connection = await AppDataSource.initialize();
    jwks = createJWKSMock('http://localhost:5555');
  });

  beforeEach(async () => {
    await connection.dropDatabase();
    await connection.synchronize();

    jwks.start();

    adminToken = jwks.token({
      sub: '1',
      role: Roles.ADMIN,
    });

    //await truncateTables(connection);
  });

  afterEach(() => {
    jwks.stop();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe('Given all fields', () => {
    it.skip('should return a 201 status code', async () => {
      const tenantData = {
        name: 'Tenant name',
        address: 'Tenant address',
      };
      //Act
      const response = await request(app)
        .post('/tenants')
        .set('Cookie', [`accessToken=${adminToken}`])
        .send(tenantData);

      expect(response.statusCode).toBe(201);
    });

    it.skip('should create a tenant in the database', async () => {
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

    it.skip('should return 401 if user is not authenticated', async () => {
      adminToken = jwks.token({
        sub: '1',
        role: Roles.MANAGER,
      });

      const tenantData = {
        name: 'Tenant nameq',
        address: 'Tenant address',
      };

      const response = await request(app).post('/tenants').send(tenantData);
      //Act
      expect(response.statusCode).toBe(401);
    });

    it('should return 403 if user is not an admin', async () => {
      const managerToken = jwks.token({
        sub: '1',
        role: Roles.MANAGER,
      });

      const tenantData = {
        name: 'Tenant nameq',
        address: 'Tenant address',
      };

      const response = await request(app)
        .post('/tenants')
        .set('Cookie', [`accessToken=${managerToken}`])
        .send(tenantData);
      //Act
      expect(response.statusCode).toBe(403);
    });
  });
});
