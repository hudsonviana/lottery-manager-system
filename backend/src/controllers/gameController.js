import * as gameService from '../services/game.js';
import { validateDateFormat, parseDate } from '../utils/drawHelpers.js';
import { z } from 'zod';

export const getAllGames = async (req, res) => {
  const auth = req.auth;

  const games = await gameService.findAll();

  if (games.error) {
    return res.status(500).json({ error: games.error });
  }

  res.json({ games, auth });
};

export const getGame = async (req, res) => {
  const auth = req.auth;
  const { id } = req.params;

  const game = await gameService.findOne({ id });

  if (!game) {
    return res.status(404).json({ error: 'Jogo não encontrado' });
  }

  if (game?.error) {
    return res.status(500).json({ error: game.error });
  }

  res.json({ game, auth });
};

export const getUserGame = async (req, res) => {
  const auth = req.auth;
  const { playerId, id } = req.params;

  if (auth.role !== 'ADMIN' && auth.id !== playerId) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const game = await gameService.findOne({ playerId, id });

  if (!game) {
    return res.status(404).json({ error: 'Jogo não encontrado para o usuário' });
  }

  if (game?.error) {
    return res.status(500).json({ error: game.error });
  }

  res.json({ game, auth });
};

export const addGame = async (req, res) => {
  const auth = req.auth;
  const { playerId } = req.params;

  if (auth.role !== 'ADMIN' && auth.id !== playerId) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const gameNumbersSchema = z.object({
    gameA: z
      .array(z.string().regex(/^\d{2}$/))
      .min(6)
      .max(9),
    gameB: z
      .array(z.string().regex(/^\d{2}$/))
      .min(0)
      .max(9),
    gameC: z
      .array(z.string().regex(/^\d{2}$/))
      .min(0)
      .max(9),
  });

  const addGameSchema = z.object({
    gameNumbers: gameNumbersSchema,
    ticketPrice: z.number().nonnegative().optional(),
    contestNumber: z.number().positive(),
    drawDate: z.string().refine(validateDateFormat, { message: 'Formato de data inválido' }),
    lotteryType: z.enum(['MEGA_SENA', 'QUINA', 'LOTOFACIL', 'TIMEMANIA', 'LOTOMANIA']),
  });

  const body = addGameSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }

  const gameData = {
    playerId,
    gameNumbers: body.data.gameNumbers,
    ticketPrice: body.data.ticketPrice,
  };

  const drawData = {
    contestNumber: body.data.contestNumber,
    drawDate: parseDate(body.data.drawDate),
    lotteryType: body.data.lotteryType,
  };

  const newGame = await gameService.store({ gameData, drawData });

  if (newGame.error) {
    return res.status(500).json({ error: newGame.error });
  }

  res.status(201).json({ game: newGame, auth });
};

export const updateGame = async (req, res) => {
  const auth = req.auth;
  const { playerId, id } = req.params;

  if (auth.role !== 'ADMIN' && auth.id !== playerId) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const gameNumbersSchema = z
    .object({
      gameA: z
        .array(z.string().regex(/^\d{2}$/))
        .min(6)
        .max(9),
      gameB: z
        .array(z.string().regex(/^\d{2}$/))
        .min(0)
        .max(9),
      gameC: z
        .array(z.string().regex(/^\d{2}$/))
        .min(0)
        .max(9),
    })
    .optional();

  const updateGameSchema = z.object({
    gameNumbers: gameNumbersSchema,
    ticketPrice: z.number().nonnegative().optional(),
    result: z.enum(['WON_SIX_NUM', 'WON_FIVE_NUM', 'WON_FOUR_NUM', 'LOST', 'PENDING']).optional(),
  });

  const body = updateGameSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }

  const updatedGame = await gameService.update(body.data, { playerId, id });

  if (updatedGame?.error) {
    return res.status(500).json({ error: updatedGame.error });
  }

  res.json({ game: updatedGame, auth });
};

export const deleteGame = async (req, res) => {
  const auth = req.auth;
  const { playerId, id } = req.params;

  if (auth.role !== 'ADMIN' && auth.id !== playerId) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const deletedGame = await gameService.destroy({ playerId, id });

  if (deletedGame.error) {
    return res.status(500).json({ error: deletedGame.error });
  }

  res.json({ game: deletedGame, auth });
};
