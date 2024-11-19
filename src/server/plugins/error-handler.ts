import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { DatabaseError, ValidationError, NotFoundError } from '../../types/errors';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  request.log.error(error);

  if (error instanceof ValidationError) {
    return reply.status(400).send({
      error: 'Validation Error',
      message: error.message
    });
  }

  if (error instanceof NotFoundError) {
    return reply.status(404).send({
      error: 'Not Found',
      message: error.message
    });
  }

  if (error instanceof DatabaseError) {
    return reply.status(500).send({
      error: 'Database Error',
      message: error.message
    });
  }

  // Default error
  reply.status(500).send({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
}