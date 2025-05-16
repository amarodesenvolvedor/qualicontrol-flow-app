
import { useQuery } from '@tanstack/react-query';
import { fetchNonConformances } from '@/services/nonConformance';
import { NonConformanceFilter, NonConformance } from '@/types/nonConformance';

export const useNonConformanceList = (filters: NonConformanceFilter) => {
  return useQuery({
    queryKey: ['nonConformances', filters],
    queryFn: async () => {
      try {
        const data = await fetchNonConformances(filters);
        return data;
      } catch (err) {
        console.error('Error fetching non-conformances:', err);
        throw err;
      }
    },
  });
};
