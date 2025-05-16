
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { createNonConformance as createNC } from '@/services/nonConformance';
import { NonConformanceCreateData } from '@/types/nonConformance';
import { sendNonConformanceNotification } from '@/services/notificationService';
import { logHistory } from '@/services/historyService';

export const useCreateNonConformance = () => {
  const queryClient = useQueryClient();

  return useMutation({
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
};
