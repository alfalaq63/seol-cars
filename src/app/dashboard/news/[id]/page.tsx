'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NewsForm } from '../components/news-form';
import { useParams } from 'next/navigation';
import { NewsFormValues } from '@/lib/validations';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface News extends NewsFormValues {
  id: string;
  images: {
    id: string;
    url: string;
  }[];
}

export default function EditNewsPage() {
  const params = useParams();
  const id = params.id as string;

  const [news, setNews] = useState<News | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/news/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        setNews(data);
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

    fetchNews();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        <p>{error || 'Failed to load news'}</p>
        <Link href="/dashboard/news" className="mt-4 inline-block">
          <Button variant="outline" size="sm">
            العودة إلى الاخبار
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/dashboard/news">
          <Button variant="outline" size="sm">
            &larr; العودة إلى الاخبار
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mr-4">تعديل الخبر</h1>
      </div>

      <NewsForm initialData={news} isEditing />
    </div>
  );
}
