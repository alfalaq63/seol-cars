import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { userCreateSchema } from '@/lib/validations';
import { hash } from 'bcrypt';

// POST register the first admin user
export async function POST(request: NextRequest) {
  try {
    // Check if any users exist
    const userCount = await prisma.user.count();

    // Only allow registration if no users exist
    if (userCount > 0) {
      return NextResponse.json(
        { error: 'Registration is disabled' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate the request body
    const validatedData = userCreateSchema.parse(body);

    // Hash the password
    const hashedPassword = await hash(validatedData.password, 10);

    // Create the admin user
    const user = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
        role: 'ADMIN', // Force the first user to be an admin
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error('Error registering user:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
