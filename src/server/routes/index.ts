import { FastifyInstance } from 'fastify';
import { Database } from '../../types/database';
import { registerCollectionRoutes } from './collection';
import { registerHealthRoutes } from './health';

export async function registerRoutes(app: FastifyInstance, database: Database) {
  app.register(registerCollectionRoutes, { prefix: '/api', database });
  app.register(registerHealthRoutes, { prefix: '/health' });
}