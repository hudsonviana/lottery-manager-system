import * as drawService from '../services/draw.js';
import { isUUID, parseDate, validateDateFormat } from '../utils/drawHelpers.js';
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

export const getDrawGames = async (req, res) => {
  const auth = req.auth;
  const { identifier } = req.params;

  const searchParams = isUUID(identifier)
    ? { id: identifier }
    : { contestNumber: parseInt(identifier) };

  const drawWithGames = await drawService.findGamesByDraw(searchParams);

  if (!drawWithGames) {
    return res.status(404).json({ error: 'Sorteio não encontrado' });
  }

  if (drawWithGames?.error) {
    return res.status(500).json({ error: drawWithGames.error });
  }

  res.json({ drawWithGames, auth });
};

export const addDraw = async (req, res) => {
  const auth = req.auth;

  const prizeSchema = z.object({
    descricaoFaixa: z.string(),
    faixa: z.number().positive(),
    numeroDeGanhadores: z.number().nonnegative(),
    valorPremio: z.number().nonnegative(),
  });

  const addDrawSchema = z.object({
    acumulado: z.boolean().optional(),
    dataApuracao: z.string().refine(validateDateFormat, { message: 'Formato de data inválido' }),
    listaDezenas: z
      .array(z.string().regex(/^\d{2}$/))
      .length(6)
      .optional(),
    listaRateioPremio: z.array(prizeSchema).optional(),
    numero: z.number().positive(),
    tipoJogo: z.enum(['MEGA_SENA', 'QUINA', 'LOTOFACIL', 'TIMEMANIA', 'LOTOMANIA']).optional(),
    status: z.enum(['PENDING', 'DRAWN']).optional(),
  });

  const body = addDrawSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }

  const drawData = {
    lotteryType: body.data.tipoJogo,
    contestNumber: body.data.numero,
    drawDate: parseDate(body.data.dataApuracao),
    drawnNumbers: body.data.listaDezenas,
    prize: body.data.listaRateioPremio,
    accumulated: body.data.acumulado,
  };

  const newDraw = await drawService.store(drawData);

  if (newDraw.error) {
    return res.status(500).json({ error: newDraw.error });
  }

  res.status(201).json({ draw: newDraw, auth });
};

export const updateDraw = async (req, res) => {
  const auth = req.auth;

  const { identifier } = req.params;

  const searchParams = isUUID(identifier)
    ? { id: identifier }
    : { contestNumber: parseInt(identifier) };

  // if (auth.role !== 'ADMIN' && auth.id !== id) {
  //   return res.status(403).json({ error: 'Acesso negado' });
  // }

  if (req.body.exceptionMessage) {
    return res
      .status(404)
      .json({ error: `${req.body.message} Não foi possível obter os dados do sorteio` });
  }

  const prizeSchema = z.object({
    descricaoFaixa: z.string(),
    faixa: z.number().positive(),
    numeroDeGanhadores: z.number().nonnegative(),
    valorPremio: z.number().nonnegative(),
  });

  const updateDrawSchema = z.object({
    acumulado: z.boolean().optional(),
    dataApuracao: z
      .string()
      .refine(validateDateFormat, { message: 'Formato de data inválido' })
      .optional(),
    listaDezenas: z
      .array(z.string().regex(/^\d{2}$/))
      .length(6)
      .optional(),
    listaRateioPremio: z.array(prizeSchema).optional(),
    numero: z.number().positive().optional(),
    tipoJogo: z.enum(['MEGA_SENA', 'QUINA', 'LOTOFACIL', 'TIMEMANIA', 'LOTOMANIA']).optional(),
    status: z.enum(['PENDING', 'DRAWN']).optional(),
  });

  const body = updateDrawSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }

  const drawData = {
    // lotteryType: body.data.tipoJogo,
    // contestNumber: body.data.numero,
    drawDate: parseDate(body.data.dataApuracao),
    drawnNumbers: body.data.listaDezenas,
    prize: body.data.listaRateioPremio,
    accumulated: body.data.acumulado,
  };

  const drawStatus = body.data.listaDezenas?.length === 6 ? 'DRAWN' : 'PENDING';

  const updatedDraw = await drawService.update({ ...drawData, status: drawStatus }, searchParams);

  if (updatedDraw.error) {
    return res.status(500).json({ error: updatedDraw.error });
  }

  res.json({ draw: updatedDraw, auth });
};

export const deleteDraw = async (req, res) => {
  const auth = req.auth;

  const { identifier } = req.params;

  const searchParams = isUUID(identifier)
    ? { id: identifier }
    : { contestNumber: parseInt(identifier) };

  const deletedDraw = await drawService.destroy(searchParams);

  if (deletedDraw.error) {
    return res.status(500).json({ error: deletedDraw.error });
  }

  res.json({ draw: deletedDraw, auth });
};
