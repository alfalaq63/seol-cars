'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userCreateSchema, userUpdateSchema, type UserFormValues } from '@/lib/validations';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { FormField, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserFormProps {
  initialData?: Omit<UserFormValues, 'password'> & { id: string };
  isEditing?: boolean;
}

export function UserForm({ initialData, isEditing = false }: UserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(isEditing ? userUpdateSchema : userCreateSchema),
    defaultValues: initialData ? {
      ...initialData,
      password: '', // Don't prefill password
    } : {
      name: '',
      email: '',
      password: '',
      role: 'USER',
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // If editing and password is empty, remove it from the data
      if (isEditing && !data.password) {
        const { password, ...restData } = data;
        data = restData as UserFormValues;
      }

      // Create or update user
      const url = isEditing ? `/api/users/${initialData?.id}` : '/api/users';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save user');
      }

      router.push('/dashboard/users');
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                placeholder="أدخل اسم المستخدم"
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
                placeholder="أدخل البريد الإلكتروني"
                disabled={isLoading || isEditing} // Can't change email if editing
              />
            </FormControl>
            {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
          </FormField>

          <FormField name="password">
            <FormLabel required={!isEditing}>كلمة المرور {isEditing && '(اتركها فارغة للإبقاء على كلمة المرور الحالية)'}</FormLabel>
            <FormControl>
              <Input
                type="password"
                {...register('password')}
                placeholder={isEditing ? 'اتركها فارغة للإبقاء على كلمة المرور الحالية' : 'أدخل كلمة المرور'}
                disabled={isLoading}
              />
            </FormControl>
            {errors.password && <FormMessage>{errors.password.message}</FormMessage>}
          </FormField>

          <FormField name="role">
            <FormLabel required>الصلاحية</FormLabel>
            <FormControl>
              <Select
                {...register('role')}
                disabled={isLoading}
              >
                <option value="USER">مستخدم</option>
                <option value="ADMIN">مدير</option>
              </Select>
            </FormControl>
            {errors.role && <FormMessage>{errors.role.message}</FormMessage>}
          </FormField>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/users')}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'جاري الحفظ...' : isEditing ? 'حفظ التغييرات' : 'إضافة المستخدم'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
