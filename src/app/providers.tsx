'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      // Refresh session every minute
      refetchInterval={60}
      // Refresh session when window gets focus
      refetchOnWindowFocus={true}
      // Don't refresh when offline
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
}
