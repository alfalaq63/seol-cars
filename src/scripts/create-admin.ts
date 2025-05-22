import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting admin user creation...');

    // Check if any users exist
    const userCount = await prisma.user.count();

    if (userCount > 0) {
      console.log('Users already exist in the database. Checking for admin user...');

      // Check if admin@admin.com exists
      const adminUser = await prisma.user.findUnique({
        where: {
          email: 'admin@admin.com',
        },
      });

      if (adminUser) {
        console.log('Admin user already exists with email admin@admin.com');
        return;
      }

      console.log('Creating new admin user...');
    } else {
      console.log('No users found. Creating first admin user...');
    }

    // Hash the password
    const hashedPassword = await hash('admin', 10);

    // Create the admin user
    const user = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@admin.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('Admin user created successfully:');
    console.log({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    console.log('\nYou can now login with:');
    console.log('Email: admin@admin.com');
    console.log('Password: admin');

  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
