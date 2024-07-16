import { Router } from 'express';
import { authentication } from '../middlewares/auth.js';
import * as authController from '../controllers/authController.js';
import * as userController from '../controllers/userController.js';

const router = Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

router.get('/users', authentication, userController.getAll);
router.get('/users/:id', authentication, userController.getUser);

export default router;
