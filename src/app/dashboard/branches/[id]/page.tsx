'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BranchForm } from '../components/branch-form';
import { useParams } from 'next/navigation';
import { BranchFormValues } from '@/lib/validations';

interface Branch extends BranchFormValues {
  id: string;
}

export default function EditBranchPage() {
  const params = useParams();
  const id = params.id as string;

  const [branch, setBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/branches/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch branch');
        }

        const data = await response.json();
        setBranch(data);
      } catch (error: unknown) {
  if (error instanceof Error) {
    setError(error.message || 'An error occurred');
  } else {
    setError('An unknown error occurred');
  }
} finally {
  setIsLoading(false);
}
    };

    fetchBranch();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  if (error || !branch) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        <p>{error || 'Failed to load branch'}</p>
        <Link href="/dashboard/branches" className="mt-4 inline-block">
          <Button variant="outline" size="sm">
            العودة إلى الفروع
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/dashboard/branches">
          <Button variant="outline" size="sm">
            &larr; العودة إلى الفروع
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mr-4">تعديل الفرع</h1>
      </div>

      <div className="mb-32">
        <BranchForm initialData={branch} isEditing />
      </div>
    </div>
  );
}
