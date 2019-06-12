// Import the dependencies for testing
import {describe, before} from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';

import app from '../../src/server';
import DuelService from '../../src/service/DuelService';
import {getUserAccessToken, getGuestAccessToken} from '../harness/auth';

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("duel route", async () => {
  let accessToken = undefined;
  let accessToken1 = undefined;
  let accessToken2 = undefined;
  before(async () => {
    accessToken = await getUserAccessToken({
      sub: 'auth0|1234'
    });
    accessToken1 = await getGuestAccessToken({
      sub: 'guest123'
    });
    accessToken2 = await getGuestAccessToken({
      sub: 'guest124'
    });
  });

  describe("GET /v1/duel", async () => {
    let duelServiceFind = null;
    let duelServiceJoin = null;
    // Test to get all my duels
    // it("should get all students record", (done) => {
    //   chai.request(app)
    //     .get('/')
    //     .end((err, res) => {
    //       res.should.have.status(200);
    //       res.body.should.be.a('object');
    //       done();
    //     });
    // });
    // Test to get single student record
    beforeEach(() => {
      duelServiceFind = sinon.stub(DuelService.prototype, 'find');
      duelServiceJoin = sinon.stub(DuelService.prototype, 'join');
    });

    afterEach(() => {
      DuelService.prototype.find.restore();
      DuelService.prototype.join.restore();
    });

    it("should get a single duel record", async () => {
      const result = {id: 1, message: 'some duel'};
      const id = '1';
      duelServiceFind.withArgs(id).returns(Promise.resolve(result));
      return new Promise((resolve) => chai.request(app)
        .get(`/v1/duel/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.be.deep.equal(result);
          resolve();
        }));
    });

    // Test to get single duel record
    it("should not get a single duel record", async () => {
      const id = 5;
      duelServiceFind.withArgs(id).returns(Promise.resolve(undefined));
      return new Promise((resolve) => chai.request(app)
        .get(`/v1/duel/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.deep.equal({
            type: 'NotFoundError',
            message: `Resource Duel (ID:${id}) was not found.`
          });
          resolve();
        }))
        .catch((e) => console.error(e));
    });

    it("should post new duel", async () => {
      const user1 = {
        sub: 'guest123',
        isGuest: true
      };
      const user2 = {
        sub: 'guest124',
        isGuest: true
      };

      const duel = {
        id: 123456,
        warriors: [
          {
            avatarID: 'astronaut89',
            username: 'guest123',
            victoryPercent: 58,
            level: 2
          }, {
            avatarID: 'ladybug123',
            username: 'guest124',
            victoryPercent: 40,
            level: 3
          }
        ]
      };
      duelServiceJoin
        .withArgs(sinon.match.has('sub', user1.sub).and(sinon.match.has('isGuest', true)))
        .returns(Promise.resolve(duel));
      duelServiceJoin
        .withArgs(sinon.match.has('sub', user2.sub).and(sinon.match.has('isGuest', true)))
        .returns(Promise.resolve(duel));
      const user1call = new Promise((resolve) => chai.request(app)
        .post('/v1/duel')
        .set('Authorization', `Bearer ${accessToken1}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.deep.equal({
            duel
          });
          resolve();
        }))
        .catch(e => console.error(e));
      const user2call = new Promise(resolve => chai.request(app)
        .post('/v1/duel')
        .set('Authorization', `Bearer ${accessToken2}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.deep.equal({
            duel
          });
          resolve();
        }))
        .catch(e => console.error(e));

      return Promise.all([user1call, user2call]);
    });

  });
});
