import { Router } from 'express';
import * as admin from '../middlewares/admin.js';
import * as auth from '../middlewares/auth.js';
import * as authController from '../controllers/authController.js';
import * as userController from '../controllers/userController.js';

const router = Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

router.get('/users', auth.authentication, userController.getAll);
router.get('/users/:id', auth.authentication, userController.getUser);
router.put('/users/:id', auth.authentication, userController.updateUser);
router.delete('/users/:id', admin.authentication, userController.deleteUser);

export default router;
