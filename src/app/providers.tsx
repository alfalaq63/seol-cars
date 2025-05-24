'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, Suspense } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SessionProvider
        // Refresh session every minute
        refetchInterval={60}
        // Refresh session when window gets focus
        refetchOnWindowFocus={true}
        // Don't refresh when offline
        refetchWhenOffline={false}
        // Disable base path for better compatibility
        basePath={undefined}
      >
        {children}
      </SessionProvider>
    </Suspense>
  );
}
