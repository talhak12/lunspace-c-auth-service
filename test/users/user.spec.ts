import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import createJWKSMock from 'mock-jwks';
import request from 'supertest';
import app from '../../src/app';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';

describe('GET /auth/self', () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;

  beforeAll(async () => {
    //jest.setTimeout(70000);
    jwks = createJWKSMock('http://localhost:5555');
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    jwks.start();
    await connection.dropDatabase();
    await connection.synchronize();

    //await truncateTables(connection);
  });

  afterEach(() => {
    jwks.stop();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe('Given all fields', () => {
    it('should return the 200 status code ', async () => {
      //Register
      const userData = {
        firstName: 'Rakesh',
        lastName: 'k',
        email: 'rakesh@mernspace',
        password: 'password',
      };
      const userRepository = connection.getRepository(User);
      const data = await userRepository.save({ ...userData, role: 'customer' });
      const accessToken = jwks.token({ sub: String(data.id), role: data.role });

      const response = await request(app)
        .get('/auth/self')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send();

      expect(response.body.id).toBe(data.id);
    });

    it('should not return the password field ', async () => {
      //Register
      const userData = {
        firstName: 'Rakesh',
        lastName: 'k',
        email: 'rakesh@mernspace',
        password: 'password',
      };
      const userRepository = connection.getRepository(User);
      const data = await userRepository.save({ ...userData, role: 'customer' });
      const accessToken = jwks.token({ sub: String(data.id), role: data.role });

      const response = await request(app)
        .get('/auth/self')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send();

      expect(response.body as Record<string, string>).not.toHaveProperty(
        'password'
      );
    });

    it('should return 401 status code if token does not ', async () => {
      //Register
      const userData = {
        firstName: 'Rakesh',
        lastName: 'k',
        email: 'rakesh@mernspace',
        password: 'password',
      };

      const response = await request(app).get('/auth/self').send();

      expect(response.statusCode).toBe(401);
    });
  });
});
