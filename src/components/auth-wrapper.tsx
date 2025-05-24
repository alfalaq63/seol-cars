'use client';

import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthWrapperProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function AuthWrapper({ children, requireAuth = false }: AuthWrapperProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && status === 'unauthenticated') {
      router.push('/login');
    }
  }, [requireAuth, status, router]);

  if (requireAuth && status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  if (requireAuth && !session) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}
