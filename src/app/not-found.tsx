import Link from 'next/link';
import { Button } from '@/components/ui/button';



export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">الصفحة غير موجودة</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها أو حذفها.
      </p>
      <Link href="/">
        <Button>العودة إلى الصفحة الرئيسية</Button>
      </Link>
    </div>
  );
}
