import { Router } from 'express';
import * as admin from '../middlewares/admin.js';
import * as auth from '../middlewares/auth.js';
import * as appController from '../controllers/appController.js';
import * as authController from '../controllers/authController.js';
import * as userController from '../controllers/userController.js';
import * as drawController from '../controllers/drawController.js';
import * as gameController from '../controllers/gameController.js';
import * as groupController from '../controllers/groupController.js';

const router = Router();

router.post('/app/shutdown', appController.shutdownApplication);

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.put('/auth/logout', authController.logout);
router.get('/auth/refresh', authController.refresh);
router.post('/auth/:id/changepassword', auth.authentication, authController.changePassword);

router.get('/users', admin.authentication, userController.getAllUsers);
router.get('/users/:id', auth.authentication, userController.getUser);
router.get('/users/:id/games', auth.authentication, userController.getUserGames);
router.get('/users/:id/draws/:drawId/games', auth.authentication, userController.getUserDrawGames);
router.post('/users', admin.authentication, userController.addUser);
router.put('/users/:id', auth.authentication, userController.updateUser);
router.delete('/users/:id', admin.authentication, userController.deleteUser);

router.get('/draws', auth.authentication, drawController.getAllDraws);
router.get('/draws/users/:playerId', auth.authentication, drawController.getAllDrawsOfUser);
router.get('/draws/:identifier', auth.authentication, drawController.getDraw);
router.get('/draws/:identifier/games', admin.authentication, drawController.getDrawGames);
router.post('/draws', auth.authentication, drawController.addDraw);
router.put('/draws/:identifier', auth.authentication, drawController.updateDraw);
router.delete('/draws/:id', auth.authentication, drawController.deleteDraw);
router.get(
  '/draws/:id/users/:playerId/games',
  auth.authentication,
  drawController.getDrawWithGamesOfUser
);

router.get('/games', admin.authentication, gameController.getAllGames);
router.get('/games/users/:playerId', auth.authentication, gameController.getAllGamesOfUser);
router.get('/games/:id/users/:playerId', auth.authentication, gameController.getGame);
router.post('/games/users/:playerId', auth.authentication, gameController.addGame);
router.put('/games/:id/users/:playerId', auth.authentication, gameController.updateGame);
router.delete('/games/:id/users/:playerId', auth.authentication, gameController.deleteGame);

router.get('/groups', auth.authentication, groupController.getAllGroups);
router.get('/groups/:id', auth.authentication, groupController.getGroup);
router.post('/groups', auth.authentication, groupController.addGroup);
router.put('/groups/:id', auth.authentication, groupController.updateGroup);
router.delete('/groups/:id', auth.authentication, groupController.deleteGroup);

export default router;

// https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/1234
