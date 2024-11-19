import { QueryFilter, QueryOptions, QueryOperators } from '../types/query';
import { BaseRecord } from '../types';
import { isQueryOperators, evaluateCondition } from '../utils/query-helpers';

export class QueryExecutor<T extends BaseRecord> {
  constructor(private data: T[]) {}

  execute(filter: QueryFilter<T>, options?: QueryOptions): T[] {
    let results = this.applyFilter(filter);
    
    if (options?.orderBy) {
      results = this.applySorting(results, options.orderBy);
    }

    if (options?.offset) {
      results = results.slice(options.offset);
    }

    if (options?.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  private applyFilter(filter: QueryFilter<T>): T[] {
    return this.data.filter(record => {
      return Object.entries(filter).every(([field, condition]) => {
        if (isQueryOperators(condition)) {
          return Object.entries(condition).every(([operator, value]) => {
            const recordValue = (record as any)[field];
            return evaluateCondition(operator as keyof QueryOperators, value, recordValue);
          });
        }
        return (record as any)[field] === condition;
      });
    });
  }

  private applySorting(records: T[], orderBy: QueryOptions['orderBy']): T[] {
    if (!orderBy) return records;

    return [...records].sort((a, b) => {
      const aVal = (a as any)[orderBy.field];
      const bVal = (b as any)[orderBy.field];
      
      if (orderBy.direction === 'asc') {
        return this.compare(aVal, bVal);
      }
      return this.compare(bVal, aVal);
    });
  }

  private compare(a: any, b: any): number {
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() - b.getTime();
    }
    return a > b ? 1 : -1;
  }
}