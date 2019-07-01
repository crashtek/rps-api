import jwt from 'jsonwebtoken';
import uuid from 'uuid';
import { Router } from 'express';

import wrap from '../middleware/wrap';

const router = Router();

/**
 * Register a new guest
 */
router.post('/',
  wrap(async (req, res) => {
    // TODO: write to the database
    const options = {
      audience: 'http://api.crashtek.games/v1/',
      issuer: `https://${process.env.CRASHTEK_API_DOMAIN}/`,
      algorithm: 'HS256',
      expiresIn: '2 days'
    };

    const user = {
      id: `guest|${uuid.v4()}`
    };

    return res.send({
      jwt: jwt.sign(user, process.env.CRASHTEK_API_GUEST_SIGNING_SECRET, options)
    });
  }));

export default router;
