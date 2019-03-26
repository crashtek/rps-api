import { Router } from 'express';

import { getRouter as duelRouter } from './routes/duel';

export const getRouter = () => {
  const router = Router();

  router.use('/duel', duelRouter());

  return router;
};