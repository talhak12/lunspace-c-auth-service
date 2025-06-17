import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import bcrypt from 'bcrypt';
import { User } from '../entity/User';
import { userData } from '../types';
import createHttpError from 'http-errors';
import { Roles } from '../constants';

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ firstName, lastName, email, password, role }: userData) {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user) {
      const err = createHttpError(400, 'Email already exists');
      throw err;
    }
    const hashPassword = await bcrypt.hash(password, 10);

    try {
      const userRecord = await this.userRepository.save({
        firstName,
        lastName,
        email,
        password: hashPassword,
        role,
      });
      return userRecord;
    } catch (err) {
      //console.log(err);
      const error = createHttpError(
        500,
        'failed to store the data in the database'
      );
      throw error;
    }
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findById(id: number) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }
}
