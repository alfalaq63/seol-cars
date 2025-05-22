import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database setup...');

    // Create database tables
    console.log('Creating database tables...');
    await prisma.$executeRaw`CREATE DATABASE IF NOT EXISTS siol_libya_cars`;
    
    // Run migrations
    console.log('Running migrations...');
    // This is handled by Prisma migrate

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
