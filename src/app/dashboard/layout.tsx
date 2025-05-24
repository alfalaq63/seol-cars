'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { AuthWrapper } from '@/components/auth-wrapper';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <AuthWrapper requireAuth={true}>
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
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">مرحباً، {session?.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  تسجيل الخروج
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  العودة إلى الموقع
                </Link>
              </div>
            </div>
          </header>
        </div>
        <div className="w-4/5 pb-32 bg-white m-auto">
          {children}
        </div>
      </div>
    </AuthWrapper>
  );
}
