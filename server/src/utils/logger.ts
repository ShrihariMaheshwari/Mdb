import pino from 'pino';

const loggerConfig = {
  development: {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: {
    level: 'info',
  },
};

export const logger = pino(
  process.env.NODE_ENV === 'development' 
    ? loggerConfig.development 
    : loggerConfig.production
);