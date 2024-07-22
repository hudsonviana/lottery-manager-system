import { PrismaClient } from '@prisma/client';
import * as drawService from '../services/draw.js';

const prisma = new PrismaClient();

export const findAll = async (playerId) => {
  try {
    return await prisma.game.findMany({ where: { playerId } });
  } catch (error) {
    return { error: 'Ocorreu um erro ao consultar os sorteios' };
  }
};

export const findOne = async () => {};

export const store = async ({ gameData, drawData }) => {
  try {
    const draw = await drawService.store(drawData);
    const drawId = draw.existingDraw ? draw.existingDraw.id : draw.id;

    return await prisma.game.create({ data: { ...gameData, drawId } });
  } catch (error) {
    return { error: 'Ocorreu um erro ao cadastrar o jogo' };
  }
};

export const update = async () => {};

export const destroy = async () => {};
