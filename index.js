require('@babel/register');
require('@babel/polyfill');
require('dotenv').config({ debug: process.env.NODE_ENV !== 'production' });

const app = require('./src/server');

app.start(app);
