import prisma from '../utils/prisma.js';

export const findAll = async () => {
  try {
    return await prisma.draw.findMany();
  } catch (error) {
    return { error: 'Ocorreu um erro ao consultar os sorteios' };
  }
};

export const findDrawsByUser = async (playerId) => {
  try {
    return await prisma.draw.findMany({
      where: {
        games: {
          some: { playerId },
        },
      },
      include: {
        _count: {
          select: {
            games: {
              where: { playerId },
            },
          },
        },
      },
    });
  } catch (error) {
    return { error: 'Ocorreu um erro ao consultar os sorteios do usuário' };
  }
};

export const findGamesByDrawAndUser = async (id, playerId) => {
  try {
    return await prisma.draw.findUnique({
      where: { id },
      include: {
        games: {
          where: { playerId },
          select: {
            id: true,
            gameNumbers: true,
            createdAt: true,
            group: {
              select: {
                name: true,
                theme: true,
              },
            },
          },
          orderBy: [{ group: { name: 'asc' } }, { createdAt: 'asc' }],
        },
      },
    });
  } catch (error) {
    return { error: 'Ocorreu um erro ao consultar os jogos refente ao sorteio especificado' };
  }
};

export const findOne = async ({ id, contestNumber }) => {
  try {
    return await prisma.draw.findUnique({
      where: { id, contestNumber },
    });
  } catch (error) {
    return { error: 'Ocorreu um erro ao consultar o sorteio' };
  }
};

export const findGamesByDraw = async ({ id, contestNumber }) => {
  try {
    return await prisma.draw.findUnique({
      where: { id, contestNumber },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
      include: {
        games: {
          include: {
            player: {
              omit: {
                password: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
          omit: {
            playerId: true,
            drawId: true,
          },
        },
      },
    });
  } catch (error) {
    return { error: 'Ocorreu um erro ao consultar os jogos do sorteio' };
  }
};

export const store = async (data) => {
  try {
    return await prisma.draw.create({ data: data });
  } catch (error) {
    return { error: 'Ocorreu um erro ao cadastrar o sorteio' };
  }
};

export const update = async (data, { id, contestNumber }) => {
  try {
    return await prisma.draw.update({
      data: data,
      where: { id, contestNumber },
    });
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar o sorteio' };
  }
};

export const destroy = async (drawId, playerId) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const totalDeletedGames = await tx.game.deleteMany({
        where: { drawId, playerId },
      });

      const totalGamesOfDraw = await tx.game.count({
        where: { drawId },
      });

      const deletedDraw =
        totalGamesOfDraw === 0
          ? await tx.draw.delete({ where: { id: drawId } })
          : await tx.draw.findUnique({ where: { id: drawId } });

      return { deletedDraw, totalDeletedGames };
    });
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar o sorteio' };
  }
};
