
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNonConformances } from '@/services/nonConformance';
import { NonConformanceFilter } from '@/types/nonConformance';

export const useNonConformanceQueries = () => {
  const [filters, setFilters] = useState<NonConformanceFilter>({});
  const [error, setError] = useState<Error | null>(null);

  // Use the useQuery hook to fetch non-conformances
  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['nonConformances', filters],
    queryFn: async () => {
      try {
        return await fetchNonConformances(filters);
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
  });

  return {
    nonConformances: data,
    isLoading,
    isError,
    error,
    refetch,
    filters,
    setFilters,
  };
};
