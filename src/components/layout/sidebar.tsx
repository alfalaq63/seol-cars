'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  MegaphoneIcon,
  NewspaperIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  {
    name: 'الرئيسية',
    href: '/dashboard',
    icon: BuildingOfficeIcon,
  },
  {
    name: 'إدارة الشركات',
    href: '/dashboard/companies',
    icon: BuildingOfficeIcon,
  },
  {
    name: 'إدارة الفروع',
    href: '/dashboard/branches',
    icon: BuildingStorefrontIcon,
  },
  {
    name: 'إدارة الاعلانات',
    href: '/dashboard/advertisements',
    icon: MegaphoneIcon,
  },
  {
    name: 'إدارة الاخبار',
    href: '/dashboard/news',
    icon: NewspaperIcon,
  },
  {
    name: 'إدارة المستخدمين',
    href: '/dashboard/users',
    icon: UserGroupIcon,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden fixed top-16 right-4 z-40">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 rounded-md bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          sidebarOpen ? 'block' : 'hidden'
        )}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />

        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
            <div className="absolute top-0 left-0 -ml-12 pt-2">
              <button
                type="button"
                className="mr-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center justify-center px-4 mb-5">
                <h1 className="text-2xl font-bold text-blue-600">لوحة التحكم</h1>
              </div>
              <div className="px-4 mb-6">
                <div className="h-0.5 bg-gray-200 rounded-full"></div>
              </div>
              <nav className="px-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      pathname === item.href || pathname.startsWith(`${item.href}/`)
                        ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600',
                      'group flex items-center px-3 py-3 text-base font-medium rounded-md transition-all duration-200'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        pathname === item.href || pathname.startsWith(`${item.href}/`)
                          ? 'text-blue-600'
                          : 'text-gray-400 group-hover:text-blue-500',
                        'ml-3 flex-shrink-0 h-5 w-5'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:right-0">
        <div className="flex-1 flex flex-col min-h-0 border-l border-gray-200 bg-white shadow-lg w-64">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-center flex-shrink-0 px-4 mb-5">
              <h1 className="text-2xl font-bold text-blue-600">لوحة التحكم</h1>
            </div>
            <div className="px-4 mb-6">
              <div className="h-0.5 bg-gray-200 rounded-full"></div>
            </div>
            <nav className="flex-1 px-4 bg-white space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600',
                    'group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-200'
                  )}
                >
                  <item.icon
                    className={cn(
                      pathname === item.href || pathname.startsWith(`${item.href}/`)
                        ? 'text-blue-600'
                        : 'text-gray-400 group-hover:text-blue-500',
                      'ml-3 flex-shrink-0 h-5 w-5'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">مرحباً بك في لوحة التحكم</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
