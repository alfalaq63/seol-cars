'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const setupDatabase = async () => {
    try {
      setIsLoading(true);
      setMessage('جاري إعداد قاعدة البيانات...');

      const response = await fetch('/api/setup', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('تم إعداد قاعدة البيانات بنجاح! يمكنك الآن تسجيل الدخول بـ admin@admin.com / admin');
      } else {
        setIsSuccess(false);
        setMessage(data.error || 'حدث خطأ أثناء إعداد قاعدة البيانات');
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('حدث خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              إعداد قاعدة البيانات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600">
                اضغط على الزر أدناه لإعداد قاعدة البيانات وإنشاء المستخدم الإداري
              </p>
            </div>

            {message && (
              <div className={`p-4 rounded-md ${
                isSuccess 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <Button
              onClick={setupDatabase}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'جاري الإعداد...' : 'إعداد قاعدة البيانات'}
            </Button>

            {isSuccess && (
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">بيانات تسجيل الدخول:</p>
                <div className="bg-gray-100 p-3 rounded-md text-sm">
                  <p><strong>البريد الإلكتروني:</strong> admin@admin.com</p>
                  <p><strong>كلمة المرور:</strong> admin</p>
                </div>
                <a
                  href="/login"
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  الذهاب لتسجيل الدخول
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
