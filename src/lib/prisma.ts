import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

// Define a global type for PrismaClient
declare global {
  var prisma: PrismaClient | undefined;
}

// Function to create a new PrismaClient with error handling and connection pooling
function createPrismaClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
    // Add connection pooling options
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  // Add event listeners for connection issues
  client.$on('query', (e) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Query: ' + e.query);
      console.log('Params: ' + e.params);
      console.log('Duration: ' + e.duration + 'ms');
    }
  });

  client.$on('error', (e) => {
    console.error('Prisma Client error:', e);
  });

  return client;
}

// Initialize PrismaClient with better error handling
let prisma: PrismaClient;

// Check if we're in production or development
if (process.env.NODE_ENV === 'production') {
  // In production, create a new instance
  prisma = createPrismaClient();
} else {
  // In development, use global instance to prevent multiple connections
  if (!global.prisma) {
    global.prisma = createPrismaClient();
  }
  prisma = global.prisma;
}

// Export the prisma client
export { prisma };
