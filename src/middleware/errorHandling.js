const { AssertionError } = require('assert');
const { MongoError } = require('mongodb');

export class DomainError extends Error {
  constructor(message) {
    super(message);
    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;
    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    //  @see Node.js reference (bottom)
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends DomainError {
  constructor(resource, query) {
    super(`Resource ${resource} was not found.`);
    this.data = { resource, query };
  }
}


// export class NotFoundError extends AssertionError {
//   constructor(message) {
//     super(message);
//   }
// }

export const handleNotFoundError = (error, req, res, next) => {
  if (error instanceof NotFoundError) {
    return res.status(404).json({
      type: 'NotFoundError',
      message: error.message
    });
  }
  next(error);
};

export const handleAssertionError = (error, req, res, next) => {
  if (error instanceof AssertionError) {
    return res.status(400).json({
      type: 'AssertionError',
      message: error.message
    });
  }
  next(error);
};

export const handleDatabaseError = (error, req, res, next) => {
  if (error instanceof MongoError) {
    return res.status(503).json({
      type: 'MongoError',
      message: error.message
    });
  }
  next(error);
};
