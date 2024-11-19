import { FastifyInstance } from 'fastify';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function registerRootRoutes(app: FastifyInstance) {
  // Serve welcome page at root
  app.get('/', async (request, reply) => {
    return {
      name: "MDb API",
      version: "1.0.0",
      description: "A TypeScript-based database with RESTful API",
      endpoints: {
        api: {
          collections: "/api/:collection",
          docs: "/docs",
        },
        health: "/health",
        metrics: "/metrics"
      }
    };
  });

  // Optional: Serve API documentation
  app.get('/docs', async (request, reply) => {
    return {
      openapi: "3.0.0",
      info: {
        title: "MDb API Documentation",
        version: "1.0.0"
      },
      paths: {
        "/api/{collection}": {
          get: {
            summary: "Get all documents in a collection",
            parameters: [
              {
                name: "collection",
                in: "path",
                required: true,
                schema: { type: "string" }
              }
            ]
          },
          post: {
            summary: "Create a new document in a collection"
          }
        }
      }
    };
  });

  // Serve favicon
  app.get('/favicon.ico', async (request, reply) => {
    reply.type('image/x-icon').send(''); // Empty favicon response
  });
}