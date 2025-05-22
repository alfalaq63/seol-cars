'use client';

import { useEffect, useState } from 'react';
import { NewsTicker } from '@/components/ui/news-ticker';
import { MegaphoneIcon } from '@heroicons/react/24/solid';

interface Advertisement {
  id: string;
  content: string;
  date: string;
}

export function AdvertisementsTicker() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/advertisements');

        if (!response.ok) {
          throw new Error('Failed to fetch advertisements');
        }

        const data = await response.json();
        setAdvertisements(data);
      } catch (err) {
        console.error('Error fetching advertisements:', err);
        setError('حدث خطأ أثناء تحميل الإعلانات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvertisements();
  }, []);

  // If there are no advertisements or there's an error, don't show the ticker
  if (isLoading) {
    return (
      <div className="bg-red-600 text-white py-2 px-4 flex items-center">
        <MegaphoneIcon className="h-5 w-5 mr-2" />
        <span>جاري تحميل الإعلانات...</span>
      </div>
    );
  }

  if (error || advertisements.length === 0) {
    return null;
  }

  // Format the advertisements for the ticker
  const tickerItems = advertisements.map(ad => ad.content);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute left-0 top-0 bottom-0 bg-red-700 flex items-center px-3 z-10">
        <MegaphoneIcon className="h-5 w-5 text-white" />
      </div>
      <NewsTicker
        items={tickerItems}
        speed={30}
        pauseOnHover={false}
        className="pl-12 shadow-lg" // Add padding to make room for the icon and shadow
      />
    </div>
  );
}
