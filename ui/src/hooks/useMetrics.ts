// ui/src/hooks/useMetrics.ts
import { useState, useEffect } from 'react';
import { DatabaseMetrics } from '../types/metrics';

export function useMetrics() {
  const [metrics, setMetrics] = useState<DatabaseMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('http://localhost:3000/metrics');
        if (!response.ok) throw new Error('Failed to fetch metrics');
        const data = await response.json();
        
        // Transform the server metrics format to match DatabaseMetrics
        const transformedMetrics: DatabaseMetrics = {
          storageUsage: {
            used: 0,
            total: 1024 * 1024 * 1024,
            percentage: 0
          },
          queryPerformance: {
            averageResponseTime: data.averageResponseTime,
            percentile95: 0,
            percentage: Math.round((1000 - data.averageResponseTime) / 10)
          },
          indexCoverage: {
            indexed: Object.keys(data.endpointMetrics).length,
            total: Object.keys(data.endpointMetrics).length,
            percentage: 100
          }
        };
        
        setMetrics(transformedMetrics);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch metrics'));
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return { metrics, loading, error };
}