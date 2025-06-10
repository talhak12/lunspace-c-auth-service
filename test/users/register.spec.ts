import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';

import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';

describe('POST /auth/register', () => {
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
    it.skip('should return the 201 status code', async () => {
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

    it.skip('should return the id of created user', async () => {
      //AAA
      //Arrange
      const userData = {
        firstName: 'Rakesh1',
        lastName: 'k1',
        email: 'rakesh@mernspace1',
        password: '',
      };
      //Act
      const response = await request(app).post('/auth/register').send(userData);
      //console.log(response);
      //Assert
      expect(JSON.parse(response.text).id).toBeGreaterThan(0);
      //expect(8).toBeGreaterThan(0);
    });

    it.skip('should assign a customer role', async () => {
      const userData = {
        firstName: 'Rakesh1',
        lastName: 'k1',
        email: 'rakesh@mernspace1',
        password: '',
      };
      //Act
      await request(app).post('/auth/register').send(userData);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users[0]).toHaveProperty('role');
      expect(users[0].role).toBe('customer');
    });

    it.skip('should assign a customer role', async () => {
      const userData = {
        firstName: 'Rakesh1',
        lastName: 'k1',
        email: 'rakesh@mernspace1',
        password: '',
      };
      //Act
      await request(app).post('/auth/register').send(userData);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users[0]).toHaveProperty('role');
      expect(users[0].role).toBe('customer');
    });

    it.skip('should store a hashed password in the database', async () => {
      const userData = {
        firstName: 'Rakesh1',
        lastName: 'k1',
        email: 'rakesh@mernspace1',
        password: 'secret',
      };
      //Act
      await request(app).post('/auth/register').send(userData);

      //Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      console.log(users[0].password);
      expect(users[0].password).not.toBe(userData.password);
      expect(users[0].password).toHaveLength(60);
    });

    it.skip('should store a hashed password in the database', async () => {
      const userData = {
        firstName: 'Rakesh1',
        lastName: 'k1',
        email: 'rakesh@mernspace1',
        password: 'secret',
      };
      //Act
      await request(app).post('/auth/register').send(userData);

      //Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      console.log(users[0].password);
      expect(users[0].password).not.toBe(userData.password);
      expect(users[0].password).toHaveLength(60);
    });

    it('should return 400 status code if email already exists', async () => {
      const userData = {
        firstName: 'Rakesh1',
        lastName: 'k1',
        email: 'rakesh@mernspace1',
        password: 'secret',
      };
      const userRepository = connection.getRepository(User);
      await userRepository.save({ ...userData, role: Roles.CUSTOMER });
      //Act
      const response = await request(app).post('/auth/register').send(userData);
      //Assert

      expect(response.statusCode).toBe(400);
      const users = await userRepository.find();
      expect(users).toHaveLength(1);
    });
  });

  describe('Fields are missing', () => {});
});
