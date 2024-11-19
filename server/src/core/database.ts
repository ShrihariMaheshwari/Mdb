import {
  Database,
  DataBaseOptions,
  Collection,
  CollectionOptions,
} from "../types/database";
import { BaseRecord } from "../types";
import { FileStorageEngine } from "../storage/file-engine";
import { CollectionImpl } from "./collection";
import { DatabaseError } from "../types/errors";

export class DatabaseImpl implements Database {
  private collections: Map<string, Collection<any>>;
  private storage: FileStorageEngine;

  constructor(options: DataBaseOptions) {
    this.collections = new Map();
    this.storage = new FileStorageEngine(options.dataDir);
  }

  async createCollection<T extends BaseRecord>(
    name: string,
    options?: CollectionOptions
  ): Promise<Collection<T>> {
    if (this.collections.has(name)) {
      throw new DatabaseError(
        `Collection ${name} already exists`,
        "COLLECTION_EXISTS"
      );
    }

    const collection = new CollectionImpl<T>(name, this.storage, options);
    await collection.initialize();
    this.collections.set(name, collection);
    return collection;
  }

  collection<T extends BaseRecord>(name: string): Collection<T> {
    const collection = this.collections.get(name);
    if (!collection) {
      throw new DatabaseError(
        `Collection ${name} does not exist`,
        "COLLECTION_NOT_FOUND"
      );
    }
    return collection;
  }

  async listCollections(): Promise<string[]> {
    return Array.from(this.collections.keys());
  }
}
