'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/lib/validations';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

// Skeleton loader for the login form
function LoginFormSkeleton() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
      </CardContent>
    </Card>
  );
}

// The actual login form component that uses useSearchParams
function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Attempting to sign in with:', data.email);

      // Use signIn with redirect: true to force a full page reload
      // This ensures the session is properly updated
      const result = await signIn('credentials', {
        redirect: true,
        callbackUrl: callbackUrl,
        email: data.email,
        password: data.password,
      });

      // The code below won't execute because redirect: true will navigate away
      console.log('Sign in result:', result);

    } catch (error) {
      console.error('Login error:', error);
      setError('حدث خطأ أثناء تسجيل الدخول');
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
      </CardHeader>
      <CardContent>
        <Form form={form} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <FormField name="email">
            <FormLabel required>البريد الإلكتروني</FormLabel>
            <FormControl>
              <Input
                type="email"
                {...register('email')}
                placeholder="أدخل البريد الإلكتروني"
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
            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
