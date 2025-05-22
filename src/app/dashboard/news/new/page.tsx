import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NewsForm } from '../components/news-form';

export default function NewNewsPage() {
  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/dashboard/news">
          <Button variant="outline" size="sm">
            &larr; العودة إلى الاخبار
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mr-4">إضافة خبر جديد</h1>
      </div>

      <NewsForm />
    </div>
  );
}
