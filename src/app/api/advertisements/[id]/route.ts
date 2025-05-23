import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { advertisementSchema } from '@/lib/validations';
import { getServerSession } from 'next-auth';
import { authOptions, isAdmin } from '@/lib/auth';

// Add error handling for database connection
const handleDatabaseError = (error: any) => {
  console.error('Database error:', error);
  return NextResponse.json(
    { error: 'Database connection error' },
    { status: 500 }
  );
};

// Safer way to get server session
const getSession = async () => {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.error('Error getting server session:', error);
    return null;
  }
};

// GET a specific advertisement
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Add validation for params.id
    if (!params.id || typeof params.id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid advertisement ID' },
        { status: 400 }
      );
    }

    const advertisement = await prisma.advertisement.findUnique({
      where: {
        id: params.id,
      },
    }).catch((error) => {
      console.error('Database query error:', error);
      return null;
    });

    if (!advertisement) {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(advertisement);
  } catch (error) {
    console.error('Error fetching advertisement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch advertisement' },
      { status: 500 }
    );
  }
}

// PUT update an advertisement
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Add validation for params.id
    if (!params.id || typeof params.id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid advertisement ID' },
        { status: 400 }
      );
    }

    // Check if user is authenticated and is admin
    const session = await getSession();

    if (!session || !isAdmin(session)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate the request body
    let validatedData;
    try {
      validatedData = advertisementSchema.parse(body);
    } catch (zodError) {
      return NextResponse.json(
        { error: 'Validation error', details: zodError },
        { status: 400 }
      );
    }

    // Update the advertisement
    let advertisement;
    try {
      advertisement = await prisma.advertisement.update({
        where: {
          id: params.id,
        },
        data: {
          content: validatedData.content,
          date: validatedData.date ? new Date(validatedData.date) : new Date(),
        },
      });
    } catch (dbError: any) {
      if (dbError.code === 'P2025') {
        return NextResponse.json(
          { error: 'Advertisement not found' },
          { status: 404 }
        );
      }
      return handleDatabaseError(dbError);
    }

    return NextResponse.json(advertisement);
  } catch (error: unknown) {
    console.error('Error updating advertisement:', error);
    return NextResponse.json(
      { error: 'Failed to update advertisement' },
      { status: 500 }
    );
  }
}

// DELETE an advertisement
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Add validation for params.id
    if (!params.id || typeof params.id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid advertisement ID' },
        { status: 400 }
      );
    }

    // Check if user is authenticated and is admin
    const session = await getSession();

    if (!session || !isAdmin(session)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete the advertisement
    try {
      await prisma.advertisement.delete({
        where: {
          id: params.id,
        },
      });
    } catch (dbError: any) {
      if (dbError.code === 'P2025') {
        return NextResponse.json(
          { error: 'Advertisement not found' },
          { status: 404 }
        );
      }
      return handleDatabaseError(dbError);
    }

    return NextResponse.json({ message: 'Advertisement deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting advertisement:', error);
    return NextResponse.json(
      { error: 'Failed to delete advertisement' },
      { status: 500 }
    );
  }
}




