import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database setup...');

    // Test database connection
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('Database connection successful!');

    // Note: Database creation is handled by the hosting provider
    // For PostgreSQL, we don't need to create the database manually

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    console.error('Make sure your DATABASE_URL is correctly configured');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
