const winston = require('winston');
const keys = require('../config/keys');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Determine transports based on environment
const transports = [];

// In production (Vercel/serverless), only use console logging
// File system is read-only except /tmp
if (keys.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
} else {
  // In development, use file logging
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  );
  
  // Also log to console in development
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  level: keys.LOG_LEVEL,
  format: logFormat,
  defaultMeta: { service: 'task-manager-api' },
  transports: transports,
});

module.exports = logger;
