import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { companySchema } from '@/lib/validations';
import { getServerSession } from 'next-auth';
import { authOptions, isAdmin } from '@/lib/auth';

// GET all companies
export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      include: {
        branches: true,
      },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

// POST create a new company
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || !isAdmin(session)) {
      console.error('Unauthorized attempt to create company');
      return NextResponse.json(
        { error: 'غير مصرح لك بإضافة شركة' },
        { status: 401 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('Received company data:', body);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'خطأ في تنسيق البيانات المرسلة' },
        { status: 400 }
      );
    }

    // Validate the request body
    try {
      const validatedData = companySchema.parse(body);
      console.log('Validated company data:', validatedData);

      // Prepare data for database
      const companyData = {
        ...validatedData,
        // Ensure we have the required fields
        id: validatedData.id || undefined, // Let Prisma generate ID if not provided
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Create the company
      const company = await prisma.company.create({
        data: companyData,
      });

      console.log('Company created successfully:', company);
      return NextResponse.json(company, { status: 201 });
    } catch (validationError: any) {
      if (validationError.name === 'ZodError') {
        console.error('Validation error:', validationError.errors);
        return NextResponse.json(
          { error: 'خطأ في التحقق من صحة البيانات', details: validationError.errors },
          { status: 400 }
        );
      }
      throw validationError; // Re-throw if it's not a ZodError
    }
  } catch (error: any) {
    console.error('Error creating company:', error);

    // Check for Prisma-specific errors
    if (error.code) {
      console.error('Prisma error code:', error.code);

      // Handle specific Prisma errors
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'هذه الشركة موجودة بالفعل' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'فشل في إنشاء الشركة: ' + (error.message || 'خطأ غير معروف') },
      { status: 500 }
    );
  }
}
