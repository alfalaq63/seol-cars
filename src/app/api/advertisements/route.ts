import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { advertisementSchema } from '@/lib/validations';
import { getServerSession } from 'next-auth';
import { authOptions, isAdmin } from '@/lib/auth';

// GET all advertisements
export async function GET() {
  try {
    const advertisements = await prisma.advertisement.findMany({
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(advertisements);
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch advertisements' },
      { status: 500 }
    );
  }
}

// POST create a new advertisement
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
    const validatedData = advertisementSchema.parse(body);

    // Create the advertisement
    const advertisement = await prisma.advertisement.create({
      data: {
        content: validatedData.content,
        date: validatedData.date ? new Date(validatedData.date) : new Date(),
      },
    });

    return NextResponse.json(advertisement, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating advertisement:', error);

    if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: 'errors' in error ? error.errors : 'Invalid data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create advertisement' },
      { status: 500 }
    );
  }
}



