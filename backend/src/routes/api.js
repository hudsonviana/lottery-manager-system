import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ teste: 'Ok' });
});

// https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/2747

export default router;
