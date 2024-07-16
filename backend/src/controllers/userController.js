import 'dotenv/config';

import * as userService from '../services/user.js';

export const getAll = async (req, res) => {
  const users = await userService.findAll();

  if (users.error) {
    return res.status(500).json({ error: users.error });
  }

  res.json({ users, auth: req.auth });
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await userService.findOne({ id });

  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  if (user?.error) {
    return res.status(500).json({ error: user.error });
  }

  const { password, ...userData } = user;

  res.json({ user: userData, auth: req.auth });
};
