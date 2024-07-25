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

}

export const addGame = async (req, res) => {
  const auth = req.auth;
  const { playerId } = req.params;

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
