'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { AuthWrapper } from '@/components/auth-wrapper';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthWrapper requireAuth={true}>
      <div className="flex h-screen bg-gray-50">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
          </div>
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0 lg:w-1/5
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          {/* Mobile close button */}
          <div className="lg:hidden absolute top-4 left-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="flex flex-col flex-1 w-full lg:w-4/5 overflow-auto">
          {/* Header with mobile menu button */}
          <header className="bg-white shadow-sm sticky top-0 z-30 pt-16 lg:pt-0">
            <div className="flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center">
                {/* Mobile menu button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-4"
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-bold text-blue-600">لوحة التحكم</h1>
              </div>

              <div className="flex items-center space-x-2 lg:space-x-4">
                <span className="text-xs lg:text-sm text-gray-600 hidden sm:block">
                  مرحباً، {session?.user?.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-xs lg:text-sm text-red-600 hover:text-red-800 px-2 py-1"
                >
                  خروج
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center px-2 lg:px-4 py-1 lg:py-2 border border-transparent text-xs lg:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="hidden sm:inline">العودة إلى الموقع</span>
                  <span className="sm:hidden">الموقع</span>
                </Link>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-4 lg:p-6 pb-32">
            {children}
          </main>
        </div>
      </div>
    </AuthWrapper>
  );
}
