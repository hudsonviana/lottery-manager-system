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

// Ver: https://chatgpt.com/c/b831e9da-977c-4f1f-9d64-89e83dcfb472

export const login = async (req, res) => {
  const credentialsSchema = z.object({
    email: z.string().min(1, { message: 'O email é obrigatório' }),
    password: z.string().min(1, { message: 'A senha é obrigatória' }),
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

  const { refreshToken: ignore, password, createdAt, updatedAt, ...auth } = user;

  const accessToken = generateAccessToken(auth);
  const refreshToken = generateRefreshToken(user.id);

  const storeRefreshToken = await userService.update({ refreshToken }, user.id);

  if (storeRefreshToken.error) {
    return res.status(500).json({ error: 'Erro ao gravar o refresh Token' });
  }

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true em produção
    sameSite: 'Strict', // Evita envio do cookie em requisições cross-site
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 diass
  });

  res.json({ accessToken });
};

export const refreshToken = async (req, res) => {
  // const refreshTokenSchema = z.object({
  //   refreshToken: z.string({ message: 'Token não detectado' }),
  // });

  // const body = refreshTokenSchema.safeParse(req.body);

  // if (!body.success) {
  //   return res.status(400).json({ errors: body.error.errors });
  // }

  // const { refreshToken } = body.data;

  const refreshToken = req.cookies.refreshToken; // Obter o refreshToken do cookie

  if (!refreshToken) {
    return res.status(400).json({ error: 'Token não detecado' });
  }

  try {
    const { id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);

    const user = await userService.findByToken({ id, refreshToken });

    if (!user) {
      res.status(401).json({ error: 'Refresh Token inválido' });
    }

    const { refreshToken: ignore, password, createdAt, updatedAt, ...auth } = user;

    const newAccessToken = generateAccessToken(auth);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ error: 'Refresh Token inválido' });
  }
};

export const logout = async (req, res) => {
  const logoutSchema = z.object({
    id: z
      .string({ message: 'Identificador do usuário não detectado' })
      .uuid({ message: 'Identificador do usuário inválido' }),
  });

  const body = logoutSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }

  const { id } = body.data;

  try {
    const revokeRefreshToken = await userService.update({ refreshToken: null }, id);

    if (revokeRefreshToken.error) {
      return res.status(500).json({ error: 'Erro ao remover Refresh Token' });
    }

    res.clearCookie(
      ('refreshToken',
      {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
      })
    );

    res.json({ logout: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer o logout' });
  }
};

export const changePassword = async (req, res) => {
  const auth = req.auth;
  const { id } = req.params;

  if (auth.id !== id) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const changePasswordSchema = z
    .object({
      password: z
        .string({ message: 'A senha é obrigatória' })
        .min(6, { message: 'A senha precisa conter pelo menos 6 caracteres' }),
      confirmPassword: z.string({ message: 'A confirmação de senha é obrigatória' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Senhas não conferem',
      path: ['confirmPassword'],
    });

  const body = changePasswordSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(body.data.password, salt);

  const updatedUserPassword = await userService.update({ password: hashedPassword }, id);

  if (updatedUserPassword.error) {
    return res.status(500).json({ error: updatedUserPassword.error });
  }

  res.json({ user: updatedUserPassword, auth });
};

const generateAccessToken = (auth) => {
  return jwt.sign({ auth }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '5m' });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '1h' });
};

// esta função não é compatível com a funcionalidade de refresh Token
// export const validateToken = async (req, res) => {
//   const token = req.body.token;
//   try {
//     const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS);
//     return res.json({ user: decoded.auth });
//   } catch (error) {
//     res.status(401).json({ error: 'Token inválido' });
//   }
// };

// // esta função não é compatível com a funcionalidade de refresh Token
// export const logout = async (req, res) => {
//   const auth = req.auth;

//   const authHeader = req.headers['authorization'];
//   jwt.sign(authHeader, '', { expiresIn: 1 }, (logout, err) => {
//     if (!logout) {
//       return res.send({ msg: err.message });
//     }
//     res.send({ status: 'deslogado', auth });
//   });
// };

// export const logout = async (req, res) => {
//   const token = req.headers['authorization'].split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);
//     decoded.exp = Math.floor(Date.now() / 1000) - 1; // Data de expiração no passado
//     const updatedToken = jwt.sign(decoded, process.env.SECRET_KEY);
//     res.json({ message: 'Logout realizado com sucesso!', token: updatedToken });
//   } catch (error) {
//     res.status(400).json({ error: 'Invalid token' });
//   }
// };

// export const forgotPassword = async (req, res, next) => {};

// export const resetPassword = async (req, res, next) => {};
