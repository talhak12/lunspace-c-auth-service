import fs from 'fs';
import { NextFunction, Response } from 'express';
import { RegisterUserRequest } from '../types';
import { UserService } from '../services/UserService';
import { Logger } from 'winston';
import { JwtPayload, sign } from 'jsonwebtoken';
import createHttpError from 'http-errors';
import path from 'path';
import { Config } from '../config';
const { validationResult } = require('express-validator');

export class AuthController {
  constructor(private userService: UserService, private logger: Logger) {}

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    //validation ...
    const result = validationResult(req);

    if (!result.isEmpty()) {
      //console.log(result);
      //return res.status(400).json({ error: result.array() });
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

      let privateKey: Buffer;

      privateKey = fs.readFileSync(
        path.join(__dirname, '../../certs/private.pem')
      );

      const payload: JwtPayload = {
        sub: String(id),
        role: 'customer',
      };

      const accessToken = sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '1h',
        issuer: 'auth-service',
      });
      console.log(Config.REFRESH_TOKEN_SECRET);
      const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
        algorithm: 'HS256',
        expiresIn: '1y',
        issuer: 'auth-service',
      });

      res.cookie('accessToken', accessToken, {
        domain: 'localhost',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
      });

      res.cookie('refreshToken', refreshToken, {
        domain: 'localhost',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
      });

      res.status(201).json({ id });
    } catch (err) {
      next(err);
      return;
    }
  }
}
