
import { useQuery } from '@tanstack/react-query';
import { fetchResponsibleNames } from '@/services/nonConformance';

export const useResponsibleNames = () => {
  return useQuery({
    queryKey: ['responsibleNames'],
    queryFn: async () => {
      try {
        return await fetchResponsibleNames();
      } catch (err) {
        console.error('Error fetching responsible names:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
