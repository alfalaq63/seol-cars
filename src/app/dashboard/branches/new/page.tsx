import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BranchForm } from '../components/branch-form';

export default function NewBranchPage() {
  return (
    <div className='m-auto'>
      <div className="flex items-center mb-6">
        <Link href="/dashboard/branches">
          <Button variant="outline" size="sm">
            &larr; العودة إلى الفروع
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mr-4">إضافة فرع جديد</h1>
      </div>

      <div className="mb-32">
        <BranchForm />
      </div>
    </div>
  );
}
