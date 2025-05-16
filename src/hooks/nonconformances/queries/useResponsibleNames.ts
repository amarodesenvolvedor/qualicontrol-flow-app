
import { useQuery } from '@tanstack/react-query';
import { fetchResponsibleNames } from '@/services/nonConformance';

export const useResponsibleNames = () => {
  return useQuery({
    queryKey: ['responsibleNames'],
    queryFn: async () => {
      try {
        const names = await fetchResponsibleNames();
        return names || []; // Ensure we always return an array
      } catch (err) {
        console.error('Error fetching responsible names:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
