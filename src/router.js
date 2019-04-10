import { Router } from 'express';

import duelRouter from './routes/duel';

const router = Router();

router.use('/duel', duelRouter);

export default router;
