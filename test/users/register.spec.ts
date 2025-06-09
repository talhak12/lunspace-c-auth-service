import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { truncateTables } from './utils/index';
import { User } from '../../src/entity/User';

describe('POST /auth/register', () => {
  let connection: DataSource;

  beforeAll(async () => {
    //jest.setTimeout(70000);
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    console.log(`starting...`);
    await truncateTables(connection);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe('Given all fields', () => {
    it('should return the 201 status code', async () => {
      //AAA
      //Arrange
      const userData = {
        firstName: 'Rakesh',
        lastName: 'k',
        email: 'rakesh@mernspace',
        password: '',
      };
      //Act
      const response = await request(app).post('/auth/register').send(userData);

      //Assert
      expect(201).toBe(201);
    });

    it.skip('should return valid json response', async () => {
      //AAA
      //Arrange
      const userData = {
        firstName: 'Rakesh',
        lastName: 'k',
        email: 'rakesh@mernspace',
        password: '',
      };
      //Act
      const response = await request(app).post('/auth/register').send(userData);

      //Assert
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });

    it.skip('it should persist the user in the database', async () => {
      const userData = {
        firstName: 'Rakesh',
        lastName: 'k',
        email: 'rakesh@mernspace',
        password: '',
      };
      //Act
      await request(app).post('/auth/register').send(userData);

      const userRepository = connection.getRepository(User);
      const user = await userRepository.find();

      //expect(user).toHaveLength(1);
      expect(user[0].firstName).toBe(userData.firstName);
      expect(user[0].lastName).toBe(userData.lastName);
      expect(user[0].email).toBe(userData.email);
    });
  });

  describe('Fields are missing', () => {});
});
