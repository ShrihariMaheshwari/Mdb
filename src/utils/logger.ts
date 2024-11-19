import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname'
    }
  },
  serializers: {
    req(request) {
      return {
        method: request.method,
        url: request.url,
        version: request.headers['accept-version'],
        hostname: request.hostname,
        remoteAddress: request.ip,
        remotePort: request.socket?.remotePort
      };
    }
  }
});

// Helper functions for consistent logging
export const createLogger = (module: string) => {
  return logger.child({ module });
};

export function formatDuration(start: [number, number]): string {
  const hrDuration = process.hrtime(start);
  const duration = hrDuration[0] * 1e3 + hrDuration[1] / 1e6;
  return `${duration.toFixed(2)}ms`;
}