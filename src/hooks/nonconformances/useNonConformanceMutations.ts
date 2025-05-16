
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { 
  createNonConformance as createNC, 
  updateNonConformance as updateNC,
  deleteNonConformance as deleteNC,
  uploadFilesToStorage,
} from '@/services/nonConformance';
import { supabase } from '@/integrations/supabase/client';
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
        
        // Fetch the current record directly from Supabase for consistency
        const { data: currentData, error: fetchError } = await supabase
          .from('non_conformances')
          .select(`*`)
          .eq('id', id)
          .maybeSingle();
          
        if (fetchError) {
          console.error("Error fetching current record:", fetchError);
          throw new Error(`Error fetching current record: ${fetchError.message}`);
        }
        
        if (!currentData) {
          console.error("Current record not found for ID:", id);
          throw new Error("Record not found for update");
        }
        
        console.log("Current record found:", currentData);
        
        // Update the record using the service function
        const result = await updateNC(id, data);
        console.log("Update result:", result);
        
        // Verify the result has expected keys
        if (!result || !result.id) {
          console.error("Invalid result returned from update:", result);
          throw new Error("Update failed: Invalid or missing result data");
        }
        
        // Log history for each changed field
        if (currentData && result) {
          Object.keys(data).forEach(key => {
            const keyTyped = key as keyof typeof data;
            const currentKeyTyped = key as keyof typeof currentData;
            
            // Check if the value has changed
            const oldValue = currentData[currentKeyTyped];
            const newValue = data[keyTyped];
            
            // Convert to string for comparison as dates might be in different formats
            const oldValueStr = oldValue !== null ? String(oldValue) : null;
            const newValueStr = newValue !== null ? String(newValue) : null;
            
            if (oldValueStr !== newValueStr) {
              console.log(`Logging history for field ${key}:`, { 
                old: oldValue, 
                new: newValue 
              });
              
              try {
                logHistory(
                  'non_conformance',
                  id,
                  key,
                  oldValue !== null ? String(oldValue) : null,
                  newValue !== null ? String(newValue) : null
                );
              } catch (historyError) {
                console.error('Error logging history:', historyError);
                // Don't interrupt the process if history logging fails
              }
            }
          });
        }
        
        return result;
      } catch (error: any) {
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
          // Don't interrupt the process if notification fails
        }
      }
      
      // Invalidate all related queries to ensure the UI updates
      queryClient.invalidateQueries({ queryKey: ['nonConformances'] });
      queryClient.invalidateQueries({ queryKey: ['nonConformance', result.id] });
      queryClient.invalidateQueries({ queryKey: ['nonConformanceEdit', result.id] });
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
