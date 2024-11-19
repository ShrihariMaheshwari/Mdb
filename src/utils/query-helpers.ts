import { QueryOperators } from '../types/query';

export function isQueryOperators(value: any): value is Partial<QueryOperators> {
  if (!value || typeof value !== 'object') return false;
  const validOperators = ['$eq', '$ne', '$gt', '$gte', '$lt', '$lte', '$in', '$nin', '$regex'];
  return Object.keys(value).some(key => validOperators.includes(key));
}

export function isComparable(value: any): value is number | Date {
  return typeof value === 'number' || value instanceof Date;
}

export function evaluateCondition(operator: keyof QueryOperators, value: any, recordValue: any): boolean {
  switch (operator) {
    case '$eq':
      return recordValue === value;
    case '$ne':
      return recordValue !== value;
    case '$gt':
      return isComparable(value) && isComparable(recordValue) && recordValue > value;
    case '$gte':
      return isComparable(value) && isComparable(recordValue) && recordValue >= value;
    case '$lt':
      return isComparable(value) && isComparable(recordValue) && recordValue < value;
    case '$lte':
      return isComparable(value) && isComparable(recordValue) && recordValue <= value;
    case '$in':
      return Array.isArray(value) && value.includes(recordValue);
    case '$nin':
      return Array.isArray(value) && !value.includes(recordValue);
    case '$regex':
      return typeof value === 'string' && 
             typeof recordValue === 'string' && 
             new RegExp(value).test(recordValue);
    default:
      return false;
  }
}