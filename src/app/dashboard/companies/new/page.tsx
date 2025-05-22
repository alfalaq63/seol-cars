import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CompanyForm } from '../components/company-form';

export default function NewCompanyPage() {
  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/companies">
          <Button variant="outline" size="sm">
            &larr; العودة إلى الشركات
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mr-4">إضافة شركة جديدة</h1>
      </div>

      <div className="max-w-3xl mx-auto mb-32">
        <CompanyForm />
      </div>
    </div>
  );
}
