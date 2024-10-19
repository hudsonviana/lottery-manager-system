import { Router } from 'express';
import * as admin from '../middlewares/admin.js';
import * as auth from '../middlewares/auth.js';
import * as authController from '../controllers/authController.js';
import * as userController from '../controllers/userController.js';
import * as drawController from '../controllers/drawController.js';
import * as gameController from '../controllers/gameController.js';

const router = Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.put('/auth/logout', authController.logout);
router.get('/auth/refresh', authController.refresh);
router.post('/auth/:id/changepassword', auth.authentication, authController.changePassword);

router.get('/users', admin.authentication, userController.getAllUsers);
router.get('/users/:id', auth.authentication, userController.getUser);
router.get('/users/:id/games', auth.authentication, userController.getUserGames);
router.post('/users', admin.authentication, userController.addUser);
router.put('/users/:id', auth.authentication, userController.updateUser);
router.delete('/users/:id', admin.authentication, userController.deleteUser);

router.get('/draws', auth.authentication, drawController.getAllDraws);
router.get('/draws/:identifier', auth.authentication, drawController.getDraw);
router.get('/draws/:identifier/games', admin.authentication, drawController.getDrawGames);
router.post('/draws', auth.authentication, drawController.addDraw);
router.put('/draws/:identifier', auth.authentication, drawController.updateDraw);
router.delete('/draws/:identifier', auth.authentication, drawController.deleteDraw);

router.get('/games', admin.authentication, gameController.getAllGames);
router.get('/users/:playerId/games/:id', auth.authentication, gameController.getGame);
router.post('/users/:playerId/games', auth.authentication, gameController.addGame);
router.put('/users/:playerId/games/:id', auth.authentication, gameController.updateGame);
router.delete('/users/:playerId/games/:id', auth.authentication, gameController.deleteGame);

export default router;

// https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/1234
