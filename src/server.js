import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import logger from './logger';

import router from './router';
import general from './general';
import { handleAssertionError, handleDatabaseError, handleNotFoundError } from './middleware/errorHandling';

const app = express();

const port = process.env.PORT || 8080;

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
  // use morgan to log at command line
  app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

// parse application/json and look for raw text
app.use(bodyParser.json({ type: 'application/json' }));

app.use('/v1', router);

app.use(handleNotFoundError);
app.use(handleDatabaseError);
app.use(handleAssertionError);

export const start = () => app.listen(port, (err) => {
  if (err) logger.error(err);
  logger.info(`Listening on port ${port}`);
  logger.info('Starting general');
  general();
});

export default app;
