
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NonConformance } from "@/hooks/useNonConformances";
import { useEffect } from "react";
import { toast } from "sonner";

export const useNonConformanceData = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  
  // Force refresh on mount and set a shorter staleTime
  useEffect(() => {
    if (id) {
      console.log('Invalidating cache for non-conformance data on mount');
      queryClient.invalidateQueries({ queryKey: ['nonConformanceEdit', id] });
    }
  }, [id, queryClient]);

  const { data: ncData, isLoading, error } = useQuery({
    queryKey: ['nonConformanceEdit', id],
    queryFn: async () => {
      if (!id) {
        console.error('No ID provided for query');
        return null;
      }
      
      console.log('Fetching non-conformance with ID:', id);
      try {
        // First, check if the record exists to provide a better error message
        const { count, error: countError } = await supabase
          .from('non_conformances')
          .select('id', { count: 'exact', head: true })
          .eq('id', id);
          
        if (countError) {
          console.error('Error checking if record exists:', countError);
          throw countError;
        }
        
        if (count === 0) {
          console.error('No record found with ID:', id);
          toast.error('Registro não encontrado', {
            description: 'A não conformidade solicitada não foi encontrada no banco de dados.'
          });
          return null;
        }

        // Now fetch the full record
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
    staleTime: 0, // Always consider data stale to force refetch
    refetchOnMount: 'always', // Always refetch on mount
    retry: 1, // Retry once in case of temporary network issues
  });

  return { ncData, isLoading, error, id };
};
