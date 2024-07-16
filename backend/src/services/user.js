import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findAll = async () => {
  try {
    return await prisma.user.findMany({
      omit: {
        password: true,
      },
    });
  } catch (error) {
    return { error: 'Ocorreu um erro ao consultar os usuários' };
  }
};

export const findOne = async ({ id, email }) => {
  try {
    return await prisma.user.findUnique({
      where: { id, email },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });
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
    return { error: 'Ocorreu um erro ao cadastrar o usuário' };
  }
};

export const update = async () => {};

export const destroy = async () => {};
