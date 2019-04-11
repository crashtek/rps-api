// Import the dependencies for testing
import { describe } from 'mocha';
import chai from 'chai';

import { checkUser } from '../../src/middleware/auth';
import { getGuestAccessToken, getUserAccessToken } from '../harness/auth';
import { UnauthorizedError } from 'express-jwt';

// Configure chai
const should = chai.should();

describe("auth middleware", () => {
  const userSub = 'auth0|1234';
  const guestSub = 'guest|1234';
  let userAccessToken = undefined;
  let guestAccessToken = undefined;
  before(async () => {
    userAccessToken = await getUserAccessToken({
      sub: userSub
    });
    guestAccessToken = await getGuestAccessToken({
      sub: guestSub
    });
  });

  describe("test checkUser", () => {
    it("should pass", async () => {
      const req = {
        headers: {
          authorization: `Bearer ${userAccessToken}`
        }
      };
      const res = {
        send: (message) => {
          console.log('blah: ', message);
        }
      };

      return checkUser(req, res, (error) => {
        if (error) throw error;
        req.user.sub.should.be.equal(userSub);
        should.exist(req.user.isGuest);
        req.user.isGuest.should.be.false;
      });
    });

    it("should fail", async () => {
      const res = {
        send: (message) => {
          console.log('blah: ', message);
        }
      };

      const badAccessToken = await getUserAccessToken({ sub: userSub }, { issuer: 'bad issuer' });
      const req = {
        headers: {
          authorization: `Bearer ${badAccessToken}`
        }
      };

      return new Promise((resolve) => checkUser(req, res, (error) => {
        should.exist(error);
        error.should.be.an('object');
        error.name.should.be.equal('UnauthorizedError');
        error.status.should.be.equal(401);
        error.code.should.be.equal('invalid_token');
        error.message.should.be.equal(`jwt issuer invalid. expected: https://${process.env.AUTH0_DOMAIN}/`);
        resolve();
      }));
    });
  });
});
