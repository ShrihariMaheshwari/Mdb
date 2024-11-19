
<div align="center">

# 🚀 MDB

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://www.fastify.io/)
[![Chakra UI](https://img.shields.io/badge/Chakra_UI-319795?style=for-the-badge&logo=chakra-ui&logoColor=white)](https://chakra-ui.com/)

A modern, TypeScript-based document database with an intuitive React dashboard for seamless data management.

[Getting Started](#getting-started) •
[Features](#features) •
[Documentation](#documentation) •
[Contributing](#contributing)

</div>

---

## ✨ Features

### 🛢️ Database Server
- **Document Storage**: JSON-based persistent storage
- **Rich Query API**: Powerful query operators
- **Type Safety**: Full TypeScript support
- **Indexing**: Collection-level indexing for performance
- **High Performance**: Built with Fastify
- **Real-time**: Live data updates

### 🎨 User Interface
- **Modern Dashboard**: Clean, intuitive interface
- **Live Updates**: Real-time data visualization
- **Query Builder**: Visual query construction
- **Responsive Design**: Works on all devices
- **Dark Mode**: Built-in theme support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 8+

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/mdb.git
cd mdb

# Install dependencies and start both server and UI
npm install
npm run dev
```

Visit:
- 🎯 Database Server: http://localhost:3000
- 🎨 Dashboard UI: http://localhost:3001

## 📁 Project Structure

```
MDB/
├── server/                # Database Server
│   ├── src/
│   │   ├── types/        # Type definitions
│   │   ├── core/         # Core database logic
│   │   ├── storage/      # Storage implementation
│   │   ├── query/        # Query processing
│   │   ├── server/       # API endpoints
│   │   └── utils/        # Utilities
│   ├── data/             # Data storage
│   └── package.json
├── ui/                    # React Dashboard
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API integration
│   │   └── utils/        # Utilities
│   └── package.json
└── README.md
```

## 📚 Documentation

### API Reference

#### Collections

```typescript
// Create a collection
POST /api/collections
{
  "name": "users"
}

// List collections
GET /api/collections
```

#### Documents

```typescript
// Create document
POST /api/:collection
{
  "name": "John Doe",
  "email": "john@example.com"
}

// Query documents
GET /api/:collection?query={
  "age": { "$gt": 25 },
  "name": { "$regex": "^John" }
}

// Update document
PUT /api/:collection/:id
{
  "age": 31
}

// Delete document
DELETE /api/:collection/:id
```

### Query Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equals | `{ "age": { "$eq": 25 } }` |
| `$gt` | Greater than | `{ "age": { "$gt": 25 } }` |
| `$lt` | Less than | `{ "price": { "$lt": 100 } }` |
| `$in` | In array | `{ "status": { "$in": ["active", "pending"] } }` |
| `$regex` | RegExp match | `{ "name": { "$regex": "^John" } }` |

## 🛠️ Development

### Server

```bash
cd server

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### UI

```bash
cd ui

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

#### Server (.env)
```env
PORT=3000
HOST=localhost
DATA_DIR=./data
NODE_ENV=development
LOG_LEVEL=info
```

#### UI (.env)
```env
VITE_API_URL=http://localhost:3000
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Todo

- [ ] Authentication & Authorization
- [ ] Transactions Support
- [ ] Schema Validation
- [ ] Backup/Restore
- [ ] Advanced Data Visualization
- [ ] Collection Relationships
- [ ] Monitoring Dashboard

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with:
- [Fastify](https://www.fastify.io/) - Fast and low overhead web framework
- [React](https://reactjs.org/) - UI library
- [Chakra UI](https://chakra-ui.com/) - Component library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Frontend tooling

---

<div align="center">

Made with ❤️ by Shrihari

[Report Bug](https://github.com/ShrihariMaheshwari/mdb/issues) • [Request Feature](https://github.com/ShrihariMaheshwari/mdb/issues)

</div>