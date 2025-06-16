import express, { Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import logger from '../config/logger';
import registerValidator from '../middlwares/register-validator';
import { TokenService } from '../services/TokenService';
import { RefreshToken } from '../entity/RefreshToken';
import loginValidator from '../validators/login-validator';
import { CredentialService } from '../services/CredentialService';
import authenticate from '../middlwares/authenticate';
import { AuthRequest } from '../types';
import validateRefreshToken from '../middlwares/validateRefreshToken';
import parseRefreshToken from '../middlwares/parseRefreshToken';

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepository);
const credentialService = new CredentialService();

const authController = new AuthController(
  userService,
  logger,
  tokenService,
  credentialService
);

router.post('/register', registerValidator, (req, res, next) => {
  authController.register(req, res, next);
});

router.post('/login', loginValidator, (req, res, next) => {
  authController.login(req, res, next);
});

router.get('/self', authenticate, (req, res) => {
  authController.self(req as AuthRequest, res);
});

router.post(
  '/refresh',
  validateRefreshToken,
  (req: Request, res: Response, next) => {
    authController.refresh(req as AuthRequest, res, next);
  }
);

router.post(
  '/logout',
  parseRefreshToken,
  (req: Request, res: Response, next) => {
    authController.logout(req as AuthRequest, res, next);
  }
);

export default router;
