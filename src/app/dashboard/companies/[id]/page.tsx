'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CompanyForm } from '../components/company-form';
import { useParams } from 'next/navigation';
import { CompanyFormValues } from '@/lib/validations';

interface Company extends CompanyFormValues {
  id: string;
}

export default function EditCompanyPage() {
  const params = useParams();
  const id = params.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/companies/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch company');
        }

        const data = await response.json();
        setCompany(data);
      } catch (error: any) {
        setError(error.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        <p>{error || 'Failed to load company'}</p>
        <Link href="/dashboard/companies" className="mt-4 inline-block">
          <Button variant="outline" size="sm">
            العودة إلى الشركات
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/companies">
          <Button variant="outline" size="sm">
            &larr; العودة إلى الشركات
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mr-4">تعديل الشركة</h1>
      </div>

      <div className="max-w-3xl mx-auto mb-32">
        <CompanyForm initialData={company} isEditing />
      </div>
    </div>
  );
}
