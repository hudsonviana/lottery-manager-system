import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findAll = async () => {
  try {
    return await prisma.draw.findMany();
  } catch (error) {
    return { error: 'Ocorreu um erro ao consultar os sorteios' };
  }
};

export const findOne = async ({ id, contestNumber }) => {
  try {
    return await prisma.draw.findUnique({ where: { id, contestNumber } });
  } catch (error) {
    return { error: 'Ocorreu um erro ao consultar o sorteio' };
  }
};

export const store = async (data) => {
  try {
    const existingDraw = await prisma.draw.findUnique({
      where: { contestNumber: data.contestNumber },
    });

    if (existingDraw) {
      return { error: 'Sorteio já cadastrado no sistema' };
    }

    return await prisma.draw.create({ data: data });
  } catch (error) {
    return { error: 'Ocorreu um erro ao cadastrar o sorteio' };
  }
};

export const update = async (data, { id, contestNumber }) => {
  try {
    return await prisma.draw.update({ data: data, where: { id, contestNumber } });
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar o sorteio' };
  }
};

export const destroy = async () => {};
