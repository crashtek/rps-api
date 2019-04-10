import winston from 'winston';

// winston.emitErrs = true;
const logger = winston.createLogger({
  level: process.env.CRASHTEK_LOG_LEVEL || 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.Console({
      colorize: true,
      timestamp: true,
      handleExceptions: true,
      json: false,
      format: winston.format.simple()
    })
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' })
  ]
});

export default logger;
