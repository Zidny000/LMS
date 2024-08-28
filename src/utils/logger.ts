import { createLogger, format, transports } from 'winston';

export const errorLogger = createLogger({
  level: 'error',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'error.log' })
  ],
});
