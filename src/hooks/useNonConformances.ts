
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { 
  fetchNonConformances, 
  createNonConformance as createNC, 
  updateNonConformance as updateNC,
  deleteNonConformance as deleteNC,
  uploadFilesToStorage
} from '@/services/nonConformanceService';
import { NonConformanceFilter, NonConformanceCreateData, NonConformanceUpdateData } from '@/types/nonConformance';

export * from '@/types/nonConformance';

export const useNonConformances = () => {
  const queryClient = useQueryClient();
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

  const createNonConformance = useMutation({
    mutationFn: async (data: NonConformanceCreateData) => {
      try {
        return await createNC(data);
      } catch (error) {
        console.error('Error creating non-conformance:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Não conformidade criada',
        description: 'A não conformidade foi criada com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['nonConformances'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: `Erro ao criar não conformidade: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const updateNonConformance = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: NonConformanceUpdateData }) => {
      return await updateNC(id, data);
    },
    onSuccess: () => {
      toast({
        title: 'Não conformidade atualizada',
        description: 'A não conformidade foi atualizada com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['nonConformances'] });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar não conformidade.',
        variant: 'destructive',
      });
    },
  });

  const deleteNonConformance = useMutation({
    mutationFn: async (id: string) => {
      return await deleteNC(id);
    },
    onSuccess: () => {
      toast({
        title: 'Não conformidade excluída',
        description: 'A não conformidade foi excluída com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['nonConformances'] });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir não conformidade.',
        variant: 'destructive',
      });
    },
  });

  // Return the necessary data and functions
  return {
    nonConformances: data,
    isLoading,
    isError,
    error,
    refetch,
    createNonConformance,
    updateNonConformance,
    deleteNonConformance,
    uploadFiles: uploadFilesToStorage,
    filters,
    setFilters,
  };
};
