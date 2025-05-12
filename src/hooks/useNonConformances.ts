
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
import { sendNonConformanceNotification } from '@/services/notificationService';
import { logHistory } from '@/services/historyService';

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
    onSuccess: (result) => {
      toast({
        title: 'Não conformidade criada',
        description: 'A não conformidade foi criada com sucesso.',
      });
      
      // Send notification email to responsible person
      if (result) {
        sendNonConformanceNotification(
          result.id, 
          result.department_id, 
          result.responsible_name
        );
        
        // Log the creation in history
        Object.keys(result).forEach(key => {
          if (result[key as keyof typeof result] !== null && 
              key !== 'id' && 
              key !== 'created_at' && 
              key !== 'updated_at' &&
              key !== 'code') {
            logHistory(
              'non_conformance', 
              result.id, 
              key, 
              null, 
              result[key as keyof typeof result]
            );
          }
        });
      }
      
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
      // Fetch the current state before updating
      const { data: currentData } = await queryClient.fetchQuery({
        queryKey: ['nonConformance', id],
        queryFn: async () => {
          const response = await fetchNonConformances({ searchTerm: id });
          return response.find(nc => nc.id === id) || null;
        }
      });
      
      const result = await updateNC(id, data);
      
      // Log history for each changed field
      if (currentData) {
        Object.keys(data).forEach(key => {
          const keyTyped = key as keyof typeof data;
          if (data[keyTyped] !== currentData[keyTyped]) {
            logHistory(
              'non_conformance',
              id,
              key,
              currentData[keyTyped],
              data[keyTyped]
            );
          }
        });
      }
      
      return result;
    },
    onSuccess: (result) => {
      toast({
        title: 'Não conformidade atualizada',
        description: 'A não conformidade foi atualizada com sucesso.',
      });
      
      // If status is changed to something that requires action, notify the responsible person
      if (result && (result.status === 'in-progress')) {
        sendNonConformanceNotification(
          result.id,
          result.department_id,
          result.responsible_name
        );
      }
      
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
