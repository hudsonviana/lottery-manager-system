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
    const existUser = await prisma.user.findUnique(data.email);

    if (existUser) return false;
    // Parei aqui

    return await prisma.user.create({ data });
  } catch (error) {
    return false;
  }
};

export const update = async () => {};

export const destroy = async () => {};
