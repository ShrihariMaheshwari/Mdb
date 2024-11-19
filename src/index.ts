import { DatabaseImpl } from './core/database';
import { createServer } from './server/app';

async function main() {
  try {
    console.log('Starting database server...');

    // Initialize the database
    const db = new DatabaseImpl({
      dataDir: './data'
    });

    console.log('Database initialized.');

    // Create the server
    const server = await createServer(db, {
      port: Number(process.env.PORT) || 3000,
      host: process.env.HOST || 'localhost'
    });

    // Start listening
    await server.listen({
      port: Number(process.env.PORT) || 3000,
      host: '0.0.0.0' // This allows connections from any IP
    });

    console.log('\n=================================');
    console.log(`🚀 Server is running on:`);
    console.log(`   http://localhost:${process.env.PORT || 3000}`);
    console.log('=================================\n');

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the application
main().catch(console.error);