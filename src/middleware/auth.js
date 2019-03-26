import { Router } from 'express';
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';

export const router = Router();

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://crashtek.auth0.com/.well-known/jwks.json"
  }),
  audience: 'http://api.crashtek.games/v1/',
  issuer: "https://crashtek.auth0.com/",
  algorithms: ['RS256']
});

// const checkGuestOrUser = (req, res, next) => {
//   return
// };

router.use(jwtCheck);
