import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import * as user from '../services/user.js';

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
      // .regex(/[A-Z]/, { message: 'A senha precisa conter pelo menos uma letra maiúscula' })
      // .regex(/[a-z]/, { message: 'A senha precisa conter pelo menos uma letra minúscula' })
      // .regex(/\d/, { message: 'A senha precisa conter pelo menos um número' })
      // .regex(/[!@#$%^&*+-.]/, {
      //   message: 'A senha precisa conter pelo menos um caracter especial',
      // }),
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

  const newUser = await user.store({ ...userData, password: hashedPassword });

  if (newUser.error) {
    return res.status(400).json({ error: newUser.error });
  }

  res.status(201).json({ user: newUser });
};

export const login = async (req, res) => {
  // Test
  const user = {
    id: '123abc',
    firstName: 'hudson',
    lastName: 'Andrade',
    email: 'hudson.teste@testando.com',
    password: '$2b$12$6FLHtNDNXbY/VrnirtptUe/BCqt18BgNeP8MjeojkK10DFFzf4h5K',
  };

  const credentialsSchema = z.object({
    email: z.string({ message: 'O email é obrigatório' }),
    password: z.string({ message: 'A senha é obrigatória' }),
  });

  const body = credentialsSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }

  // check if password match
  const checkPassword = await bcrypt.compare(body.data.password, user.password);

  if (!checkPassword) {
    return res.status(403).json({ errors: 'Acesso não autorizado' });
  }

  const secret = process.env.SECRET_KEY;
  const token = jwt.sign({ id: user.id }, secret);

  const { password, ...userData } = user;

  res.json({ user: userData, token });
};
