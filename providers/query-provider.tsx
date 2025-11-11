"use client";

/**
 * React Query Provider
 * Wraps the app with QueryClient for data fetching and caching
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, useEffect } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Production-grade query configuration
            staleTime: 30 * 1000, // 30 seconds - data considered fresh for this duration
            gcTime: 5 * 60 * 1000, // 5 minutes - unused data cached for this long (formerly cacheTime)
            refetchOnWindowFocus: true, // Refetch when user returns to tab (good UX)
            refetchOnReconnect: true, // Refetch when network reconnects
            retry: 2, // Retry failed requests twice
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
            networkMode: "online", // Only fetch when online
          },
          mutations: {
            // Mutation options
            retry: 1, // Retry once on failure for mutations
            retryDelay: 1000,
            networkMode: "online",
            // Global error handler for mutations (optional)
            onError: (error) => {
              console.error("Mutation error:", error);
            },
          },
        },
      })
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Dev tools only in development and only on client side to prevent hydration errors */}
      {isMounted && process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
