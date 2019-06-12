import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { DuelService } from '../service/DuelService';
import { NotFoundError } from '../middleware/errorHandling';
import { checkGuestOrUser } from '../middleware/auth';
import wrap from '../middleware/wrap';

const router = Router();

router.use(checkGuestOrUser);

/**
 * get by ID
 */
router.get('/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required()
    })
  }),
  wrap(async (req, res) => {
    const service = new DuelService();
    const duel = await service.find(req.params.id);

    if (!duel) {
      throw new NotFoundError(`Duel (ID:${req.params.id})`);
    }

    return res.send(duel);
  }));

/**
 * Create a new Duel
 */
router.post('/',
  celebrate({
    body: Joi.object().keys({
      opponentId: Joi.string().allow(''),
      numTurns: Joi.string().valid(['1', '3', '5', '7']).default('1'),
      timeout: Joi.string().valid(['1', '3', '12', '24', '48', '72', '120']).default('24')
    })
  }),
  wrap(async (req, res) => {
    const service = new DuelService();
    const duel = await service.join(req.user);
    return res.send({
      duel
    });
  }));

export default router;
