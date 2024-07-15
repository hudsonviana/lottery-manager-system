import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAll = async () => {
  try {
    return await prisma.user.findMany();
  } catch (error) {
    return { error: 'Ocorreu um erro ao consultar os usuários' };
  }
};

export const getOne = async ({ id, email }) => {
  try {
    return await prisma.user.findUnique({ where: { id, email } });
  } catch (error) {
    return { error: 'Ocorreu um erro ao consultar um usuário' };
  }
};

export const store = async (data) => {
  try {
    const checkExistUser = await prisma.user.findUnique({ where: { email: data.email } });

    if (checkExistUser) {
      return { error: 'Email já cadastrado no sistema' };
    }

    return await prisma.user.create({ data: data });
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar um usuário' };
  }
};

export const update = async () => {};

export const destroy = async () => {};
