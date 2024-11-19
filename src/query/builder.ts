import { QueryFilter, QueryOperators, ComparisonValue, ArrayValue } from '../types/query';
import { BaseRecord } from '../types';

export class QueryBuilder<T extends BaseRecord> {
  private filter: QueryFilter<T>;

  constructor() {
    this.filter = {};
  }

  where(field: keyof T, condition: Partial<QueryOperators> | T[keyof T]): this {
    this.filter[field] = condition;
    return this;
  }

  equals(field: keyof T, value: ComparisonValue): this {
    return this.where(field, { $eq: value });
  }

  notEquals(field: keyof T, value: ComparisonValue): this {
    return this.where(field, { $ne: value });
  }

  greaterThan(field: keyof T, value: number | Date): this {
    return this.where(field, { $gt: value });
  }

  lessThan(field: keyof T, value: number | Date): this {
    return this.where(field, { $lt: value });
  }

  matches(field: keyof T, pattern: string): this {
    return this.where(field, { $regex: pattern });
  }

  in(field: keyof T, values: ArrayValue): this {
    return this.where(field, { $in: values });
  }

  build(): QueryFilter<T> {
    return this.filter;
  }
}