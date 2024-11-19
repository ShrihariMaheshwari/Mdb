import { FastifyInstance } from 'fastify';
import { Database } from '../../types/database';

interface RouteOptions {
  database: Database;
}

export async function registerCollectionRoutes(
  app: FastifyInstance,
  opts: RouteOptions
) {
  const { database } = opts;

  // Create record
  app.post<{
    Params: { collection: string };
    Body: Record<string, unknown>;
  }>('/:collection', async (request, reply) => {
    const collection = database.collection(request.params.collection);
    const result = await collection.insert(request.body);
    reply.code(201).send(result);
  });

  // Get all records
  app.get<{
    Params: { collection: string };
    Querystring: { query?: string };
  }>('/:collection', async (request, reply) => {
    const collection = database.collection(request.params.collection);
    const query = request.query.query ? 
      JSON.parse(request.query.query) : 
      {};
    const results = await collection.find(query);
    reply.send(results);
  });

  // Get record by ID
  app.get<{
    Params: { collection: string; id: string };
  }>('/:collection/:id', async (request, reply) => {
    const collection = database.collection(request.params.collection);
    const result = await collection.findById(request.params.id);
    
    if (!result) {
      reply.code(404).send({ error: 'Record not found' });
      return;
    }
    
    reply.send(result);
  });

  // Update record
  app.put<{
    Params: { collection: string; id: string };
    Body: Record<string, unknown>;
  }>('/:collection/:id', async (request, reply) => {
    const collection = database.collection(request.params.collection);
    const result = await collection.update(
      request.params.id,
      request.body
    );

    if (!result) {
      reply.code(404).send({ error: 'Record not found' });
      return;
    }

    reply.send(result);
  });

  // Delete record
  app.delete<{
    Params: { collection: string; id: string };
  }>('/:collection/:id', async (request, reply) => {
    const collection = database.collection(request.params.collection);
    const success = await collection.delete(request.params.id);

    if (!success) {
      reply.code(404).send({ error: 'Record not found' });
      return;
    }

    reply.code(204).send();
  });
}