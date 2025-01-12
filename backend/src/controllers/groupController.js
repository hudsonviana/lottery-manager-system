import * as groupService from '../services/group.js';
import { z } from 'zod';

export const getAllGroups = async (req, res) => {
  const groups = await groupService.findAll();

  if (groups.error) {
    return res.status(500).json({ error: groups.error });
  }

  res.json({ groups });
};

export const getGroup = async (req, res) => {
  const { id } = req.params;

  const group = await groupService.findOne({ id });

  if (!group) {
    return res.status(404).json({ error: 'Grupo não encontrado' });
  }

  if (group?.error) {
    return res.status(500).json({ error: group.error });
  }

  res.json({ group });
};

export const addGroup = async (req, res) => {
  const auth = req.auth;

  const addGroupSchema = z.object({
    name: z.string().min(2).max(30),
    description: z.string().optional(),
    isPool: z.boolean(),
    theme: z
      .enum(['gray', 'blue', 'green', 'red', 'yellow', 'purple', 'orange'])
      .optional()
      .default('gray'),
  });

  const body = addGroupSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }

  const newGroup = await groupService.store({ ...body.data, creatorId: auth.id });

  if (newGroup.error) {
    return res.status(500).json({ error: newGroup.error });
  }

  res.status(201).json({ group: newGroup });
};

export const updateGroup = async (req, res) => {
  const auth = req.auth;
  const { id } = req.params;

  if (req.body.creator.id !== auth.id) {
    return res
      .status(403)
      .json({ error: 'Não é permitido atualizar um grupo criado por outro usuário' });
  }

  const updateGroupSchema = z.object({
    name: z
      .string({ message: 'O nome do grupo é obrigatório' })
      .max(50, { message: 'O nome do grupo deve ter no máximo 50 caracteres' }),
    description: z.string().optional(),
    isPool: z.boolean(),
    theme: z.enum(['gray', 'blue', 'green', 'red', 'yellow', 'purple', 'orange']).optional(),
  });

  const body = updateGroupSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }

  const updatedGroup = await groupService.update(body.data, id);

  if (updatedGroup.error) {
    return res.status(500).json({ error: updatedGroup.error });
  }

  res.json({ updatedGroup });
};

export const deleteGroup = async (req, res) => {
  const auth = req.auth;
  const { id } = req.params;

  const group = await groupService.findOne({ id });

  if (!group) {
    return res.status(404).json({ error: 'Grupo não encontrado' });
  }

  if (auth.id !== group.creatorId) {
    return res
      .status(403)
      .json({ error: 'Não é permitido deletar um grupo criado por outro usuário' });
  }

  const [_, deletedGroup] = await groupService.destroy(id);

  if (deletedGroup.error) {
    return res.status(500).json({ error: deletedGroup.error });
  }

  res.json({ deletedGroup });
};
