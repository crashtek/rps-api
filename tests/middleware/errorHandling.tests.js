// Import the dependencies for testing
import { describe } from 'mocha';
import chai from 'chai';

import {
  handleDatabaseError,
  handleAssertionError,
  handleNotFoundError,
  NotFoundError
} from '../../src/middleware/errorHandling';
import { AssertionError } from 'assert';
import { MongoError } from 'mongodb';


// Configure chai
const should = chai.should();

describe("errorHandling middleware", () => {

  class ResponseError {
    constructor(statusCode, json, resolve) {
      this.statusCode = statusCode;
      this.jsonResponse = json;
      this.resolve = resolve;
    }

    status(statusCode) {
      statusCode.should.be.equal(this.statusCode);
      return this;
    }

    json(jsonObject) {
      jsonObject.should.be.deep.equal(this.jsonResponse);
      this.resolve();
      return this;
    }
  }

  describe("test handleNotFoundError", () => {
    it("handle error", async () => {
      return new Promise((resolve) => {
        const resource = 'some resource';
        const error = new NotFoundError(resource);
        const res = new ResponseError(404, {
          type: 'NotFoundError',
          message: `Resource ${resource} was not found.`
        }, resolve);

        handleNotFoundError(error, {}, res, () => {
          should.not.exist(error); // This should not get called
        });
      });
    });

    it("pass on error", async () => {
      return new Promise((resolve) => {
        const resource = 'some resource';
        const error = new Error(resource);
        const res = new ResponseError(undefined, undefined, resolve);

        handleNotFoundError(error, {}, res, (e) => {
          e.should.deep.equal(error);
          resolve();
        });
      });
    });
  });

  describe("test handleAssertionError", () => {
    it("handle error", async () => {
      return new Promise((resolve) => {
        const error = new AssertionError({
          actual: 1,
          expected: 2,
          message: 'message',
          operator: '=',
          stackStartFn: () => "stack"
        });
        const res = new ResponseError(400, {
          type: 'AssertionError',
          message: 'message'
        }, resolve);

        handleAssertionError(error, {}, res, () => {
          should.not.exist(error); // This should not get called
        });
      });
    });

    it("pass on error", async () => {
      return new Promise((resolve) => {
        const resource = 'some resource';
        const error = new Error(resource);
        const res = new ResponseError(undefined, undefined, resolve);

        handleAssertionError(error, {}, res, (e) => {
          e.should.deep.equal(error);
          resolve();
        });
      });
    });
  });

  describe("test handleDatabaseError", () => {
    it("handle error", async () => {
      return new Promise((resolve) => {
        const error = new MongoError('message');
        const res = new ResponseError(503, {
          type: 'MongoError',
          message: 'message'
        }, resolve);

        handleDatabaseError(error, {}, res, () => {
          should.not.exist(error); // This should not get called
        });
      });
    });

    it("pass on error", async () => {
      return new Promise((resolve) => {
        const resource = 'some resource';
        const error = new Error(resource);
        const res = new ResponseError(undefined, undefined, resolve);

        handleDatabaseError(error, {}, res, (e) => {
          e.should.deep.equal(error);
          resolve();
        });
      });
    });
  });
});

