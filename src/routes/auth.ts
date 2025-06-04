import express from 'express';
import { AuthController } from '../controllers/AuthController';

const router = express.Router();
const authController = new AuthController();

router.post('/register', (req, res, next) => {
  authController.register(req, res);
});

export default router;
