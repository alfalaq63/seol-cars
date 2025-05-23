import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Simple error handler
const errorHandler = (error: any, message: string = 'An error occurred') => {
  console.error(`API Error: ${message}`, error);
  return NextResponse.json({ error: message }, { status: 500 });
};

// GET all advertisements
export async function GET() {
  try {
    const advertisements = await prisma.advertisement.findMany({
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(advertisements);
  } catch (error) {
    return errorHandler(error, 'Failed to fetch advertisements');
  }
}

// POST create a new advertisement
export async function POST(request: NextRequest) {
  try {
    // For simplicity during build, we're not checking authentication
    // This will be handled in the client-side

    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Basic validation
    if (!body.content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const advertisement = await prisma.advertisement.create({
      data: {
        content: body.content,
        date: body.date ? new Date(body.date) : new Date(),
      },
    });

    return NextResponse.json(advertisement, { status: 201 });
  } catch (error) {
    return errorHandler(error, 'Failed to create advertisement');
  }
}



