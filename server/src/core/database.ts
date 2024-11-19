// server/src/core/database.ts
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
  private initialized: boolean = false;

  constructor(options: DataBaseOptions) {
    this.collections = new Map();
    this.storage = new FileStorageEngine(options.dataDir);
  }

  private async initialize() {
    if (this.initialized) return;

    try {
      // Read existing collections from storage
      const existingCollections = await this.storage.listCollections();
      
      // Initialize each existing collection
      for (const collectionName of existingCollections) {
        if (!this.isValidCollectionName(collectionName)) {
          continue;
        }

        const collection = new CollectionImpl<BaseRecord>(
          collectionName, 
          this.storage
        );
        await collection.initialize();
        this.collections.set(collectionName, collection);
      }

      this.initialized = true;
    } catch (err) {
      const error = err as Error;
      throw new DatabaseError(
        `Failed to initialize database: ${error.message}`,
        'INITIALIZATION_ERROR'
      );
    }
  }

  private isValidCollectionName(name: string): boolean {
    return Boolean(
      name &&
      typeof name === 'string' &&
      name.length > 0 &&
      name !== 'collections' &&
      /^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)
    );
  }

  async createCollection<T extends BaseRecord>(
    name: string,
    options?: CollectionOptions
  ): Promise<Collection<T>> {
    await this.initialize();

    if (!this.isValidCollectionName(name)) {
      throw new DatabaseError(
        `Invalid collection name: ${name}`,
        'INVALID_COLLECTION_NAME'
      );
    }

    if (await this.storage.exists(name)) {
      throw new DatabaseError(
        `Collection ${name} already exists`,
        'COLLECTION_EXISTS'
      );
    }

    const collection = new CollectionImpl<T>(name, this.storage, options);
    await collection.initialize();
    this.collections.set(name, collection);

    // Initialize empty collection file
    await this.storage.write(name, new Map());

    return collection;
  }

  collection<T extends BaseRecord>(name: string): Collection<T> {
    if (!this.initialized) {
      throw new DatabaseError(
        'Database not initialized. Call initialize() first',
        'NOT_INITIALIZED'
      );
    }

    if (!this.isValidCollectionName(name)) {
      throw new DatabaseError(
        `Invalid collection name: ${name}`,
        'INVALID_COLLECTION_NAME'
      );
    }

    const collection = this.collections.get(name);
    if (!collection) {
      throw new DatabaseError(
        `Collection ${name} does not exist`,
        'COLLECTION_NOT_FOUND'
      );
    }

    return collection as Collection<T>;
  }

  async listCollections(): Promise<string[]> {
    await this.initialize();
    return Array.from(this.collections.keys());
  }

  async dropCollection(name: string): Promise<void> {
    await this.initialize();

    if (!this.isValidCollectionName(name)) {
      throw new DatabaseError(
        `Invalid collection name: ${name}`,
        'INVALID_COLLECTION_NAME'
      );
    }

    if (!this.collections.has(name)) {
      throw new DatabaseError(
        `Collection ${name} does not exist`,
        'COLLECTION_NOT_FOUND'
      );
    }

    await this.storage.delete(name);
    this.collections.delete(name);
  }

  // Helper method to clean up invalid collections
  async cleanup(): Promise<void> {
    try {
      const collections = await this.storage.listCollections();
      
      for (const name of collections) {
        if (!this.isValidCollectionName(name)) {
          await this.storage.delete(name);
          this.collections.delete(name);
        }
      }
    } catch (err) {
      const error = err as Error;
      throw new DatabaseError(
        `Failed to cleanup collections: ${error.message}`,
        'CLEANUP_ERROR'
      );
    }
  }
}