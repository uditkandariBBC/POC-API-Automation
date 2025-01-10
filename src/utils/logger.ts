import { createLogger, format, transports } from 'winston';
import * as path from 'path';
import * as fs from 'fs';

// Ensure the logs directory exists
const logsDir = path.resolve(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Define the log file path
const logFilePath = path.join(logsDir, 'structured-logs.log');

// Define custom log levels
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'grey',
  },
};

// Create a logger instance
const logger = createLogger({
  levels: customLevels.levels,
  level: 'info', // Set the default log level
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message, ...metadata }) => {
      const meta = Object.keys(metadata).length
        ? JSON.stringify(metadata, null, 2)
        : '';
      return `${timestamp} [${level.toUpperCase()}]: ${message} ${meta}`;
    }),
  ),
  transports: [
    // Console transport for real-time output
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message, ...metadata }) => {
          const meta = Object.keys(metadata).length
            ? JSON.stringify(metadata, null, 2)
            : '';
          return `${timestamp} [${level.toUpperCase()}]: ${message} ${meta}`;
        }),
      ),
    }),
    // File transport for persistent logging
    new transports.File({
      filename: logFilePath,
      format: format.combine(
        format.uncolorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message, ...metadata }) => {
          const meta = Object.keys(metadata).length
            ? JSON.stringify(metadata, null, 2)
            : '';
          return `${timestamp} [${level.toUpperCase()}]: ${message} ${meta}`;
        }),
      ),
    }),
  ],
});

// Apply colors to custom log levels
import { addColors } from 'winston';
addColors(customLevels.colors);

export default logger;
