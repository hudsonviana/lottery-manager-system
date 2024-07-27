import { PrismaClient } from '@prisma/client';
import * as drawService from '../services/draw.js';

const prisma = new PrismaClient();

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
    const draw = await drawService.store(drawData);
    const drawId = draw.existingDraw ? draw.existingDraw.id : draw.id;

    return await prisma.game.create({ data: { ...gameData, drawId } });
  } catch (error) {
    return { error: 'Ocorreu um erro ao cadastrar o jogo' };
  }
};

export const update = async (data, { playerId, id }) => {
  try {
    return await prisma.game.update({ data, where: { playerId, id } });
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar o jogo' };
  }
};

export const destroy = async ({ playerId, id }) => {
  try {
    return await prisma.game.delete({ where: { playerId, id } });
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar o jogo' };
  }
};
