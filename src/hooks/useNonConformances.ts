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
import { NonConformanceFilter, NonConformanceCreateData, NonConformanceUpdateData, NonConformance } from '@/types/nonConformance';
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
      return await createNC(data);
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
          const typedKey = key as keyof typeof result;
          if (result[typedKey] !== null && 
              typedKey !== 'id' && 
              typedKey !== 'created_at' && 
              typedKey !== 'updated_at' &&
              typedKey !== 'code') {
            logHistory(
              'non_conformance', 
              result.id, 
              key, 
              null, 
              result[typedKey]
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
      try {
        console.log("Enviando atualização para o ID:", id);
        console.log("Dados a serem atualizados:", data);
        
        // Fetch the current state before updating
        const currentData = await queryClient.fetchQuery({
          queryKey: ['nonConformance', id],
          queryFn: async () => {
            console.log("Buscando registro atual");
            const response = await fetchNonConformances({ searchTerm: id });
            const record = response.find((nc: NonConformance) => nc.id === id);
            console.log("Registro atual encontrado:", record);
            return record || null;
          }
        });
        
        if (!currentData) {
          console.error("Registro atual não encontrado");
          throw new Error("Registro não encontrado para atualização");
        }
        
        const result = await updateNC(id, data);
        console.log("Resultado da atualização:", result);
        
        // Log history for each changed field
        if (currentData) {
          Object.keys(data).forEach(key => {
            const keyTyped = key as keyof typeof data;
            const currentKeyTyped = key as keyof typeof currentData;
            
            if (data[keyTyped] !== currentData[currentKeyTyped]) {
              try {
                logHistory(
                  'non_conformance',
                  id,
                  key,
                  String(currentData[currentKeyTyped]),
                  String(data[keyTyped])
                );
              } catch (historyError) {
                console.error('Erro ao registrar histórico:', historyError);
                // Não interrompe o processo se falhar o histórico
              }
            }
          });
        }
        
        return result;
      } catch (error) {
        console.error("Erro na mutação de atualização:", error);
        throw error;
      }
    },
    onSuccess: (result) => {
      toast({
        title: 'Não conformidade atualizada',
        description: 'A não conformidade foi atualizada com sucesso.',
      });
      
      // If status is changed to something that requires action, notify the responsible person
      if (result && (result.status === 'in-progress')) {
        try {
          sendNonConformanceNotification(
            result.id,
            result.department_id,
            result.responsible_name
          );
        } catch (notifyError) {
          console.error("Erro ao enviar notificação:", notifyError);
          // Não interrompe o processo se falhar a notificação
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['nonConformances'] });
      queryClient.invalidateQueries({ queryKey: ['nonConformanceEdit'] });
    },
    onError: (error: any) => {
      console.error("Erro na atualização:", error);
      toast({
        title: 'Erro',
        description: `Erro ao atualizar não conformidade: ${error.message || 'Erro desconhecido'}`,
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
    nonConformances: data as NonConformance[],
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
