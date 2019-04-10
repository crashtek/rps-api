import fs from 'fs';
import nock from 'nock';
import jose from 'node-jose';
import jwt from 'jsonwebtoken';

let done = false;

let crashtekApiPrivateKey = undefined;

try {
  crashtekApiPrivateKey = fs.readFileSync(process.env.CRASHTEK_TEST_API_PRIVATE_SIGNING_KEY_PATH, 'ascii');
} catch(e) {
  throw new Error('You must run npm run test:setup to initialize the tests!!!');
}

const getKid = async () => {
  if (!done) {
    const crashtekApiPublicKey = fs.readFileSync(process.env.CRASHTEK_TEST_API_PUBLIC_SIGNING_KEY_PATH, 'ascii');

    const x5cArr = crashtekApiPublicKey.split("\n");
    x5cArr.shift();
    x5cArr.pop();
    x5cArr.pop();

    const x5c = x5cArr.join('');

    done = jose.JWK.asKey(crashtekApiPrivateKey, 'pem')
      .then(function(result) {
          const jwks = result.keystore.toJSON();
          jwks.keys[0].x5t = jwks.keys[0].kid;
          jwks.keys[0].x5c = [x5c];
          jwks.keys[0].use = 'sig';
          jwks.keys[0].alg = 'RS256';

          nock(`https://${process.env.AUTH0_DOMAIN}`)
            .get('/.well-known/jwks.json')
            .reply(200, jwks)
            .persist();

          done = Promise.resolve(jwks.keys[0].kid);

          return done;
        },
        function(err) {
          console.error('Failed to create key: ', err);
        });
  }

  return done;
};

export const getUserAccessToken = async (user) => {
  const options = {
    audience: 'http://api.crashtek.games/v1/',
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithm: 'RS256',
    expiresIn: '2 days',
    keyid: await getKid()
  };

  return jwt.sign(user, crashtekApiPrivateKey, options);
};


// if (crashtekApiPublicKey && crashtekApiPrivateKey) {
//   console.log('carlos, private: ', crashtekApiPrivateKey);
//   console.log('carlos, public: ', crashtekApiPublicKey);
//   console.log('carlos, private jwk: ', pem2jwk(crashtekApiPrivateKey));
//   console.log('carlos, public jwk: ', pem2jwk(crashtekApiPublicKey));
// } else {
//   console.log('carlos no files found');
// }

//
//
// export const createTestGuestToken