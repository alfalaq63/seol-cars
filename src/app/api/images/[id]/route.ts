import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { imageSchema } from '@/lib/validations';
import { getServerSession } from 'next-auth';
import { authOptions, isAdmin } from '@/lib/auth';
import { unlink } from 'fs/promises';
import { join } from 'path';

// GET a specific image
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const image = await prisma.image.findUnique({
      where: {
        id: params.id,
      },
      include: {
        news: true,
      },
    });
    
    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(image);
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}

// PUT update an image
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
    const validatedData = imageSchema.parse(body);
    
    // Update the image
    const image = await prisma.image.update({
      where: {
        id: params.id,
      },
      data: validatedData,
    });
    
    return NextResponse.json(image);
  } catch (error: Error | unknown) {
    console.error('Error updating image:', error);
    
    if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: 'errors' in error ? error.errors : 'Invalid data' },
        { status: 400 }
      );
    }
    
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    );
  }
}

// DELETE an image
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

    // Get the image to delete the file
    const image = await prisma.image.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Delete the image from the database
    await prisma.image.delete({
      where: {
        id: params.id,
      },
    });

    // Delete the image file from the filesystem
    try {
      const filePath = join(process.cwd(), 'public', image.url);
      await unlink(filePath);
    } catch (fileError) {
      console.error('Error deleting image file:', fileError);
      // Continue even if file deletion fails
    }
    
    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error: Error | unknown) {
    console.error('Error deleting image:', error);
    
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}





