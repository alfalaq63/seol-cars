import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { News } from '@prisma/client';

// Add export const dynamic = 'force-dynamic' to prevent static prerendering
export const dynamic = 'force-dynamic';

// Define the type for news item with images
type NewsWithImages = News & {
  images: {
    id: string;
    url: string;
  }[];
};

interface NewsDetailPageProps {
  params: {
    id: string;
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  // Get the news item with error handling
  let news: NewsWithImages | null = null;

  try {
    news = await prisma.news.findUnique({
      where: {
        id: params.id,
      },
      include: {
        images: true,
      },
    }) as NewsWithImages | null;
  } catch (error) {
    console.error('Error fetching news item:', error);
    notFound();
  }

  // If news not found, return 404
  if (!news) {
    notFound();
  }

  // Format date function
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-LY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/news">
          <Button variant="outline" size="sm">
            &larr; العودة إلى الأخبار
          </Button>
        </Link>
      </div>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            {news.title}
          </h1>
          <p className="text-gray-500">
            {formatDate(news.date)}
          </p>
        </header>

        {news.mainImage && (
          <div className="relative h-96 w-full mb-8 flex items-center justify-center bg-gray-100 rounded-lg">
            <img
              src={news.mainImage}
              alt={news.title}
              className="max-h-full max-w-full object-contain rounded-lg"
              onError={(e) => {
                console.error('Error loading main image:', news.mainImage);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none mb-12">
          {news.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {news.images.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">صور إضافية</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {news.images.map((image) => (
                <div key={image.id} className="relative h-48 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                  <img
                    src={image.url}
                    alt={news.title}
                    className="max-h-full max-w-full object-contain rounded-lg"
                    onError={(e) => {
                      console.error('Error loading additional image:', image.url);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
