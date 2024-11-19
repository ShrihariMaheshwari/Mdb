# TypeScript Database with Fastify API

A lightweight, type-safe database implementation with a Fastify-powered REST API. This project provides a flexible document database with CRUD operations, querying capabilities, and a high-performance HTTP interface.

## Features

- 📦 Document-based storage with JSON persistence
- 🔍 Rich query API with comparison and regex operators
- 🚀 High-performance Fastify server
- 📝 Complete TypeScript support
- 🔑 Collection-level indexing
- 🔄 Automatic timestamps
- 🔒 Type-safe query building
- 📊 Request logging and monitoring

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/typescript-database.git

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

## Project Structure

```plaintext
src/
├── types/                  # Type definitions
│   ├── index.ts           # Base types
│   ├── database.ts        # Database interfaces
│   ├── query.ts           # Query types
│   ├── storage.ts         # Storage interfaces
│   └── errors.ts          # Error definitions
├── storage/
│   └── file-engine.ts     # File system storage implementation
├── query/
│   ├── builder.ts         # Query builder
│   └── executor.ts        # Query executor
├── core/
│   ├── database.ts        # Main database implementation
│   └── collection.ts      # Collection implementation
├── server/
│   ├── app.ts            # Fastify server setup
│   ├── plugins/
│   │   ├── error-handler.ts
│   │   └── validator.ts
│   └── routes/
│       ├── collections.ts
│       └── health.ts
├── utils/
│   ├── logger.ts         # Logging utility
│   └── errors.ts         # Error utilities
└── index.ts              # Main entry point
```

## Usage

### Basic Database Operations

```typescript
import { DatabaseImpl, BaseRecord } from './index';

// Define your record type
interface UserRecord extends BaseRecord {
  name: string;
  email: string;
  age: number;
}

// Initialize database
const db = new DatabaseImpl({
  dataDir: './data'
});

// Create a collection
const users = await db.createCollection<UserRecord>('users', {
  indexes: 'email' // Add unique index on email
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
```

### Using the Query Builder

```typescript
import { QueryBuilder } from './query/builder';

const query = new QueryBuilder<UserRecord>()
  .where('age', { $gt: 25 })
  .where('name', { $regex: '^John' })
  .build();

const results = await users.find(query);
```

### REST API Endpoints

```plaintext
POST   /api/:collection       # Create a new record
GET    /api/:collection      # Query records
GET    /api/:collection/:id  # Get record by ID
PUT    /api/:collection/:id  # Update record
DELETE /api/:collection/:id  # Delete record
```

Example API request:

```bash
# Create a new user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "age": 30}'

# Query users
curl http://localhost:3000/api/users?query={"age":{"$gt":25}}
```

## Query Operators

- `$eq`: Equal to
- `$ne`: Not equal to
- `$gt`: Greater than
- `$gte`: Greater than or equal
- `$lt`: Less than
- `$lte`: Less than or equal
- `$in`: In array
- `$nin`: Not in array
- `$regex`: Regular expression match

## Configuration

Environment variables:

```env
PORT=3000
HOST=localhost
DATA_DIR=./data
NODE_ENV=development
LOG_LEVEL=info
```

## Development

```bash
# Run in development mode
npm run dev

# Build the project
npm run build

# Lint the code
npm run lint

# Format the code
npm run format
```

## Dependencies

- `fastify`: Web framework
- `@fastify/cors`: CORS support
- `pino`: Logging
- `fs-extra`: Enhanced file system operations
- `uuid`: ID generation
- `ajv`: JSON Schema validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Todo

- [ ] Add authentication/authorization
- [ ] Implement transactions
- [ ] Add more complex indexing
- [ ] Add caching layer
- [ ] Implement backup/restore functionality
- [ ] Add schema validation
- [ ] Add more query operators
- [ ] Implement relationships between collections