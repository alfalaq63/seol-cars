import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { messageSchema } from '@/lib/validations';
import { getServerSession } from 'next-auth';
import { authOptions, isAdmin } from '@/lib/auth';

// GET all messages (admin only)
export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || !isAdmin(session)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST create a new message (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = messageSchema.parse(body);
    
    // Create the message
    await prisma.message.create({
      data: validatedData,
    });
    
    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating message:', error);
    
    if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: 'errors' in error ? error.errors : 'Invalid data' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}






