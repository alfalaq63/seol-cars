import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AdvertisementForm } from '../components/advertisement-form';

export default function NewAdvertisementPage() {
  return (
    <div className='w-80% m-auto'>
      <div className="flex items-center mb-6 mx-8">
        <Link href="/dashboard/advertisements">
          <Button variant="outline" size="sm">
            &larr; العودة إلى الاعلانات
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mr-4">إضافة إعلان جديد</h1>
      </div>

      <AdvertisementForm />
    </div>
  );
}
