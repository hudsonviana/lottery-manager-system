import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';

const router = Router();

router.post('/auth/register', userController.register);
router.post('/auth/login', authController.login);

export default router;
