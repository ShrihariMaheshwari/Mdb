export interface RequestMetrics {
    url: string;
    method: string;
    statusCode: number;
    startTime: number;
    endTime: number;
    duration: number;
  }
  
  export class MetricsCollector {
    private requests: RequestMetrics[] = [];
  
    startRequest(url: string, method: string): number {
      const startTime = Date.now();
      return startTime;
    }
  
    endRequest(startTime: number, url: string, method: string, statusCode: number): RequestMetrics {
      const endTime = Date.now();
      const metrics: RequestMetrics = {
        url,
        method,
        statusCode,
        startTime,
        endTime,
        duration: endTime - startTime
      };
      this.requests.push(metrics);
      return metrics;
    }
  
    getAverageResponseTime(): number {
      if (this.requests.length === 0) return 0;
      const total = this.requests.reduce((sum, req) => sum + req.duration, 0);
      return total / this.requests.length;
    }
  
    getMetricsByEndpoint(): Record<string, { count: number; avgDuration: number }> {
      const endpoints: Record<string, number[]> = {};
      
      for (const req of this.requests) {
        if (!endpoints[req.url]) {
          endpoints[req.url] = [];
        }
        endpoints[req.url].push(req.duration);
      }
  
      return Object.entries(endpoints).reduce((acc, [url, durations]) => {
        acc[url] = {
          count: durations.length,
          avgDuration: durations.reduce((sum, dur) => sum + dur, 0) / durations.length
        };
        return acc;
      }, {} as Record<string, { count: number; avgDuration: number }>);
    }
  }
  
  export const metrics = new MetricsCollector();