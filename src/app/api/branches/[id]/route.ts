import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { branchSchema } from '@/lib/validations';
import { getServerSession } from 'next-auth';
import { authOptions, isAdmin } from '@/lib/auth';

// GET a specific branch
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const branch = await prisma.branch.findUnique({
      where: {
        id: params.id,
      },
      include: {
        company: true,
      },
    });
    
    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(branch);
  } catch (error) {
    console.error('Error fetching branch:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branch' },
      { status: 500 }
    );
  }
}

// PUT update a branch
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
    const validatedData = branchSchema.parse(body);
    
    // Update the branch
    const branch = await prisma.branch.update({
      where: {
        id: params.id,
      },
      data: validatedData,
    });
    
    return NextResponse.json(branch);
  } catch (error: unknown) {
    console.error('Error updating branch:', error);
    
    if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: 'errors' in error ? error.errors : 'Invalid data' },
        { status: 400 }
      );
    }
    
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update branch' },
      { status: 500 }
    );
  }
}

// DELETE a branch
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

    // Delete the branch
    await prisma.branch.delete({
      where: {
        id: params.id,
      },
    });
    
    return NextResponse.json({ message: 'Branch deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting branch:', error);
    
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete branch' },
      { status: 500 }
    );
  }
}





