import { FastifyInstance } from 'fastify';
import { Database } from '../../types/database';
import { registerCollectionRoutes } from './collection';
import { registerHealthRoutes } from './health';
import { registerRootRoutes } from './root';

export async function registerRoutes(app: FastifyInstance, database: Database) {
  // Register root route handlers
  await app.register(registerRootRoutes, { prefix: '/' });
  
  // Register API routes
  await app.register(registerCollectionRoutes, { prefix: '/api', database });
  
  // Register health and metrics routes
  await app.register(registerHealthRoutes, { prefix: '/health' });
}