import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import * as userService from '../services/user.js';

const isProduction = process.env.NODE_ENV === 'production';

export const register = async (req, res) => {
  const registerUserSchema = z
    .object({
      firstName: z
        .string({ message: 'O nome é obrigatório' })
        .min(3, { message: 'O nome precisa ter pelo menos 3 caracteres' }),
      lastName: z.string({ message: 'Caracteres não permitidos' }).optional(),
      email: z.string({ message: 'O email é obrigatório' }).email({ message: 'Email inválido' }),
      password: z
        .string({ message: 'A senha é obrigatória' })
        .min(6, { message: 'A senha precisa ter pelo menos 6 caracteres' }),
      confirmPassword: z.string({ message: 'A confirmação de senha é obrigatória' }),
      role: z.enum(['USER'], { message: 'Perfil inválido' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'As senhas informadas não coincidem',
      path: ['confirmPassword'],
    });

  const body = registerUserSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(body.data.password, salt);

  const { confirmPassword, ...newUserData } = body.data;

  const newUser = await userService.store({ ...newUserData, password: hashedPassword });

  if (newUser.error) {
    return res.status(500).json({ error: newUser.error });
  }

  const { password, refreshToken, ...userRegistered } = newUser;

  res.status(201).json({ userRegistered });
};

const generateAccessToken = (auth) => {
  return jwt.sign({ auth }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '15m' });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '1h' });
};

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
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 dia em milissegundos
  });

  res.json({ accessToken });
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh Token não detecado' });
  }

  try {
    const { id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);

    const user = await userService.findByToken({ id, refreshToken });

    if (!user) {
      return res.status(401).json({ error: 'Refresh Token: Usuário não encontrado' });
    }

    const { refreshToken: ignore, password, createdAt, updatedAt, ...auth } = user;

    const newAccessToken = generateAccessToken(auth);

    res.json({ accessToken: newAccessToken, auth });
  } catch (error) {
    res.status(401).json({ error: 'Refresh Token inválido' });
  }
};

export const logout = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(500).json({ error: 'Erro ao realizar o Logout: refreshToken não detectado' });
  }

  const logoutSchema = z.object({
    id: z
      .string({ message: 'Identificador do usuário não detectado' })
      .uuid({ message: 'Identificador do usuário inválido' }),
  });

  const body = logoutSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }

  try {
    const revokeRefreshToken = await userService.update({ refreshToken: null }, body.data.id);

    if (revokeRefreshToken.error) {
      return res.status(500).json({ error: 'Erro ao revogar o Refresh Token' });
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
    });

    res.json({ logout: 'Aplicação encerrada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar o Logout' });
  }
};

export const changePassword = async (req, res) => {
  const auth = req.auth;
  const { id } = req.params;

  if (auth.id !== id) {
    return res.status(403).json({ error: 'Não é permitido mudar a senha de outro usuário' });
  }

  const changePasswordSchema = z
    .object({
      currentPassword: z.string({ message: 'A senha atual é obrigatória' }),
      newPassword: z
        .string({ message: 'A nova senha é obrigatória' })
        .min(6, { message: 'A nova senha precisa ter pelo menos 6 caracteres' }),
      confirmNewPassword: z.string({ message: 'A confirmação de senha é obrigatória' }),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: 'As senhas não coincidem',
      path: ['confirmNewPassword'],
    });

  const body = changePasswordSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }

  const user = await userService.findOne({ id });

  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  const currentPasswordMatch = await bcrypt.compare(body.data.currentPassword, user.password);

  if (!currentPasswordMatch) {
    return res.status(401).json({ error: 'Senha atual incorreta' });
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(body.data.newPassword, salt);

  const updatedUserPassword = await userService.update({ password: hashedPassword }, id);

  if (updatedUserPassword.error) {
    return res.status(500).json({ error: 'Erro ao atualizar a senha' });
  }

  res.json({ updatedUserPassword });
};

// export const forgotPassword = async (req, res, next) => {};
// export const resetPassword = async (req, res, next) => {};
