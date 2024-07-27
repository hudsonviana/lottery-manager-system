import { Router } from 'express';

const router = Router();

router.get('/api', (req, res) => res.json({ api: 'Ok' }));

export default router;
