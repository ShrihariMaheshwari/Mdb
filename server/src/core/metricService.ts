import fs from 'fs/promises';
import { DatabaseMetrics } from '../types/metrics';

export class MetricsService {
  private queryMetrics: Array<{ timestamp: number; duration: number; }> = [];
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    setInterval(() => this.cleanOldMetrics(), 60000);
  }

  private cleanOldMetrics(): void {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    this.queryMetrics = this.queryMetrics.filter(m => m.timestamp > fiveMinutesAgo);
  }

  async recordQuery(duration: number): Promise<void> {
    this.queryMetrics.push({ timestamp: Date.now(), duration });
  }

  async getMetrics(): Promise<DatabaseMetrics> {
    const [storage, query, index] = await Promise.all([
      this.getStorageMetrics(),
      this.getQueryMetrics(),
      this.getIndexMetrics()
    ]);

    return { storageUsage: storage, queryPerformance: query, indexCoverage: index };
  }

  private async getStorageMetrics() {
    const total = 1024 * 1024 * 1024; // 1GB limit
    const used = await this.getDirSize(this.dataDir);
    return {
      used,
      total,
      percentage: Math.round((used / total) * 100)
    };
  }

  private async getDirSize(dir: string): Promise<number> {
    const files = await fs.readdir(dir);
    const sizes = await Promise.all(
      files.map(async file => {
        const path = `${dir}/${file}`;
        const stat = await fs.stat(path);
        return stat.isDirectory() ? await this.getDirSize(path) : stat.size;
      })
    );
    return sizes.reduce((acc, size) => acc + size, 0);
  }

  private async getQueryMetrics() {
    if (this.queryMetrics.length === 0) {
      return { averageResponseTime: 0, percentile95: 0, percentage: 100 };
    }

    const durations = this.queryMetrics.map(m => m.duration);
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    
    return {
      averageResponseTime: avg,
      percentile95: durations.sort((a, b) => a - b)[Math.floor(durations.length * 0.95)],
      percentage: Math.round((1000 - avg) / 10)
    };
  }

  private async getIndexMetrics() {
    const collections = await fs.readdir(this.dataDir);
    const indexed = collections.length;
    return {
      indexed,
      total: collections.length,
      percentage: collections.length ? 100 : 0
    };
  }
}