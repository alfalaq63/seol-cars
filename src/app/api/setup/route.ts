import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting database setup...');

    // Check if database is accessible
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@admin.com' }
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: 'Admin user already exists',
        success: true
      });
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

    console.log('✅ Admin user created successfully');

    return NextResponse.json({
      message: 'Database setup completed successfully',
      success: true,
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    });

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    
    return NextResponse.json({
      error: 'Failed to setup database',
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });

  } finally {
    await prisma.$disconnect();
  }
}
