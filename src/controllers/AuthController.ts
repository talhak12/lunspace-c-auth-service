import { NextFunction, Response } from 'express';
import { RegisterUserRequest } from '../types';
import { UserService } from '../services/UserService';
import { Logger } from 'winston';
import createHttpError from 'http-errors';
const { validationResult } = require('express-validator');

export class AuthController {
  constructor(private userService: UserService, private logger: Logger) {}

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    //validation ...
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ error: result.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    this.logger.debug('New request to register a user', {
      firstName,
      lastName,
      email,
    });
    try {
      const id = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
      });
      //console.log('pp : ' + id);
      //console.log(this.logger);
      this.logger.info('kk');
      res.status(201).json({ id });
    } catch (err) {
      next(err);
      return;
    }
  }
}
