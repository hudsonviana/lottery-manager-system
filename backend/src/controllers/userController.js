import * as userService from '../services/user.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { z } from 'zod';

export const getAllUsers = async (req, res) => {
  const auth = req.auth;
  const users = await userService.findAll();

  if (users.error) {
    return res.status(500).json({ error: users.error });
  }

  // res.json({ users, auth });
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

  res.json({ user: userData, auth });
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

  res.json({ userGames, auth });
};

export const addUser = async (req, res) => {
  // const auth = req.auth;

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

  // const tempPassword = crypto.randomBytes(3).toString('hex');
  const tempPassword = 'aabbcc';

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(tempPassword, salt);

  const newUser = await userService.store({ ...body.data, password: hashedPassword });

  if (newUser.error) {
    return res.status(500).json({ error: newUser.error });
  }

  const { password, refreshToken, ...userCreated } = newUser;

  res.status(201).json({ user: userCreated, tempPassword });
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
