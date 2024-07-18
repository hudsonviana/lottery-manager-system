import { z } from 'zod';

import * as userService from '../services/user.js';

export const getAll = async (req, res) => {
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

export const updateUser = async (req, res) => {
  const auth = req.auth;
  const { id } = req.params;

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
