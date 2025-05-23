import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { imageSchema } from '@/lib/validations';
import { getServerSession } from 'next-auth';
import { authOptions, isAdmin } from '@/lib/auth';

// GET all images
export async function GET() {
  try {
    const images = await prisma.image.findMany({
      include: {
        news: true,
      },
    });
    
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

// POST create a new image
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
    const validatedData = imageSchema.parse(body);
    
    // Create the image
    const image = await prisma.image.create({
      data: validatedData,
    });
    
    return NextResponse.json(image, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating image:', error);
    
    if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: 'errors' in error ? error.errors : 'Invalid data' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create image' },
      { status: 500 }
    );
  }
}



