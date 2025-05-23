'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
 
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/modal';
import { PencilIcon, TrashIcon, CalendarIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface News {
  id: string;
  title: string;
  content: string;
  mainImage: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
  images: {
    id: string;
    url: string;
  }[];
}

export default function NewsPage() {
   
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/news');

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
}finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleDelete = async () => {
    if (!newsToDelete) return;

    try {
      const response = await fetch(`/api/news/${newsToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete news');
      }

      // Remove the deleted news from the state
      setNews(news.filter(item => item.id !== newsToDelete));

      // Close the modal
      setDeleteModalOpen(false);
      setNewsToDelete(null);
    } catch (error: unknown) {
  if (error instanceof Error) {
    setError(error.message || 'An error occurred');
  } else {
    setError('An unknown error occurred');
  }
}
  };

  const openDeleteModal = (id: string) => {
    setNewsToDelete(id);
    setDeleteModalOpen(true);
  };

  // Format date function
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ar-LY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الاخبار</h1>
        <Link href="/dashboard/news/new">
          <Button>إضافة خبر جديد</Button>
        </Link>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">لا توجد أخبار حالياً</p>
          <Link href="/dashboard/news/new">
            <Button>إضافة خبر جديد</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {news.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/4 relative h-48">
                    {item.mainImage ? (
                      <Image
                        src={item.mainImage}
                        alt={item.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-md">
                        <PhotoIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="w-full md:w-3/4">
                    <h2 className="text-xl font-bold mb-2">{item.title}</h2>

                    <div className="flex items-center text-gray-500 mb-3">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      <p className="text-sm">{formatDate(item.date)}</p>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {item.content.substring(0, 200)}
                      {item.content.length > 200 ? '...' : ''}
                    </p>

                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                      <Link href={`/dashboard/news/${item.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <PencilIcon className="h-4 w-4 ml-1" />
                          تعديل
                        </Button>
                      </Link>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteModal(item.id)}
                        className="flex items-center text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <TrashIcon className="h-4 w-4 ml-1" />
                        حذف
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="حذف الخبر"
        message="هل أنت متأكد من رغبتك في حذف هذا الخبر؟ هذا الإجراء لا يمكن التراجع عنه."
        confirmText="حذف"
        cancelText="إلغاء"
        variant="danger"
      />
    </div>
  );
}
