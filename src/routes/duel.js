import { Router } from 'express';
import wrap from '../middleware/wrap';
import DuelService from '../service/DuelService';
import { NotFoundError } from '../middleware/errorHandling';

const router = Router();

router.get('/:id', wrap(async (req, res) => {
  const service = new DuelService();
  const duel = await service.find(req.params.id);

  if (!duel) {
    throw new NotFoundError(`Duel (ID:${req.params.id})`);
  }

  return res.send(duel);
}));

export default router;
