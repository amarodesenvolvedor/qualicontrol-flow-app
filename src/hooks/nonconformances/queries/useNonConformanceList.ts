
import { useQuery } from '@tanstack/react-query';
import { fetchNonConformances } from '@/services/nonConformance';
import { NonConformanceFilter, NonConformance } from '@/types/nonConformance';

export const useNonConformanceList = (filters: NonConformanceFilter) => {
  return useQuery({
    queryKey: ['nonConformances', filters],
    queryFn: async () => {
      try {
        console.log('Fetching with filters:', filters);
        const data = await fetchNonConformances(filters);
        // Ensure we always return an array
        return Array.isArray(data) ? data : [];
      } catch (err) {
        console.error('Error fetching non-conformances:', err);
        // Return empty array on error instead of throwing
        return [];
      }
    },
    // Always return an array when selecting data
    select: (data): NonConformance[] => Array.isArray(data) ? data : [],
  });
};
