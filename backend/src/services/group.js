import prisma from '../utils/prisma.js';

export const findAll = async () => {
  try {
    return await prisma.group.findMany();
  } catch (error) {
    return { error: 'Ocorreu um erro ao consultar os grupos' };
  }
};

export const findOne = async ({ id, name }) => {
  try {
    return await prisma.group.findUnique({
      where: { id, name },
    });
  } catch (error) {
    return { error: 'Ocorreu um erro ao consultar o grupo' };
  }
};

export const store = async (data) => {
  try {
    // const existingGroup = await prisma.group.findUnique({ where: { name: data.name } });
    // if (existingGroup) {
    //   return { error: 'Grupo já cadastrado no banco de dados' };
    // }

    return await prisma.group.create({ data: data });
  } catch (error) {
    return { error: 'Ocorreu um erro ao cadastrar o grupo' };
  }
};

export const update = async (data, id) => {
  try {
    return await prisma.group.update({
      data: data,
      where: { id: id },
    });
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar o grupo' };
  }
};

export const destroy = async (id, creatorId) => {
  try {
    return await prisma.group.delete({
      where: { id: id, creatorId: creatorId },
    });
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar o grupo' };
  }
};
