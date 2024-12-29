import { Router } from 'express';

const router = Router();

router.get('/api', (req, res) => {
  try {
    res.json({ api: 'Ok' });
  } catch (error) {
    return res.status(500).json({ msgError: 'API conectada, porém não disponível.', error });
  }
});

export default router;
