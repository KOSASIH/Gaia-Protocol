const winston = require('winston');  // npm install winston

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'gaia-protocol' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

class LoggerUtils {
  static logInfo(message, meta = {}) {
    logger.info(message, meta);
  }

  static logError(message, error, meta = {}) {
    logger.error(message, { error: error.message, stack: error.stack, ...meta });
  }

  static logQuantumEvent(event, data) {
    logger.info('Quantum Event', { event, data, timestamp: new Date() });
  }
}

module.exports = LoggerUtils;
