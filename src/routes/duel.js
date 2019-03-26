import { Router } from 'express';

export const getRouter = () => {
  const router = Router();

  router.get('/:id', (req, res) => {
    res.send({
      id: req.params.id,
      message: `some duel`
    })
  });

  return router;
};