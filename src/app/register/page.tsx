'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, type UserFormValues } from '@/lib/validations';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';



export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistrationAllowed, setIsRegistrationAllowed] = useState(false);
  const [isCheckingUsers, setIsCheckingUsers] = useState(true);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'ADMIN', // First user is always admin
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    const checkIfRegistrationAllowed = async () => {
      try {
        setIsCheckingUsers(true);
        const response = await fetch('/api/users');

        if (response.status === 401) {
          // No users exist, registration is allowed
          setIsRegistrationAllowed(true);
        } else {
          // Users exist, registration is not allowed
          setIsRegistrationAllowed(false);
        }
      } catch (error) {
        // Assume registration is allowed if there's an error
        setIsRegistrationAllowed(true);
      } finally {
        setIsCheckingUsers(false);
      }
    };

    checkIfRegistrationAllowed();
  }, []);

  const onSubmit = async (data: UserFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register');
      }

      router.push('/login');
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingUsers) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-gray-500">جاري التحقق...</p>
      </div>
    );
  }

  if (!isRegistrationAllowed) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">التسجيل غير متاح</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500 mb-4">
              تم تسجيل المستخدم الأول بالفعل. يرجى تسجيل الدخول أو الاتصال بالمسؤول.
            </p>
            <Button
              className="w-full"
              onClick={() => router.push('/login')}
            >
              تسجيل الدخول
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">تسجيل المستخدم الأول</CardTitle>
        </CardHeader>
        <CardContent>
          <Form form={form} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <FormField name="name">
              <FormLabel required>الاسم</FormLabel>
              <FormControl>
                <Input
                  {...register('name')}
                  placeholder="أدخل اسمك"
                  disabled={isLoading}
                />
              </FormControl>
              {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
            </FormField>

            <FormField name="email">
              <FormLabel required>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  {...register('email')}
                  placeholder="أدخل بريدك الإلكتروني"
                  disabled={isLoading}
                />
              </FormControl>
              {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
            </FormField>

            <FormField name="password">
              <FormLabel required>كلمة المرور</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...register('password')}
                  placeholder="أدخل كلمة المرور"
                  disabled={isLoading}
                />
              </FormControl>
              {errors.password && <FormMessage>{errors.password.message}</FormMessage>}
            </FormField>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'جاري التسجيل...' : 'تسجيل'}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
