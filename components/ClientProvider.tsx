'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1, // Retry failed requests once
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster position="bottom-center" />
      </AuthProvider>
    </QueryClientProvider>
  );
}