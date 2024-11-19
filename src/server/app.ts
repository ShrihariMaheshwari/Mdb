import fastify, { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import { Database } from '../types/database';
import { logger } from '../utils/logger';
import { registerRoutes } from './routes';
import { errorHandler } from './plugins/error-handler';
import { validatorCompiler } from './plugins/validator';

interface ServerOptions {
  port?: number;
  host?: string;
  logger?: boolean;
}

const DEFAULT_OPTIONS: ServerOptions = {
  port: 3000,
  host: 'localhost',
  logger: true
};

export async function createServer(
  database: Database,
  options: ServerOptions = {}
): Promise<FastifyInstance> {
  const serverOptions = { ...DEFAULT_OPTIONS, ...options };

  const app = fastify({
    logger: serverOptions.logger ? logger : undefined,
    ajv: {
      customOptions: {
        removeAdditional: false,
        useDefaults: true,
        coerceTypes: true,
        allErrors: true
      }
    }
  });

  // Register plugins
  await app.register(fastifyCors);
  
  // Set custom validator compiler
  app.setValidatorCompiler(validatorCompiler);
  
  // Set error handler
  app.setErrorHandler(errorHandler);

  // Register routes with database instance
  await registerRoutes(app, database);

  // Request logging
  app.addHook('onRequest', async (request, reply) => {
    // Add timestamp to track request duration
    request.startTime = process.hrtime();
    
    request.log.info({ 
      url: request.url, 
      method: request.method 
    }, 'incoming request');
  });

  // Response logging
  app.addHook('onResponse', async (request, reply) => {
    // Calculate request duration
    const hrDuration = process.hrtime(request.startTime);
    const duration = hrDuration[0] * 1e3 + hrDuration[1] / 1e6; // Convert to milliseconds

    request.log.info(
      { 
        url: request.url, 
        method: request.method, 
        statusCode: reply.statusCode,
        duration: `${duration.toFixed(2)}ms`
      }, 
      'request completed'
    );
  });

  return app;
}

// We need to extend FastifyRequest to include our custom property
declare module 'fastify' {
  interface FastifyRequest {
    startTime: [number, number];
  }
}