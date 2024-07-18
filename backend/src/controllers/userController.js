import { z } from 'zod';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import * as userService from '../services/user.js';

export const getAllUsers = async (req, res) => {
  const auth = req.auth;
  const users = await userService.findAll();

  if (users.error) {
    return res.status(500).json({ error: users.error });
  }

  res.json({ users, auth });
};

export const getUser = async (req, res) => {
  const auth = req.auth;
  const { id } = req.params;

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

export const addUser = async (req, res) => {
  const auth = req.auth;

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

  res.status(201).json({ user: newUser, tempPassword, auth });
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

  res.json({ user: updatedUser, auth });
};

export const deleteUser = async (req, res) => {
  const auth = req.auth;
  const { id } = req.params;

  const deletedUser = await userService.destroy(id);

  if (deletedUser.error) {
    return res.status(500).json({ error: deletedUser.error });
  }

  res.json({ user: deletedUser, auth });
};
