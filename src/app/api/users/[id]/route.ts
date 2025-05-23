import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {  userUpdateSchema } from '@/lib/validations';
import { getServerSession } from 'next-auth';
import { authOptions, isAdmin } from '@/lib/auth';
import { hash } from 'bcrypt';

// GET a specific user (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || !isAdmin(session)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
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

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT update a user (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || !isAdmin(session)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate the request body
    const validatedData = userUpdateSchema.parse(body);

    // Check if email is being changed and if it already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email: validatedData.email,
        NOT: {
          id: params.id,
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: {
      name: string;
      email: string;
      role: string;
      password?: string;
    } = {
      name: validatedData.name,
      email: validatedData.email,
      role: validatedData.role,
    };

    // Only update password if it's provided
    if (validatedData.password && validatedData.password.trim() !== '') {
      updateData.password = await hash(validatedData.password, 10);
    }

    // Update the user
    const user = await prisma.user.update({
      where: {
        id: params.id,
      },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        role: validatedData.role,
        ...(validatedData.password && validatedData.password.trim() !== '' 
          ? { password: updateData.password } 
          : {})
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

    return NextResponse.json(user);
  } catch (error: unknown) {
    console.error('Error updating user:', error);

    if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: 'name' in error && 'errors' in error ? error.errors : 'Invalid data' },
        { status: 400 }
      );
    }

    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE a user (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || !isAdmin(session)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete the user
    await prisma.user.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting user:', error);

    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}








