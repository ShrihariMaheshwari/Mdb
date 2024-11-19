import { v4 as uuidv4 } from "uuid";
import { Collection, CollectionOptions } from "../types/database";
import { BaseRecord, Id, WithoutBaseRecord } from "../types";
import { QueryFilter, QueryOperators } from "../types/query";
import { StorageEngine } from "../types/storage";
import { ValidationError } from "../types/errors";

export class CollectionImpl<T extends BaseRecord> implements Collection<T> {
  private data: Map<Id, T>;
  private indexes: Set<string>;

  constructor(
    private name: string,
    private storage: StorageEngine,
    options: CollectionOptions = {}
  ) {
    this.data = new Map();
    this.indexes = new Set(options.indexes ? [options.indexes] : []);
  }

  async initialize(): Promise<void> {
    this.data = await this.storage.read<T>(this.name);
  }

  async insert(data: WithoutBaseRecord<T>): Promise<T> {
    const id = uuidv4();
    const now = new Date();

    const record = {
      id,
      createdAt: now,
      updatedAt: now,
      ...data,
    } as T;

    // Check indexes
    if (this.indexes.size > 0) {
      for (const field of this.indexes) {
        const value = (data as any)[field];
        if (value !== undefined) {
          const exists = Array.from(this.data.values()).some(
            (record) => (record as any)[field] === value
          );
          if (exists) {
            throw new ValidationError(`Unique constraint violation: ${field}`);
          }
        }
      }
    }

    this.data.set(id, record);
    await this.save();
    return record;
  }

  async findById(id: Id): Promise<T | null> {
    const record = this.data.get(id);
    return record || null;
  }

  async find(filter: QueryFilter<T> = {}): Promise<T[]> {
    let results = Array.from(this.data.values());

    results = results.filter((record) => {
      return Object.entries(filter).every(([field, condition]) => {
        if (this.isQueryOperators(condition)) {
          return Object.entries(condition).every(([operator, value]) => {
            const recordValue = (record as any)[field];
            return this.evaluateCondition(
              operator as keyof QueryOperators,
              value,
              recordValue
            );
          });
        }
        return (record as any)[field] === condition;
      });
    });

    return results;
  }

  async update(id: Id, data: Partial<WithoutBaseRecord<T>>): Promise<T | null> {
    const existing = this.data.get(id);
    if (!existing) {
      return null;
    }

    // Check indexes
    if (this.indexes.size > 0) {
      for (const field of this.indexes) {
        const value = (data as any)[field];
        if (value !== undefined) {
          const exists = Array.from(this.data.values()).some(
            (record) => record.id !== id && (record as any)[field] === value
          );
          if (exists) {
            throw new ValidationError(`Unique constraint violation: ${field}`);
          }
        }
      }
    }

    const updated = {
      ...existing,
      ...data,
      id,
      updatedAt: new Date(),
    };

    this.data.set(id, updated);
    await this.save();
    return updated;
  }

  async delete(id: Id): Promise<boolean> {
    const exists = this.data.has(id);
    if (!exists) {
      return false;
    }

    this.data.delete(id);
    await this.save();
    return true;
  }

  private async save(): Promise<void> {
    await this.storage.write(this.name, this.data);
  }

  private isQueryOperators(value: any): value is Partial<QueryOperators> {
    if (!value || typeof value !== "object") return false;
    const validOperators = [
      "$eq",
      "$ne",
      "$gt",
      "$gte",
      "$lt",
      "$lte",
      "$in",
      "$nin",
      "$regex",
    ];
    return Object.keys(value).some((key) => validOperators.includes(key));
  }

  private evaluateCondition(
    operator: keyof QueryOperators,
    value: any,
    recordValue: any
  ): boolean {
    switch (operator) {
      case "$eq":
        return recordValue === value;
      case "$ne":
        return recordValue !== value;
      case "$gt":
        return (
          this.isComparable(value) &&
          this.isComparable(recordValue) &&
          recordValue > value
        );
      case "$gte":
        return (
          this.isComparable(value) &&
          this.isComparable(recordValue) &&
          recordValue >= value
        );
      case "$lt":
        return (
          this.isComparable(value) &&
          this.isComparable(recordValue) &&
          recordValue < value
        );
      case "$lte":
        return (
          this.isComparable(value) &&
          this.isComparable(recordValue) &&
          recordValue <= value
        );
      case "$in":
        return Array.isArray(value) && value.includes(recordValue);
      case "$nin":
        return Array.isArray(value) && !value.includes(recordValue);
      case "$regex":
        return (
          typeof value === "string" &&
          typeof recordValue === "string" &&
          new RegExp(value).test(recordValue)
        );
      default:
        return false;
    }
  }

  private isComparable(value: any): value is number | Date {
    return typeof value === "number" || value instanceof Date;
  }
}
