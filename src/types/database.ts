import { BaseRecord, Id, WithoutBaseRecord } from "./index";
import { QueryFilter } from "./query";

export interface DataBaseOptions {
  dataDir: string;
}

export interface CollectionOptions {
  indexes?: string;
}

export interface Database {
  createCollection<T extends BaseRecord>(
    name: string,
    options?: CollectionOptions
  ): Promise<Collection<T>>;
  collection<T extends BaseRecord>(name: string): Collection<T>;
  listCollections(): Promise<string[]>;
}

export interface Collection<T extends BaseRecord> {
  insert(data: WithoutBaseRecord<T>): Promise<T>;
  findById(id: Id): Promise<T | null>;
  find(query: QueryFilter<T>): Promise<T[]>;
  update(id: Id, data: Partial<WithoutBaseRecord<T>>): Promise<T | null>;
  delete(id: Id): Promise<boolean>;
}
