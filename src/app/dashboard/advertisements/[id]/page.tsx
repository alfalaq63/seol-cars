'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AdvertisementForm } from '../components/advertisement-form';
import { useParams } from 'next/navigation';
import { AdvertisementFormValues } from '@/lib/validations';
import { use } from 'react';

interface Advertisement extends AdvertisementFormValues {
  id: string;
}

export default function EditAdvertisementPage() {
  const params = useParams();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id as string;

  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvertisement = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/advertisements/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch advertisement');
        }

        const data = await response.json();
        setAdvertisement(data);
      } catch (error: any) {
        setError(error.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvertisement();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  if (error || !advertisement) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        <p>{error || 'Failed to load advertisement'}</p>
        <Link href="/dashboard/advertisements" className="mt-4 inline-block">
          <Button variant="outline" size="sm">
            العودة إلى الاعلانات
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/dashboard/advertisements">
          <Button variant="outline" size="sm">
            &larr; العودة إلى الاعلانات
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mr-4">تعديل الإعلان</h1>
      </div>

      <AdvertisementForm initialData={advertisement} isEditing />
    </div>
  );
}
