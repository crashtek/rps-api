import { Router } from 'express';

import duelRouter from './routes/duel';
import guestRouter from './routes/guest';

const router = Router();

router.use('/duel', duelRouter);
router.use('/guest', guestRouter);

export default router;
