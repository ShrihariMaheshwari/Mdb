export interface DatabaseMetrics {
  storageUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  queryPerformance: {
    averageResponseTime: number;
    percentile95: number;
    percentage: number;
  };
  indexCoverage: {
    indexed: number;
    total: number;
    percentage: number;
  };
}
