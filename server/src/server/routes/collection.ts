// src/server/routes/collections.ts
import { FastifyInstance } from 'fastify';
import { Database } from '../../types/database';
import { DatabaseError } from '../../types/errors';

interface RouteOptions {
  database: Database;
}

export async function registerCollectionRoutes(
  app: FastifyInstance,
  opts: RouteOptions
) {
  const { database } = opts;

  // Helper function to get or create collection
  async function getOrCreateCollection(collectionName: string) {
    try {
      return database.collection(collectionName);
    } catch (error) {
      if (error instanceof DatabaseError && error.message.includes('does not exist')) {
        // Collection doesn't exist, create it
        return await database.createCollection(collectionName);
      }
      throw error;
    }
  }

  // Create record
  app.post<{
    Params: { collection: string };
    Body: Record<string, unknown>;
  }>('/:collection', async (request, reply) => {
    try {
      const collection = await getOrCreateCollection(request.params.collection);
      const result = await collection.insert(request.body);
      reply.code(201).send(result);
    } catch (error) {
      request.log.error(error, 'Failed to create record');
      if (error instanceof DatabaseError) {
        reply.code(400).send({ error: 'Database Error', message: error.message });
        return;
      }
      reply.code(500).send({ error: 'Internal Server Error', message: 'Failed to create record' });
    }
  });

  // Get all records
  app.get<{
    Params: { collection: string };
    Querystring: { query?: string };
  }>('/:collection', async (request, reply) => {
    try {
      const collection = await getOrCreateCollection(request.params.collection);
      const query = request.query.query ? 
        JSON.parse(request.query.query) : 
        {};
      const results = await collection.find(query);
      reply.send(results);
    } catch (error) {
      request.log.error(error, 'Failed to get records');
      reply.code(500).send({ error: 'Internal Server Error', message: 'Failed to get records' });
    }
  });

  // Get record by ID
  app.get<{
    Params: { collection: string; id: string };
  }>('/:collection/:id', async (request, reply) => {
    try {
      const collection = await getOrCreateCollection(request.params.collection);
      const result = await collection.findById(request.params.id);
      
      if (!result) {
        reply.code(404).send({ error: 'Not Found', message: 'Record not found' });
        return;
      }
      
      reply.send(result);
    } catch (error) {
      request.log.error(error, 'Failed to get record');
      reply.code(500).send({ error: 'Internal Server Error', message: 'Failed to get record' });
    }
  });

  // Update record
  app.put<{
    Params: { collection: string; id: string };
    Body: Record<string, unknown>;
  }>('/:collection/:id', async (request, reply) => {
    try {
      const collection = await getOrCreateCollection(request.params.collection);
      const result = await collection.update(
        request.params.id,
        request.body
      );

      if (!result) {
        reply.code(404).send({ error: 'Not Found', message: 'Record not found' });
        return;
      }

      reply.send(result);
    } catch (error) {
      request.log.error(error, 'Failed to update record');
      reply.code(500).send({ error: 'Internal Server Error', message: 'Failed to update record' });
    }
  });

  // Delete record
  app.delete<{
    Params: { collection: string; id: string };
  }>('/:collection/:id', async (request, reply) => {
    try {
      const collection = await getOrCreateCollection(request.params.collection);
      const success = await collection.delete(request.params.id);

      if (!success) {
        reply.code(404).send({ error: 'Not Found', message: 'Record not found' });
        return;
      }

      reply.code(204).send();
    } catch (error) {
      request.log.error(error, 'Failed to delete record');
      reply.code(500).send({ error: 'Internal Server Error', message: 'Failed to delete record' });
    }
  });

  // List all collections
  app.get('/collections', async (request, reply) => {
    try {
      // We need to add this method to the Database interface and implementation
      const collections = await database.listCollections();
      reply.send(collections);
    } catch (error) {
      request.log.error(error, 'Failed to list collections');
      reply.code(500).send({ error: 'Internal Server Error', message: 'Failed to list collections' });
    }
  });
}