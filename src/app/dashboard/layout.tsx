import { Sidebar } from '@/components/layout/sidebar';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

// Force dynamic rendering for authentication
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/dashboard');
  }

  // Log session information for debugging
  console.log('Dashboard session:', {
    status: 'authenticated',
    user: session.user
  });

  return (
    <div className="flex h-screen bg-gray-50 pb-32">
      {/* Sidebar with higher z-index */}
      <div className="w-1/5 shadow-md">
        <Sidebar />
      </div>

      {/* Main content area with padding to prevent overlap */}
      <div className="flex flex-col flex-1 w-full overflow-auto">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl font-bold text-blue-600">لوحة التحكم</h1>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              العودة إلى الموقع
            </Link>
          </div>
        </header>
      </div>
      <div className="w-4/5 pb-32 bg-white m-auto">
        {children}
      </div>
    </div>
  );
}
