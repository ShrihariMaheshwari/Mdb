# MDB (Modern Database)

A modern, TypeScript-based document database with a React-based UI for easy data management.

## Project Structure

```plaintext
MDB/
├── server/            # Database implementation
│   ├── src/
│   │   ├── types/    # TypeScript type definitions
│   │   ├── core/     # Core database functionality
│   │   ├── storage/  # Storage engine implementation
│   │   ├── query/    # Query building and execution
│   │   ├── server/   # Fastify server setup
│   │   └── utils/    # Utility functions
│   ├── data/         # Database storage
│   └── ...
├── ui/               # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── ...
│   └── ...
└── README.md
```

## Features

### Database Server
- Document-based storage with JSON persistence
- Rich query API with multiple operators
- Type-safe query building
- Collection-level indexing
- Built with Fastify for high performance
- Full TypeScript support

### User Interface
- Modern React-based interface
- Real-time data viewing and editing
- Query builder interface
- Built with Chakra UI for a clean, modern look
- Responsive design

## Getting Started

### Prerequisites
- Node.js 18+
- npm 8+

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/mdb.git
cd mdb
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install UI dependencies
```bash
cd ../ui
npm install
```

### Running the Application

1. Start the database server
```bash
# From the server directory
npm run dev
```

2. Start the UI (in a new terminal)
```bash
# From the ui directory
npm run dev
```

The applications will be available at:
- Database Server: http://localhost:3000
- UI: http://localhost:3001

## API Usage

### Creating a Collection
```typescript
POST /api/collections
{
  "name": "users"
}
```

### Inserting Documents
```typescript
POST /api/users
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

### Querying Documents
```typescript
GET /api/users?query={
  "age": { "$gt": 25 },
  "name": { "$regex": "^John" }
}
```

### Available Query Operators
- `$eq`: Equal to
- `$ne`: Not equal to
- `$gt`: Greater than
- `$gte`: Greater than or equal
- `$lt`: Less than
- `$lte`: Less than or equal
- `$in`: In array
- `$nin`: Not in array
- `$regex`: Regular expression match

## Development

### Server
```bash
cd server
npm run dev     # Start development server
npm run build   # Build for production
npm start       # Run production build
```

### UI
```bash
cd ui
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

## Environment Variables

### Server (.env)
```env
PORT=3000
HOST=localhost
DATA_DIR=./data
NODE_ENV=development
LOG_LEVEL=info
```

### UI (.env)
```env
VITE_API_URL=http://localhost:3000
```

## Folder Structure Details

### Server
- `types/`: TypeScript interfaces and type definitions
- `core/`: Main database implementation
- `storage/`: Storage engine implementation
- `query/`: Query building and execution logic
- `server/`: API routes and server setup
- `utils/`: Helper functions and utilities

### UI
- `components/`: React components
- `hooks/`: Custom React hooks
- `services/`: API integration
- `utils/`: Utility functions
- `theme/`: UI theme configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Todo

- [ ] Add authentication
- [ ] Implement transactions
- [ ] Add schema validation
- [ ] Add backup/restore functionality
- [ ] Add data visualization features
- [ ] Implement relationships between collections
- [ ] Add monitoring dashboard

## Acknowledgments

- Built with [Fastify](https://www.fastify.io/)
- UI built with [React](https://reactjs.org/) and [Chakra UI](https://chakra-ui.com/)
- Developed using [TypeScript](https://www.typescriptlang.org/)