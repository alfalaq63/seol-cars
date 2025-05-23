import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { advertisementSchema } from '@/lib/validations';
import { getServerSession } from 'next-auth';
import { authOptions, isAdmin } from '@/lib/auth';

// GET a specific advertisement
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const advertisement = await prisma.advertisement.findUnique({
      where: {
        id: params.id,
      },
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
    const validatedData = advertisementSchema.parse(body);

    // Update the advertisement
    const advertisement = await prisma.advertisement.update({
      where: {
        id: params.id,
      },
      data: {
        content: validatedData.content,
        date: validatedData.date ? new Date(validatedData.date) : new Date(),
      },
    });

    return NextResponse.json(advertisement);
  } catch (error: unknown) {
    console.error('Error updating advertisement:', error);

    if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: 'errors' in error ? error.errors : 'Invalid data' },
        { status: 400 }
      );
    }

    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      );
    }

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
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || !isAdmin(session)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete the advertisement
    await prisma.advertisement.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: 'Advertisement deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting advertisement:', error);

    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete advertisement' },
      { status: 500 }
    );
  }
}




