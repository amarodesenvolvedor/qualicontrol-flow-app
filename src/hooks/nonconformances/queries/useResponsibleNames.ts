
import { useQuery } from '@tanstack/react-query';
import { fetchResponsibleNames } from '@/services/nonConformance';

export const useResponsibleNames = () => {
  return useQuery({
    queryKey: ['responsibleNames'],
    queryFn: async () => {
      try {
        const names = await fetchResponsibleNames();
        // Ensure we always return an array
        return Array.isArray(names) ? names : [];
      } catch (err) {
        console.error('Error fetching responsible names:', err);
        // Return empty array on error instead of throwing
        return [];
      }
    },
    // Always return an array, even if the query returns undefined
    select: (data) => Array.isArray(data) ? data : [],
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
