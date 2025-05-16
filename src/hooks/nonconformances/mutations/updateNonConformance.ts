
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
        
        // Update the record using the service function - explicitly await the result
        const result = await updateNC(id, data);
        console.log("Update result:", result);
        
        // Verify the result has expected keys
        if (!result || !result.id) {
          console.error("Invalid result returned from update:", result);
          throw new Error("Update failed: Invalid or missing result data");
        }
        
        // Explicitly verify the update was successful by fetching again
        const { data: verifyData, error: verifyError } = await supabase
          .from('non_conformances')
          .select(`*`)
          .eq('id', id)
          .single();
          
        if (verifyError) {
          console.warn("Warning: Verification fetch after update failed:", verifyError);
          // Don't throw here since the update might have succeeded
        } else if (verifyData) {
          console.log("Verification successful, updated record exists:", verifyData);
          
          // Check if some fields didn't update as expected
          const mismatchFields = Object.keys(data).filter(key => {
            const typedKey = key as keyof typeof data;
            const verifyKey = key as keyof typeof verifyData;
            
            // Skip null values and date fields which might have format differences
            if (data[typedKey] === null || 
                key.includes('date') || 
                key === 'updated_at') {
              return false;
            }
            
            return data[typedKey] !== undefined && 
                  verifyData[verifyKey] !== undefined && 
                  String(data[typedKey]) !== String(verifyData[verifyKey]);
          });
          
          if (mismatchFields.length > 0) {
            console.warn("Warning: Some fields may not have updated correctly:", mismatchFields);
          }
        }
        
        // Log history for each changed field
        if (currentData && result) {
          Object.keys(data).forEach(key => {
            const keyTyped = key as keyof typeof data;
            const currentKeyTyped = key as keyof typeof currentData;
            
            // Check if the value has changed
            const oldValue = currentData[currentKeyTyped];
            const newValue = data[keyTyped];
            
            // Skip undefined new values (they shouldn't be sent to update)
            if (newValue === undefined) return;
            
            // Convert to string for comparison as dates might be in different formats
            const oldValueStr = oldValue !== null ? String(oldValue) : null;
            const newValueStr = newValue !== null ? String(newValue) : null;
            
            if (oldValueStr !== newValueStr) {
              console.log(`Logging history for field ${key}:`, { 
                old: oldValue, 
                new: newValue 
              });
              
              try {
                // Log the change to history
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
      
      // Invalidate all related queries immediately (no setTimeout)
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
