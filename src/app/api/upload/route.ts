import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, isAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || !isAdmin(session)) {
      return NextResponse.json(
        { error: 'غير مصرح لك برفع الصور' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'لم يتم اختيار ملف' },
        { status: 400 }
      );
    }

    // Check file type
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'يُسمح فقط برفع ملفات الصور' },
        { status: 400 }
      );
    }

    // Check file size (max 2MB for better performance)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'حجم الملف يجب أن يكون أقل من 2 ميجابايت' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert to base64 data URL
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${fileType};base64,${base64}`;

    console.log('Image converted to base64, size:', Math.round(dataUrl.length / 1024), 'KB');

    return NextResponse.json({
      url: dataUrl,
      message: 'تم رفع الصورة بنجاح'
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'فشل في رفع الملف. حاول مرة أخرى.' },
      { status: 500 }
    );
  }
}
