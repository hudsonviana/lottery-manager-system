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
  const addGroupSchema = z.object({
    name: z.string().max(50),
    description: z.string().optional(),
    isPool: z.boolean().optional(),
    creatorId: z.string(),
  });

  const body = addGroupSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }

  const newGroup = await groupService.store(body.data);

  if (newGroup.error) {
    return res.status(500).json({ error: newGroup.error });
  }

  res.status(201).json({ group: newGroup });
};

export const updateGroup = async (req, res) => {
  const { id } = req.params;

  const updateGroupSchema = z.object({
    name: z.string().max(50).optional(),
    description: z.string().optional(),
    isPool: z.boolean().optional(),
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

  const deletedGroup = await groupService.destroy(id, auth.id);

  if (deletedGroup.error) {
    return res.status(500).json({ error: deletedGroup.error });
  }

  res.json({ deletedGroup });
};
