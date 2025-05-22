import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserForm } from '../components/user-form';

export default function NewUserPage() {
  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/dashboard/users">
          <Button variant="outline" size="sm">
            &larr; العودة إلى المستخدمين
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mr-4">إضافة مستخدم جديد</h1>
      </div>

      <UserForm />
    </div>
  );
}
