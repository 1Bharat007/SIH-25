import { useQuery } from '@tanstack/react-query';
import { HealthCheckResponse } from '@sikkim-yatra/shared';
import { fetchApi } from '../lib/api-client';

export function useHealthCheck() {
  return useQuery<HealthCheckResponse, Error>({
    queryKey: ['health-check'],
    queryFn: () => fetchApi<HealthCheckResponse>('/health'),
    refetchInterval: 10000, // Refetch every 10 seconds for real-time status display
    refetchIntervalInBackground: false,
  });
}
