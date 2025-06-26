import fs from 'fs';

import { NextFunction, Request, Response } from 'express';
import { AuthRequest, RegisterUserRequest } from '../types';
import { UserService } from '../services/UserService';
import { Logger } from 'winston';
import { JwtPayload, sign } from 'jsonwebtoken';

import { TokenService } from '../services/TokenService';
import createHttpError from 'http-errors';
import { CredentialService } from '../services/CredentialService';
import { Roles } from '../constants';
const { validationResult } = require('express-validator');

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private tokenService: TokenService,
    private credentialService: CredentialService
  ) {}

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
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
        role: Roles.CUSTOMER,
      });

      const payload: JwtPayload = {
        sub: String(user.id),
        role: 'customer',
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      const newRefreshToken = await this.tokenService.persistRefreshToken(user);

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
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

      res.status(201).json({ id: user.id });
    } catch (err) {
      next(err);
      return;
    }
  }

  async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
    //validation ...
    const result = validationResult(req);

    if (!result.isEmpty()) {
      //console.log(result);
      //return res.status(400).json({ error: result.array() });
    }

    const { email, password } = req.body;

    this.logger.debug('New request to login a user', {
      email,
      password,
    });

    //check if username(email) exists in database
    //compare password
    //generate tokens
    //add token to the cookies
    //return the response id.

    try {
      const user = await this.userService.findByEmail(email);

      if (!user) {
        const error = createHttpError(400, 'Email or password does not match.');
        next(error);
        return;
      }

      const passwordMatch = await this.credentialService.comparePassword(
        password,
        user.password
      );

      if (!passwordMatch) {
        const error = createHttpError(400, 'Email or password does not match.');
        next(error);
        return;
      }

      const payload: JwtPayload = {
        sub: String(user.id),
        role: 'customer',
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      res.cookie('accessToken', accessToken, {
        domain: 'localhost',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
      });

      const newRefreshToken = await this.tokenService.persistRefreshToken(user);

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
      });

      //res = this.bhund(res, accessToken);
      //console.log('bhund', res.cookie);
      //res = this.bhund(res, refreshToken);

      res.cookie('refreshToken', refreshToken, {
        domain: 'localhost',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
      });

      this.logger.info('User has been logged in', { id: user.id });

      res.json({ id: user.id });
    } catch (err) {
      next(err);
      return;
    }
  }

  async self(req: AuthRequest, res: Response) {
    const user = await this.userService.findById(Number(req.auth.sub));
    res.json({ ...user, password: undefined });
  }

  async refresh(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const payload: JwtPayload = {
        sub: req.auth.sub,
        role: req.auth.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      const user = await this.userService.findById(Number(req.auth.sub));
      if (!user) {
        const error = createHttpError(
          400,
          'User with the token could not find'
        );
        next(error);
        return;
      }

      const newRefreshToken = await this.tokenService.persistRefreshToken(user);

      //Delete old refresh token
      await this.tokenService.deleteRefreshToken(Number(req.auth.id));

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
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

      this.logger.info('User has been logged in', { id: user.id });

      res.json({ id: user.id });
    } catch (err) {}
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      console.log(req.auth);

      await this.tokenService.deleteRefreshToken(Number(req.auth.id));

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.json({});
    } catch (err) {
      next(err);
      return;
    }
  }

  bhund(res: Response, token: string) {
    res.cookie('accessToken', token, {
      domain: 'localhost',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
    });
    return res;
  }
}
