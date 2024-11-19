import { FastifyInstance } from 'fastify';
import { metrics } from '../../utils/metrics';

export async function registerHealthRoutes(app: FastifyInstance) {
  app.get('/', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  }));

  app.get('/metrics', async () => ({
    status: 'ok',
    metrics: {
      uptime: process.uptime(),
      averageResponseTime: metrics.getAverageResponseTime(),
      endpointMetrics: metrics.getMetricsByEndpoint()
    },
    memory: {
      heapUsed: process.memoryUsage().heapUsed,
      heapTotal: process.memoryUsage().heapTotal,
      external: process.memoryUsage().external
    }
  }));
}