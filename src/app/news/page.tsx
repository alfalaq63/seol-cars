import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

export default async function NewsPage() {
  // Get all news
  const news = await prisma.news.findMany({
    orderBy: {
      date: 'desc',
    },
    include: {
      images: true,
    },
  });

  // Format date function
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-LY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          أخبار الشركة
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          آخر الأخبار والتحديثات من سيول ليبيا للسيارات
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {news.length > 0 ? (
          news.map((item) => (
            <Link href={`/news/${item.id}`} key={item.id}>
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 w-full relative">
                  {item.mainImage ? (
                    <Image
                      src={item.mainImage}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">لا توجد صورة</span>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-sm mb-4">
                    {formatDate(item.date)}
                  </p>
                  <p className="text-gray-600 line-clamp-3">
                    {item.content.substring(0, 150)}
                    {item.content.length > 150 ? '...' : ''}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">لا توجد أخبار حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
}
