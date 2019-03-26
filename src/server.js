import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import { getRouter as router } from './router';

dotenv.config({ debug: process.env.NODE_ENV !== 'production' });

export const app = express();

const port = process.env.PORT || 8080;

//don't show the log when it is test
if(process.env.NODE_ENV !== 'test') {
  //use morgan to log at command line
  app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

//parse application/json and look for raw text
app.use(bodyParser.json({ type: 'application/json'}));

app.use('/v1', router());

app.listen(port, err => {
  if (err) console.error(err);
  console.log("Listening on port " + port);
});