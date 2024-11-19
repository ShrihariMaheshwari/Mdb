import fastify, { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import { Database } from '../types/database';
import { registerRoutes } from './routes';
import { errorHandler } from './plugins/error-handler';
import { validatorCompiler } from './plugins/validator';
import { metrics } from '../utils/metrics';
import { metricsRoutes } from './routes/metric';

interface ServerOptions {
  port?: number;
  host?: string;
}

const DEFAULT_OPTIONS: ServerOptions = {
  port: 3000,
  host: 'localhost'
};

// Add custom property to FastifyRequest for timing
declare module 'fastify' {
  interface FastifyRequest {
    startTime: number;
  }
}

export async function createServer(
  database: Database,
  options: ServerOptions = {}
): Promise<FastifyInstance> {
  const serverOptions = { ...DEFAULT_OPTIONS, ...options };

  const app = fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport: process.env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined
    }
  });

  // Register plugins
  await app.register(fastifyCors);

  // Register metrics
  await app.register(metricsRoutes);
  
  // Set validator compiler
  app.setValidatorCompiler(validatorCompiler);
  
  // Set error handler
  app.setErrorHandler(errorHandler);

  // Register routes
  await registerRoutes(app, database);

  // Add timing to track request duration
  app.addHook('onRequest', async (request) => {
    request.startTime = metrics.startRequest(request.url, request.method);
    request.log.info({ 
      url: request.url, 
      method: request.method 
    }, 'incoming request');
  });

  app.addHook('onResponse', async (request, reply) => {
    const requestMetrics = metrics.endRequest(
      request.startTime,
      request.url,
      request.method,
      reply.statusCode
    );
    
    request.log.info(
      { 
        url: request.url, 
        method: request.method, 
        statusCode: reply.statusCode,
        responseTime: `${requestMetrics.duration}ms`
      }, 
      'request completed'
    );
  });

  app.get('/metrics', async () => ({
    averageResponseTime: metrics.getAverageResponseTime(),
    endpointMetrics: metrics.getMetricsByEndpoint(),
    uptime: process.uptime()
  }));

  return app;
}