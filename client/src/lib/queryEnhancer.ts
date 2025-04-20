import { QueryClient } from '@tanstack/react-query';

/**
 * Configure the query client for optimal real-time updates
 * @param queryClient The React Query client instance
 */
export const configureQueryClient = (queryClient: QueryClient): void => {
  // Set default options for all queries
  queryClient.setDefaultOptions({
    queries: {
      // Refetch on window focus to ensure data is fresh when user returns to the app
      refetchOnWindowFocus: true,
      
      // Refetch on reconnect to ensure data is fresh after connection issues
      refetchOnReconnect: true,
      
      // Consider data stale after 30 seconds
      staleTime: 30 * 1000,
      
      // Keep cached data for 5 minutes
      gcTime: 5 * 60 * 1000,
      
      // Retry failed queries 1 time
      retry: 1,
      
      // Refetch interval queries even when the window/tab is in the background
      refetchIntervalInBackground: true,
    },
  });
};

/**
 * Invalidate multiple query keys at once
 * @param queryClient The React Query client instance
 * @param queryKeys Array of query keys to invalidate
 */
export const invalidateMultipleQueries = (
  queryClient: QueryClient,
  queryKeys: string[]
): void => {
  queryKeys.forEach((key) => {
    queryClient.invalidateQueries({ queryKey: [key] });
  });
};

/**
 * Set up automatic refetching for specific queries based on events
 * @param queryClient The React Query client instance
 */
export const setupAutoRefetching = (queryClient: QueryClient): void => {
  // Set up interval refetching for critical data
  const intervalIds: NodeJS.Timeout[] = [];
  
  // Refetch user data every 2 minutes
  intervalIds.push(
    setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    }, 2 * 60 * 1000)
  );
  
  // Refetch notifications every minute
  intervalIds.push(
    setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    }, 60 * 1000)
  );
  
  // Clean up intervals on window unload
  window.addEventListener('beforeunload', () => {
    intervalIds.forEach(clearInterval);
  });
};

/**
 * Update multiple related queries when a mutation occurs
 * @param queryClient The React Query client instance
 * @param primaryKey The primary query key that was updated
 * @param relatedKeys Array of related query keys to invalidate
 */
export const updateRelatedQueries = (
  queryClient: QueryClient,
  primaryKey: string,
  relatedKeys: string[]
): void => {
  // Invalidate the primary key first
  queryClient.invalidateQueries({ queryKey: [primaryKey] });
  
  // Then invalidate all related keys
  invalidateMultipleQueries(queryClient, relatedKeys);
};