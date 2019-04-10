// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../src/server';
import DuelService from '../../src/service/DuelService';

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("duel route", () => {
  describe("GET /v1/duel", () => {
    let duelService = null;
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
      duelService = sinon.stub(DuelService.prototype, 'find');
    });

    afterEach(() => {
      DuelService.prototype.find.restore();
    });

    it("should get a single duel record", (done) => {
      const result = {id: 1, message: 'some duel'};
      const id = '1';
      duelService.withArgs(id).returns(Promise.resolve(result));
      chai.request(app)
        .get(`/v1/duel/${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.be.deep.equal(result);
          done();
        });
    });

    // Test to get single duel record
    it("should not get a single duel record", (done) => {
      const id = 5;
      duelService.withArgs(id).returns(Promise.resolve(undefined));
      chai.request(app)
        .get(`/v1/duel/${id}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.deep.equal({
            type: 'NotFoundError',
            message: `Resource Duel (ID:${id}) was not found.`
          });
          done();
        });
    });
  });
});
