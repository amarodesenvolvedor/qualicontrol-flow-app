
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NonConformance } from "@/hooks/useNonConformances";

export const useNonConformanceData = () => {
  const { id } = useParams<{ id: string }>();

  const { data: ncData, isLoading, error } = useQuery({
    queryKey: ['nonConformanceEdit', id],
    queryFn: async () => {
      if (!id) {
        console.error('No ID provided for query');
        return null;
      }
      
      console.log('Fetching non-conformance with ID:', id);
      try {
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
          .maybeSingle();

        if (error) {
          console.error('Error fetching non-conformance:', error);
          throw error;
        }
        
        if (!data) {
          console.error('No non-conformance found with ID:', id);
          return null;
        }
        
        console.log('Fetched non-conformance data:', data);
        return data as NonConformance;
      } catch (err) {
        console.error('Exception in fetch query:', err);
        throw err;
      }
    },
    enabled: !!id,
  });

  return { ncData, isLoading, error, id };
};
