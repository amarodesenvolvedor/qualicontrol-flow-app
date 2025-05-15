
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { 
  createNonConformance as createNC, 
  updateNonConformance as updateNC,
  deleteNonConformance as deleteNC,
  uploadFilesToStorage,
  fetchNonConformances
} from '@/services/nonConformance';
import { NonConformanceCreateData, NonConformanceUpdateData, NonConformance } from '@/types/nonConformance';
import { sendNonConformanceNotification } from '@/services/notificationService';
import { logHistory } from '@/services/historyService';

export const useNonConformanceMutations = () => {
  const queryClient = useQueryClient();

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
        console.log("Sending update for ID:", id);
        console.log("Data to be updated:", data);
        
        // Fetch the current state before updating
        const currentData = await queryClient.fetchQuery({
          queryKey: ['nonConformance', id],
          queryFn: async () => {
            console.log("Fetching current record");
            const response = await fetchNonConformances({ searchTerm: id });
            const record = response.find((nc: NonConformance) => nc.id === id);
            console.log("Current record found:", record);
            return record || null;
          }
        });
        
        if (!currentData) {
          console.error("Current record not found");
          throw new Error("Record not found for update");
        }
        
        // Improved error handling during update
        try {
          const result = await updateNC(id, data);
          console.log("Update result:", result);
          
          // Log history for each changed field
          if (currentData && result) {
            Object.keys(data).forEach(key => {
              const keyTyped = key as keyof typeof data;
              const currentKeyTyped = key as keyof typeof currentData;
              
              if (data[keyTyped] !== currentData[currentKeyTyped]) {
                try {
                  logHistory(
                    'non_conformance',
                    id,
                    key,
                    currentData[currentKeyTyped] !== null ? String(currentData[currentKeyTyped]) : null,
                    data[keyTyped] !== null ? String(data[keyTyped]) : null
                  );
                } catch (historyError) {
                  console.error('Error logging history:', historyError);
                  // Don't interrupt the process if history logging fails
                }
              }
            });
          }
          
          return result;
        } catch (updateError: any) {
          console.error("Error during update operation:", updateError);
          throw new Error(`Falha ao atualizar registro: ${updateError.message}`);
        }
      } catch (error) {
        console.error("Error in update mutation:", error);
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
          // Don't interrompe o processo se falhar a notificação
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['nonConformances'] });
      queryClient.invalidateQueries({ queryKey: ['nonConformanceEdit'] });
    },
    onError: (error: any) => {
      console.error("Error in update:", error);
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

  return {
    createNonConformance,
    updateNonConformance,
    deleteNonConformance,
    uploadFiles: uploadFilesToStorage,
  };
};
