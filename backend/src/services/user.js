import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAll = async () => {
  try {
    return await prisma.user.findMany();
  } catch (error) {
    return false;
  }
};

export const getOne = async (id) => {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch (error) {
    return false;
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
