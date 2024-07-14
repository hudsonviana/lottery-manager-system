import bcrypt from 'bcrypt';
import { z } from 'zod';

export const register = async (req, res) => {
  const userSchema = z.object({
    firstName: z
      .string({ message: 'O nome é obrigatório' })
      .min(3, { message: 'O nome precisa ter pelo menos 3 caracteres' }),
    lastName: z.string({ message: 'Caracteres não permitidos' }).optional(),
    email: z.string({ message: 'O email é obrigatório' }).email({ message: 'Email inválido' }),
    password: z
      .string({ message: 'A senha é obrigatória' })
      .min(6, { message: 'A senha precisa ter pelo menos 6 caracteres' }),
  });

  const body = userSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }

  const { password } = body.data;
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  res.status(201).json({
    ...body.data,
    password: hashedPassword,
  });
};

const user = {
  firstName: 'Hudson',
  lastName: 'Andrade',
  email: 'hudson.teste@testando.com',
  password: '$2b$12$6FLHtNDNXbY/VrnirtptUe/BCqt18BgNeP8MjeojkK10DFFzf4h5K',
};
