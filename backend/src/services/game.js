import prisma from '../utils/prisma.js';

export const findAll = async () => {
  try {
    return await prisma.game.findMany({
      omit: {
        playerId: true,
        drawId: true,
      },
      include: {
        player: {
          omit: {
            password: true,
            refreshToken: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        draw: true,
      },
    });
  } catch (error) {
    return { error: 'Ocorreu um erro ao consultar os jogos' };
  }
};

export const findOne = async ({ id, playerId }) => {
  try {
    return await prisma.game.findUnique({
      where: { id, playerId },
      omit: {
        playerId: true,
        drawId: true,
      },
      include: {
        player: {
          omit: {
            password: true,
            refreshToken: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        draw: true,
      },
    });
  } catch (error) {
    return { error: 'Ocorreu um erro ao consultar o jogo' };
  }
};

export const store = async ({ gameData, drawData }) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const draw = await tx.draw.upsert({
        where: { contestNumber: drawData.contestNumber },
        update: {},
        create: { ...drawData },
      });

      return await tx.game.create({
        data: { ...gameData, drawId: draw.id },
      });
    });
  } catch (error) {
    return { error: 'Ocorreu um erro ao cadastrar o jogo' };
  }
};

export const update = async (data, id) => {
  try {
    return await prisma.game.update({ data, where: { id } });
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar o jogo' };
  }
};

export const destroy = async (id) => {
  try {
    return await prisma.game.delete({ where: { id } });
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar o jogo' };
  }
};
