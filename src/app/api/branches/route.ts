import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { branchSchema } from '@/lib/validations';
import { getServerSession } from 'next-auth';
import { authOptions, isAdmin } from '@/lib/auth';

// GET all branches
export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      include: {
        company: true,
      },
    });
    
    return NextResponse.json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branches' },
      { status: 500 }
    );
  }
}

// POST create a new branch
export async function POST(request: NextRequest) {
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
    
    // Create the branch
    const branch = await prisma.branch.create({
      data: validatedData,
    });
    
    return NextResponse.json(branch, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating branch:', error);
    
    if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: 'errors' in error ? error.errors : 'Invalid data' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create branch' },
      { status: 500 }
    );
  }
}



