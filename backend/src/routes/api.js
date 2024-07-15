import { Router } from 'express';
import * as userController from '../controllers/userController.js';

const router = Router();

router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);

export default router;
