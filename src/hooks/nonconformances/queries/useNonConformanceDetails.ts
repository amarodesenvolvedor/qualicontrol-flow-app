
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NonConformance } from '@/types/nonConformance';

export const useNonConformanceDetails = () => {
  const fetchNonConformanceById = (id: string) => {
    return useQuery({
      queryKey: ['nonConformance', id],
      queryFn: async () => {
        if (!id) return null;
        
        console.log('Fetching details for non-conformance ID:', id);
        
        const { data, error } = await supabase
          .from('non_conformances')
          .select(`
            *,
            department:department_id (
              id,
              name
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching non-conformance details:', error);
          throw error;
        }
        
        return data as NonConformance;
      },
      enabled: !!id,
    });
  };

  return {
    fetchNonConformanceById
  };
};
