import express from 'express';
import { AppDataSource } from '../config/data-source';
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import createHttpError from 'http-errors';
import authenticate from '../middlwares/authenticate';
import { canAccess } from '../middlwares/canAccess';

import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { User } from '../entity/User';
import listUserValidator from '../validators/list-user-validator';
import { InternalRequest } from 'express-validator/lib/base';

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export const k = (p: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const _req = req as AuthRequest;

    const roleFromToken = _req.auth.role;
    //console.log(roleFromToken);
    //console.log(p);
    if (p != roleFromToken) {
      const error = createHttpError(403, 'you dont have enough permission');
      next(error);
    }
    next();
  };
};

/*router.post('/', authenticate, k('admin'), (req, res, next) => {
  userController.create(req, res, next);
});*/

router.post('/', authenticate, (req, res, next) => {
  userController.create(req, res, next);
});

router.get('/', listUserValidator, (req, res, next) => {
  userController.get(req, res);
});

export default router;
