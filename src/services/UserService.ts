import { Brackets, Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import bcrypt from 'bcrypt';
import { User } from '../entity/User';
import { userData, UserQueryParams } from '../types';
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
      relations: {
        tenant: true,
      },
    });
  }

  async find(validatedQuery: UserQueryParams) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (validatedQuery.q) {
      const searchTerm = `%${validatedQuery.q}%`;

      console.log('searchTerm', searchTerm);

      /*queryBuilder.where(
        'concat(user.firstName,user.lastName) LIKE :searchTerm',
        { searchTerm }
      );*/

      queryBuilder.where(
        new Brackets((qb) => {
          qb.where(
            "CONCAT(user.firstName, ' ', user.lastName) LIKE :searchTerm",
            { q: searchTerm }
          ).orWhere('user.email LIKE :searchTerm', { searchTerm });
        })
      );
    }

    if (validatedQuery.role) {
      queryBuilder.andWhere('user.role = :role', { role: validatedQuery.role });
    }

    const result = await queryBuilder
      .leftJoinAndSelect('user.tenant', 'tenant')
      .skip((validatedQuery.currentPage - 1) * validatedQuery.perPage)
      .take(validatedQuery.perPage)
      .orderBy('user.id', 'DESC')
      .getManyAndCount();

    console.log(queryBuilder.getSql());

    return result;

    /*return await this.userRepository.find({
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });*/
  }

  async update(id: number, { firstName, lastName, email }: userData) {
    try {
      return await this.userRepository.update(id, {
        firstName,
        lastName,
        email,
      });
    } catch (err) {
      console.log(err);
      const error = createHttpError(
        500,
        'failed to update the data in the database'
      );
      throw error;
    }
  }
}
