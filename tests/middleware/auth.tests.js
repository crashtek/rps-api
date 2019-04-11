// Import the dependencies for testing
import { describe } from 'mocha';
import chai from 'chai';

import { checkUser } from '../../src/middleware/auth';
import { getGuestAccessToken, getUserAccessToken } from '../harness/auth';

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
  });
});
