import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

// Function to create a new PrismaClient with error handling
function createPrismaClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

  // Add error handling for connection issues
  client.$connect().catch((err) => {
    console.error('Failed to connect to the database:', err);
  });

  return client;
}

// Initialize PrismaClient
if (process.env.NODE_ENV === 'production') {
  prisma = createPrismaClient();
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  prisma = globalForPrisma.prisma;
}

export { prisma };
