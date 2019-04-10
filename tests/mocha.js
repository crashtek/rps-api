/* eslint-disable import/no-extraneous-dependencies */
process.env.NODE_ENV = 'test';

// Register babel so that it will transpile ES6 to ES5
// before our tests run.
require('@babel/register');
require('@babel/polyfill');
require('dotenv').config({ debug: true, path: require('path').join(__dirname, '/harness/env') });
