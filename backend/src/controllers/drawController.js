import * as drawService from '../services/draw.js';
import { isUUID } from '../utils/checkUuid.js';

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
  let id = undefined;
  let contestNumber = undefined;

  if (isUUID(identifier)) {
    id = identifier;
  } else {
    contestNumber = parseInt(identifier);
  }

  const draw = await drawService.findOne({ id, contestNumber });

  if (!draw) {
    return res.status(404).json({ error: 'Sorteio não encontrado' });
  }

  if (draw?.error) {
    return res.status(500).json({ error: draw.error });
  }

  res.json({ draw, auth });
};
