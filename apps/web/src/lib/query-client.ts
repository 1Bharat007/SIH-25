import { QueryClient } from '@tanstack/react-query';

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes fresh data
        gcTime: 1000 * 60 * 60 * 24, // 24 hours garbage collection (ideal for offline cache)
        retry: (failureCount, error) => {
          // Don't retry client 4xx errors
          if (
            error &&
            'status' in error &&
            typeof error.status === 'number' &&
            error.status < 500
          ) {
            return false;
          }
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: reuse singleton
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}
