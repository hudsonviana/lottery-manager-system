import * as drawService from '../services/draw.js';
import { isUUID } from '../utils/checkUuid.js';
import { z } from 'zod';

export const getAllDraws = async (req, res) => {
  const auth = req.auth;
  const draws = await drawService.findAll();

  if (draws.error) {
    return res.status(500).json({ error: draws.error });
  }

  res.json({ draws, auth });
};

export const getDraw = async (req, res) => {
  const auth = req.auth;
  const { identifier } = req.params;

  const searchParams = isUUID(identifier)
    ? { id: identifier }
    : { contestNumber: parseInt(identifier) };

  const draw = await drawService.findOne(searchParams);

  if (!draw) {
    return res.status(404).json({ error: 'Sorteio não encontrado' });
  }

  if (draw?.error) {
    return res.status(500).json({ error: draw.error });
  }

  res.json({ draw, auth });
};

export const addDraw = async (req, res) => {
  const auth = req.auth;

  const addDrawSchema = z.object({
    lotteryType: z.enum(['MEGASENA', 'QUINA', 'LOTOFACIL', 'TIMEMANIA', 'LOTOMANIA']),
    contestNumber: z.number(),
    drawDate: z.string().datetime(),
    status: z.enum(['DRAWN', 'PENDING']),
    drawnNumbers: z.string(),
    prize: z.string(),
    accumulated: z.boolean(),
  });

  const body = addDrawSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }

  const newDraw = await drawService.store(body.data);

  if (newDraw.error) {
    return res.status(500).json({ error: newDraw.error });
  }

  res.status(201).json({ draw: newDraw, auth });
};
