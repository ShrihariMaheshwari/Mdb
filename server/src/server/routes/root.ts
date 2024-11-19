// src/server/routes/root.ts
import { FastifyInstance } from 'fastify';
import { version } from '../../../package.json';

export async function registerRootRoutes(app: FastifyInstance) {
  // Serve welcome page at root
  app.get('/', async (request, reply) => {
    return {
      name: "MDb API",
      version,
      description: "A TypeScript-based document database with RESTful API",
      repository: "https://github.com/ShrihariMaheshwari/Mdb",
      endpoints: {
        documentation: "/docs",
        api: {
          collections: {
            list: "GET /api/collections",
            create: "POST /api/:collection",
            query: "GET /api/:collection",
            getById: "GET /api/:collection/:id",
            update: "PUT /api/:collection/:id",
            delete: "DELETE /api/:collection/:id"
          }
        },
        monitoring: {
          health: "GET /health",
          metrics: "GET /health/metrics"
        }
      },
      queryOperators: {
        comparison: ["$eq", "$ne", "$gt", "$gte", "$lt", "$lte"],
        array: ["$in", "$nin"],
        text: ["$regex"]
      }
    };
  });

  // Enhanced API documentation
  app.get('/docs', async (request, reply) => {
    return {
      openapi: "3.0.0",
      info: {
        title: "MDb API Documentation",
        version,
        description: "A TypeScript-based document database with RESTful API",
        contact: {
          name: "Shrihari Maheshwari",
          url: "https://github.com/ShrihariMaheshwari/Mdb"
        },
        license: {
          name: "MIT",
          url: "https://opensource.org/licenses/MIT"
        }
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Local development server"
        }
      ],
      tags: [
        {
          name: "Collections",
          description: "Collection management endpoints"
        },
        {
          name: "Documents",
          description: "Document CRUD operations"
        },
        {
          name: "Monitoring",
          description: "Health and metrics endpoints"
        }
      ],
      paths: {
        "/api/collections": {
          get: {
            tags: ["Collections"],
            summary: "List all collections",
            description: "Returns a list of all available collections in the database",
            responses: {
              "200": {
                description: "A list of collection names",
                content: {
                  "application/json": {
                    example: ["users", "posts", "comments"]
                  }
                }
              }
            }
          }
        },
        "/api/{collection}": {
          post: {
            tags: ["Documents"],
            summary: "Create a new document",
            description: "Creates a new document in the specified collection. Creates the collection if it doesn't exist.",
            parameters: [
              {
                name: "collection",
                in: "path",
                required: true,
                schema: { type: "string" },
                description: "Collection name"
              }
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  example: {
                    name: "John Doe",
                    email: "john@example.com",
                    age: 30
                  }
                }
              }
            },
            responses: {
              "201": {
                description: "Document created successfully",
                content: {
                  "application/json": {
                    example: {
                      id: "123e4567-e89b-12d3-a456-426614174000",
                      name: "John Doe",
                      email: "john@example.com",
                      age: 30,
                      createdAt: "2024-02-19T12:00:00.000Z",
                      updatedAt: "2024-02-19T12:00:00.000Z"
                    }
                  }
                }
              },
              "400": {
                description: "Invalid request body or validation error",
                content: {
                  "application/json": {
                    example: {
                      error: "Validation Error",
                      message: "Invalid email format"
                    }
                  }
                }
              }
            }
          },
          get: {
            tags: ["Documents"],
            summary: "Query documents",
            description: "Query documents in the collection with optional filters",
            parameters: [
              {
                name: "collection",
                in: "path",
                required: true,
                schema: { type: "string" },
                description: "Collection name"
              },
              {
                name: "query",
                in: "query",
                schema: { type: "string" },
                description: "JSON query string with filter conditions",
                example: '{"age":{"$gt":25},"name":{"$regex":"^John"}}'
              }
            ],
            responses: {
              "200": {
                description: "Array of matching documents",
                content: {
                  "application/json": {
                    example: [
                      {
                        id: "123e4567-e89b-12d3-a456-426614174000",
                        name: "John Doe",
                        email: "john@example.com",
                        age: 30,
                        createdAt: "2024-02-19T12:00:00.000Z",
                        updatedAt: "2024-02-19T12:00:00.000Z"
                      }
                    ]
                  }
                }
              }
            }
          }
        },
        "/api/{collection}/{id}": {
          get: {
            tags: ["Documents"],
            summary: "Get document by ID",
            parameters: [
              {
                name: "collection",
                in: "path",
                required: true,
                schema: { type: "string" }
              },
              {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string" }
              }
            ],
            responses: {
              "200": {
                description: "The requested document",
                content: {
                  "application/json": {
                    example: {
                      id: "123e4567-e89b-12d3-a456-426614174000",
                      name: "John Doe",
                      email: "john@example.com",
                      age: 30,
                      createdAt: "2024-02-19T12:00:00.000Z",
                      updatedAt: "2024-02-19T12:00:00.000Z"
                    }
                  }
                }
              },
              "404": {
                description: "Document not found",
                content: {
                  "application/json": {
                    example: {
                      error: "Not Found",
                      message: "Document not found"
                    }
                  }
                }
              }
            }
          },
          put: {
            tags: ["Documents"],
            summary: "Update document",
            parameters: [
              {
                name: "collection",
                in: "path",
                required: true,
                schema: { type: "string" }
              },
              {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string" }
              }
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  example: {
                    age: 31,
                    email: "john.doe@example.com"
                  }
                }
              }
            },
            responses: {
              "200": {
                description: "Updated document",
                content: {
                  "application/json": {
                    example: {
                      id: "123e4567-e89b-12d3-a456-426614174000",
                      name: "John Doe",
                      email: "john.doe@example.com",
                      age: 31,
                      createdAt: "2024-02-19T12:00:00.000Z",
                      updatedAt: "2024-02-19T12:01:00.000Z"
                    }
                  }
                }
              },
              "404": {
                description: "Document not found"
              }
            }
          },
          delete: {
            tags: ["Documents"],
            summary: "Delete document",
            parameters: [
              {
                name: "collection",
                in: "path",
                required: true,
                schema: { type: "string" }
              },
              {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string" }
              }
            ],
            responses: {
              "204": {
                description: "Document deleted successfully"
              },
              "404": {
                description: "Document not found"
              }
            }
          }
        },
        "/health": {
          get: {
            tags: ["Monitoring"],
            summary: "Health check",
            description: "Check if the service is healthy",
            responses: {
              "200": {
                description: "Service health information",
                content: {
                  "application/json": {
                    example: {
                      status: "ok",
                      timestamp: "2024-02-19T12:00:00.000Z",
                      uptime: 3600
                    }
                  }
                }
              }
            }
          }
        },
        "/health/metrics": {
          get: {
            tags: ["Monitoring"],
            summary: "Service metrics",
            description: "Get detailed service metrics",
            responses: {
              "200": {
                description: "Service metrics",
                content: {
                  "application/json": {
                    example: {
                      uptime: 3600,
                      averageResponseTime: 50,
                      endpointMetrics: {
                        "/api/users": {
                          count: 100,
                          avgDuration: 45
                        }
                      },
                      memory: {
                        heapUsed: 50331648,
                        heapTotal: 67108864
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      components: {
        schemas: {
          Error: {
            type: "object",
            properties: {
              error: {
                type: "string",
                description: "Error type"
              },
              message: {
                type: "string",
                description: "Error message"
              }
            }
          }
        },
        securitySchemes: {
          // For future use
          apiKey: {
            type: "apiKey",
            in: "header",
            name: "X-API-Key"
          }
        }
      }
    };
  });

  // Serve favicon
  app.get('/favicon.ico', async (request, reply) => {
    reply.type('image/x-icon').send('');
  });
}