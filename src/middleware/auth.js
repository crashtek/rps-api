import jwt from 'express-jwt';
import jwks from 'jwks-rsa';

import logger from '../logger';

export const checkUser = (req, res, next) => jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: 'http://api.crashtek.games/v1/',
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: [ 'RS256' ]
});

// pub and private generated with openssl req -x509 -newkey rsa:4096 -keyout signing-private.pem -out signing-public.pem -days 1825 -nodes
// Country Name (2 letter code) []:US
// State or Province Name (full name) []:Minnesota
// Locality Name (eg, city) []:Blaine
// Organization Name (eg, company) []:Crashtek Games
// Organizational Unit Name (eg, section) []:IT
// Common Name (eg, fully qualified host name) []:api.dev.crashtek.games
// Email Address []:carlosmostek@gmail.com
const crashtekApiPublicKey = fs.readFileSync(process.env.CRASHTEK_API_PUBLIC_SIGNING_KEY_PATH);
const crashtekApiPrivateKey = fs.readFileSync(process.env.CRASHTEK_API_PRIVATE_SIGNING_KEY_PATH);

export const checkGuest = (req, res, next) => jwt({
  secret: crashtekApiPublicKey,
  audience: 'http://api.crashtek.games/v1/',
  issuer: `https://${process.env.CRASHTEK_API_DOMAIN}/`,
  algorithms: [ 'RS256' ]
});

export const checkGuestOrUser = (req, res, next) => {
  logger.info('not implemented yet');
  return next();
};
