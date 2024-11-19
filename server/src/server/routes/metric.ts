import { FastifyPluginAsync } from 'fastify';
import { MetricsService } from '../../core/metricService';
import path from 'path';

export const metricsRoutes: FastifyPluginAsync = async (fastify) => {
  const dataDir = path.join(__dirname, '../../data');
  const metricsService = new MetricsService(dataDir);

  fastify.get('/api/metrics', async (request, reply) => {
    try {
      const metrics = await metricsService.getMetrics();
      return { success: true, data: metrics };
    } catch (error) {
      reply.status(500).send({ 
        success: false, 
        error: 'Failed to fetch metrics' 
      });
    }
  });

  fastify.addHook('onRequest', (request) => {
    const start = Date.now();
    request.raw.on('end', async () => {
      const duration = Date.now() - start;
      await metricsService.recordQuery(duration);
    });
  });
};