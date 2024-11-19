// Export all types
export type { Id } from "./types";
export type { BaseRecord, WithoutBaseRecord } from "./types";
export type {
  Database,
  Collection,
  CollectionOptions,
  DataBaseOptions,
} from "./types/database";
export type {
  QueryFilter,
  QueryOptions,
  QueryOperators,
  ComparisonValue,
  ArrayValue,
} from "./types/query";
export type { StorageEngine } from "./types/storage";

// Export error classes
export { DatabaseError, ValidationError, NotFoundError } from "./types/errors";

// Export implementations
export { DatabaseImpl } from "./core/database";
export { CollectionImpl } from "./core/collection";
export { FileStorageEngine } from "./storage/file-engine";
export { QueryBuilder } from "./query/builder";
export { QueryExecutor } from "./query/executor";

// Export server
export { createServer } from "./server/app";


// Example usage:
/*
import { DatabaseImpl, BaseRecord } from './index';

interface UserRecord extends BaseRecord {
  name: string;
  email: string;
  age: number;
}

async function example() {
  // Initialize database
  const db = new DatabaseImpl({
    dataDir: './data'
  });

  // Create a collection with email index
  const users = await db.createCollection<UserRecord>('users', {
    indexes: 'email'
  });

  // Insert a record
  const user = await users.insert({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  });

  // Query records
  const results = await users.find({
    age: { $gt: 25 },
    name: { $regex: '^John' }
  });

  // Update a record
  await users.update(user.id, {
    age: 31
  });

  // Delete a record
  await users.delete(user.id);

  // Create server
  const server = await createServer(db);
  await server.listen({ port: 3000 });
}
*/
