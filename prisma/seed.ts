import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user if it doesn't exist
  const adminExists = await prisma.user.findFirst({
    where: {
      email: 'admin@example.com',
    },
  });

  if (!adminExists) {
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin', 10);
    
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }

  // Create sample advertisement if none exist
  const advertisementCount = await prisma.advertisement.count();
  
  if (advertisementCount === 0) {
    console.log('Creating sample advertisement...');
    await prisma.advertisement.create({
      data: {
        content: 'مرحباً بكم في سيول ليبيا للسيارات - الوكيل الحصري للسيارات الكورية',
      },
    });
    console.log('Sample advertisement created');
  } else {
    console.log('Advertisements already exist');
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
