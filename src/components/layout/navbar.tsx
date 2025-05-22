'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'الرئيسية', href: '/' },
  { name: 'الاخبار', href: '/news' },
  { name: 'اتصل بنا', href: '/contact' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [, setIsAdmin] = useState(false);

  // Update login state when session changes
  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);

    setIsLoggedIn(status === 'authenticated');
    setIsAdmin(session?.user?.role === 'ADMIN');

    if (status === 'authenticated') {
      console.log('User is authenticated with role:', session?.user?.role);
    }
  }, [session, status]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8  shadow-2xl" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Siol Libya Cars</span>
            <h1 className="text-2xl font-bold text-blue-600">سيول ليبيا للسيارات</h1>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600',
                pathname === item.href && 'text-blue-600'
              )}
            >
              {item.name}
            </Link>
          ))}
          {/* Show dashboard link for logged in users */}
          {isLoggedIn && (
            <Link
              href="/dashboard"
              className={cn(
                'text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600',
                pathname.startsWith('/dashboard') && 'text-blue-600'
              )}
            >
              لوحة التحكم
            </Link>
          )}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {isLoggedIn ? (
            <Button
              variant="ghost"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              تسجيل الخروج <span aria-hidden="true">&larr;</span>
            </Button>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              تسجيل الدخول <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>
      {/* Mobile menu */}
      <div className={cn('lg:hidden', mobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden')}>
        <div className="fixed inset-0 bg-black/25" onClick={() => setMobileMenuOpen(false)} />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">Siol Libya Cars</span>
              <h1 className="text-2xl font-bold text-blue-600">سيول ليبيا للسيارات</h1>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      '-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50',
                      pathname === item.href && 'bg-gray-50 text-blue-600'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {/* Show dashboard link for logged in users */}
                {isLoggedIn && (
                  <Link
                    href="/dashboard"
                    className={cn(
                      '-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50',
                      pathname.startsWith('/dashboard') && 'bg-gray-50 text-blue-600'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    لوحة التحكم
                  </Link>
                )}
              </div>
              <div className="py-6">
                {isLoggedIn ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    تسجيل الخروج <span aria-hidden="true">&larr;</span>
                  </Button>
                ) : (
                  <Link
                    href="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    تسجيل الدخول <span aria-hidden="true">&rarr;</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
