import * as userService from '../services/user.js';
import sendEmail from '../mail/mailer.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { z } from 'zod';

export const getAllUsers = async (req, res) => {
  const users = await userService.findAll();

  if (users.error) {
    return res.status(500).json({ error: users.error });
  }

  res.json({ users });
};

export const getUser = async (req, res) => {
  const auth = req.auth;
  const { id } = req.params;

  if (auth.role !== 'ADMIN' && auth.id !== id) {
    return res.status(403).json({ error: 'Acesso não autorizado' });
  }

  const user = await userService.findOne({ id });

  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  if (user?.error) {
    return res.status(500).json({ error: user.error });
  }

  const { password, ...userData } = user;

  res.json({ user: userData });
};

export const getUserGames = async (req, res) => {
  const auth = req.auth;
  const { id } = req.params;

  if (auth.role !== 'ADMIN' && auth.id !== id) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const userGames = await userService.findGamesByUser({ id });

  if (!userGames) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  if (userGames?.error) {
    return res.status(500).json({ error: userGames.error });
  }

  res.json({ userGames });
};

export const getUserDrawGames = async (req, res) => {
  const auth = req.auth;
  const { id, drawId } = req.params;

  if (auth.id !== id) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const userDrawGames = await userService.findGamesByUserAndDraw({ id, drawId });

  if (!userDrawGames) {
    return res.status(404).json({ error: 'Jogos não encontrados para o sorteio indicado' });
  }

  if (userDrawGames?.error) {
    return res.status(500).json({ error: userDrawGames.error });
  }

  res.json(userDrawGames);
};

export const addUser = async (req, res) => {
  const addUserSchema = z.object({
    firstName: z
      .string({ message: 'O nome é obrigatório' })
      .min(3, { message: 'O nome precisa ter pelo menos 3 caracteres' }),
    lastName: z.string({ message: 'Caracteres não permitidos' }).optional(),
    email: z.string({ message: 'O email é obrigatório' }).email({ message: 'Email inválido' }),
    role: z.enum(['USER', 'ADMIN'], { message: 'Perfil inválido' }),
  });

  const body = addUserSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }

  const tempPassword = crypto.randomBytes(3).toString('hex');
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(tempPassword, salt);

  const newUser = await userService.store({ ...body.data, password: hashedPassword });

  if (newUser.error) {
    return res.status(500).json({ error: newUser.error });
  }

  const { password, refreshToken, ...userCreated } = newUser;

  res.status(201).json({ user: userCreated });

  sendEmail({
    to: body.data.email,
    subject: `Bem-vindo (ou vinda) ao SiGALF, ${body.data.firstName}!`,
    text: `A sua senha de acesso provisória é: ${tempPassword}`,
    html: `<h2>Bem-vindo (ou vinda) ao SiGALF, ${body.data.firstName}!</h2><p style="font-size:16px;">A sua senha de acesso provisória é: <b style="font-family: Consolas;font-size:18px;">${tempPassword}</b></p>`,
  });
};

export const updateUser = async (req, res) => {
  const auth = req.auth;
  const { id } = req.params;

  if (auth.role !== 'ADMIN' && auth.id !== id) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const updateUserSchema = z.object({
    firstName: z
      .string()
      .min(3, { message: 'O nome precisa ter pelo menos 3 caracteres' })
      .optional(),
    lastName: z.string().optional(),
    email: z.string().email({ message: 'Email inválido' }).optional(),
    role: z.enum(['USER', 'ADMIN'], { message: 'Perfil inválido' }).optional(),
  });

  const body = updateUserSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }

  const updatedUser = await userService.update(body.data, id);

  if (updatedUser.error) {
    return res.status(500).json({ error: updatedUser.error });
  }

  res.json({ updatedUser });
};

export const deleteUser = async (req, res) => {
  const auth = req.auth;
  const { id } = req.params;

  if (auth.id === id) {
    return res.status(403).json({ error: 'O usuário não pode deletar a própria conta' });
  }

  const deletedUser = await userService.destroy(id);

  if (deletedUser.error) {
    return res.status(500).json({ error: deletedUser.error });
  }

  res.json({ deletedUser });
};
