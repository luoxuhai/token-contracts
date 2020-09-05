/**
 * Logger middleware
 */
const koaPino = require('koa-pino-logger');
const pino = require('pino');

const devOpts = {
  prettyPrint: true,
};

const proOpts = {
  enabled: false,
};

let requestLog;
let logger;

if (process.env.NODE_ENV === 'production') {
  requestLog = koaPino(proOpts);
  logger = pino(proOpts);
} else {
  requestLog = koaPino(devOpts);
  logger = pino(devOpts);
}

exports.requestLogger = requestLog;
exports.logger = logger;
