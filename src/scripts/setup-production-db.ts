import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function setupProductionDatabase() {
  try {
    console.log('🚀 Setting up production database...');

    // Check if database is accessible
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@admin.com' }
    });

    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin', 12);
    
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@admin.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user created successfully:');
    console.log({
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role
    });

    console.log('\n🎉 Production database setup complete!');
    console.log('\nYou can now login with:');
    console.log('Email: admin@admin.com');
    console.log('Password: admin');

  } catch (error) {
    console.error('❌ Error setting up production database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupProductionDatabase()
  .then(() => {
    console.log('✅ Setup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });
