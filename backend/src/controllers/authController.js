import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import * as userService from '../services/user.js';

export const login = async (req, res) => {
  const credentialsSchema = z.object({
    email: z.string({ message: 'O email é obrigatório' }),
    password: z.string({ message: 'A senha é obrigatória' }),
  });

  const body = credentialsSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }

  const user = await userService.getOne({ email: body.data.email });

  if (!user) {
    return res.status(403).json({ error: 'Credenciais inválidas' });
  }

  const checkPassword = await bcrypt.compare(body.data.password, user.password);

  if (!checkPassword) {
    return res.status(403).json({ error: 'Credenciais inválidas' });
  }

  const secret = process.env.SECRET_KEY;
  const token = jwt.sign({ id: user.id }, secret);

  const { password, ...userData } = user;

  res.json({ user: userData, token });
};
