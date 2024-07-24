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
    });
  } catch (error) {
    return { error: 'Ocorreu um erro ao consultar o usuário' };
  }
};

export const findGamesByUser = async ({ id, email }) => {
  try {
    return await prisma.user.findUnique({
      where: { id, email },
      omit: {
        password: true,
      },
      include: {
        games: {
          omit: {
            playerId: true,
            drawId: true,
          },
          include: {
            draw: true,
          },
        },
      },
    });
  } catch (error) {
    return { error: 'Ocorreu um erro ao consultar os jogos do usuário' };
  }
};

export const store = async (data) => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });

    if (existingUser) {
      return { error: 'Email já cadastrado no sistema' };
    }

    return await prisma.user.create({ data: data });
  } catch (error) {
    return { error: 'Ocorreu um erro ao cadastrar o usuário' };
  }
};

export const update = async (data, id) => {
  try {
    return await prisma.user.update({ data: data, where: { id: id } });
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar o usuário' };
  }
};

export const destroy = async (id) => {
  try {
    return await prisma.user.delete({ where: { id: id } });
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar o usuário' };
  }
};
