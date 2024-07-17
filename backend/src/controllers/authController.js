import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import * as userService from '../services/user.js';

export const register = async (req, res) => {
  const createUserSchema = z
    .object({
      firstName: z
        .string({ message: 'O nome é obrigatório' })
        .min(3, { message: 'O nome precisa ter pelo menos 3 caracteres' }),
      lastName: z.string({ message: 'Caracteres não permitidos' }).optional(),
      email: z.string({ message: 'O email é obrigatório' }).email({ message: 'Email inválido' }),
      password: z
        .string({ message: 'A senha é obrigatória' })
        .min(6, { message: 'A senha precisa conter pelo menos 6 caracteres' }),
      confirmPassword: z.string({ message: 'A confirmação de senha é obrigatória' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Senhas não conferem',
      path: ['confirmPassword'],
    });

  const body = createUserSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(body.data.password, salt);

  const { confirmPassword, ...userData } = body.data;

  const newUser = await userService.store({ ...userData, password: hashedPassword });

  if (newUser.error) {
    return res.status(500).json({ error: newUser.error });
  }

  res.status(201).json({ user: newUser });
};

export const login = async (req, res) => {
  const credentialsSchema = z.object({
    email: z.string({ message: 'O email é obrigatório' }),
    password: z.string({ message: 'A senha é obrigatória' }),
  });

  const body = credentialsSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }

  const user = await userService.findOne({ email: body.data.email });

  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const passwordMatch = await bcrypt.compare(body.data.password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const { password, ...auth } = user;

  const token = jwt.sign({ auth }, process.env.SECRET_KEY, { expiresIn: '1d' });

  res.json({ token });
};
