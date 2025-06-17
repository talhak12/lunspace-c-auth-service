import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import createJWKSMock from 'mock-jwks';
import request from 'supertest';
import app from '../../src/app';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';

describe('POST /users', () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;
  let adminToken: string;

  beforeAll(async () => {
    //jest.setTimeout(70000);
    jwks = createJWKSMock('http://localhost:5555');
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    jwks.start();
    await connection.dropDatabase();
    await connection.synchronize();

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
    it('should persist the user in the database ', async () => {
      //Register
      const userData = {
        firstName: 'Rakesh',
        lastName: 'k',
        email: 'rakesh@mernspace',
        password: 'password',
        tenantId: 1,
      };

      await request(app)
        .post('/users')
        .set('Cookie', [`accessToken=${adminToken}`])
        .send(userData);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users).toHaveLength(1);
      expect(users[0].role).toBe(Roles.MANAGER);
      expect(users[0].email).toBe(userData.email);
    });

    it.todo('');
  });
});
