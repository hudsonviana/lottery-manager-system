import { Router } from 'express';
import * as admin from '../middlewares/admin.js';
import * as auth from '../middlewares/auth.js';
import * as authController from '../controllers/authController.js';
import * as userController from '../controllers/userController.js';
import * as drawController from '../controllers/drawController.js';

const router = Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/changepassword/:id', auth.authentication, authController.changePassword);
router.put('/auth/logout', auth.authentication, authController.logout);

router.get('/users', admin.authentication, userController.getAllUsers);
router.get('/users/:id', auth.authentication, userController.getUser);
router.post('/users', admin.authentication, userController.addUser);
router.put('/users/:id', auth.authentication, userController.updateUser);
router.delete('/users/:id', admin.authentication, userController.deleteUser);

router.get('/draws', auth.authentication, drawController.getAllDraws);
router.get('/draws/:identifier', auth.authentication, drawController.getDraw);
router.post('/draws', auth.authentication, drawController.addDraw);

export default router;

// https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/1234
