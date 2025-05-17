
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { updateNonConformance as updateNC } from '@/services/nonConformance';
import { NonConformanceUpdateData } from '@/types/nonConformance';
import { supabase } from '@/integrations/supabase/client';
import { sendNonConformanceNotification } from '@/services/notificationService';
import { logHistory } from '@/services/historyService';

export const useUpdateNonConformance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: NonConformanceUpdateData }) => {
      try {
        console.log("Sending update for ID:", id);
        console.log("Data to be updated:", data);
        
        // Fetch the current record directly from Supabase for consistency
        const { data: currentData, error: fetchError } = await supabase
          .from('non_conformances')
          .select(`*`)
          .eq('id', id)
          .single();
          
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
        console.log("Calling updateNC with:", id, data);
        const result = await updateNC(id, data);
        console.log("Update result:", result);
        
        // Verify the result has expected keys
        if (!result || !result.id) {
          console.error("Invalid result returned from update:", result);
          throw new Error("Update failed: Invalid or missing result data");
        }
        
        // Explicitar verificar se o status foi atualizado corretamente
        if (data.status && result.status !== data.status) {
          console.warn("Status field not updated correctly in result", {
            requested: data.status,
            actual: result.status
          });
          
          // Tentar nova verificação
          const { data: verifyData } = await supabase
            .from('non_conformances')
            .select('status')
            .eq('id', id)
            .single();
            
          if (verifyData && verifyData.status === data.status) {
            console.log("Status updated correctly according to verification");
            result.status = data.status;
          } else {
            console.warn("Status still not updated correctly after verification");
          }
        }
        
        // Log history for each changed field
        if (currentData && result) {
          Object.keys(data).forEach(key => {
            const keyTyped = key as keyof typeof data;
            const currentKeyTyped = key as keyof typeof currentData;
            
            // Skip undefined new values
            if (data[keyTyped] === undefined) return;
            
            // Use direct value comparison for fields that aren't dates
            if (!key.includes('date') && currentData[currentKeyTyped] !== data[keyTyped]) {
              console.log(`Logging history for field ${key}:`, { 
                old: currentData[currentKeyTyped], 
                new: data[keyTyped]
              });
              
              try {
                // Log the change to history
                logHistory(
                  'non_conformance',
                  id,
                  key,
                  currentData[currentKeyTyped] !== null ? String(currentData[currentKeyTyped]) : null,
                  data[keyTyped] !== null ? String(data[keyTyped]) : null
                );
              } catch (historyError) {
                console.error('Error logging history:', historyError);
              }
            }
            // For date fields, convert to ISO strings for comparison
            else if (key.includes('date')) {
              const oldDateStr = currentData[currentKeyTyped] !== null ? 
                  (typeof currentData[currentKeyTyped] === 'string' ? currentData[currentKeyTyped] : new Date(currentData[currentKeyTyped] as any).toISOString()) : 
                  null;
                  
              const newDateStr = data[keyTyped] !== null ? 
                  (typeof data[keyTyped] === 'string' ? data[keyTyped] : new Date(data[keyTyped] as any).toISOString()) : 
                  null;
              
              // Only log if different
              if (oldDateStr !== newDateStr) {
                console.log(`Logging history for date field ${key}:`, { 
                  old: oldDateStr, 
                  new: newDateStr 
                });
                
                try {
                  logHistory('non_conformance', id, key, oldDateStr, newDateStr);
                } catch (historyError) {
                  console.error('Error logging history for date field:', historyError);
                }
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
        }
      }
      
      // Invalidar todas as queries relacionadas para garantir que os dados estejam atualizados
      console.log("Invalidating queries after successful update");
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
};
