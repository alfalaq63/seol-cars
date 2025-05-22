'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserForm } from '../components/user-form';
import { useParams } from 'next/navigation';
import { UserFormValues } from '@/lib/validations';

interface User extends Omit<UserFormValues, 'password'> {
  id: string;
}

export default function EditUserPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/users/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        
        const data = await response.json();
        setUser(data);
      } catch (error: any) {
        setError(error.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        <p>{error || 'Failed to load user'}</p>
        <Link href="/dashboard/users" className="mt-4 inline-block">
          <Button variant="outline" size="sm">
            العودة إلى المستخدمين
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/dashboard/users">
          <Button variant="outline" size="sm">
            &larr; العودة إلى المستخدمين
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mr-4">تعديل المستخدم</h1>
      </div>

      <UserForm initialData={user} isEditing />
    </div>
  );
}
