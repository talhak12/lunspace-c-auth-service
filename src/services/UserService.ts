import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import { userData } from '../types';
import createHttpError from 'http-errors';
import { Roles } from '../constants';

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ firstName, lastName, email, password }: userData) {
    //const userRepository = AppDataSource.getRepository(User);
    try {
      const userRecord = await this.userRepository.save({
        firstName,
        lastName,
        email,
        password,
        role: Roles.CUSTOMER,
      });
      return userRecord.id;
    } catch (err) {
      const error = createHttpError(
        500,
        'failed to store the data in the database'
      );
      throw error;
    }
  }
}
