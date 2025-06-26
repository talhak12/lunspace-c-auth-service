import { NextFunction, Response, Request } from 'express';
import { UserService } from '../services/UserService';
import { CreateUserRequest } from '../types';
import { Roles } from '../constants';
import { only } from 'node:test';
const { matchedData } = require('express-validator');

export class UserController {
  constructor(private userService: UserService) {}

  async create(req: CreateUserRequest, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password } = req.body;
    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
        role: Roles.MANAGER,
      });

      res.status(201).json({ id: user.id });
    } catch (err) {
      next(err);
    }
  }

  async get(req: Request, res: Response) {
    const validatedQuery = matchedData(req, { onlyValidData: true });

    console.log('validatedQuery', validatedQuery);

    const [users, count] = await this.userService.find(validatedQuery);

    res.json({
      data: users,
      currentPage: validatedQuery.currentPage as number,
      perPage: validatedQuery.perPage as number,
      total: count,
    });
  }
}
