
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
          console.error("Verification fetch after update failed:", verifyError);
          throw new Error(`Verification failed: ${verifyError.message}`);
        }
        
        if (!verifyData) {
          console.error("Verification failed: No data returned");
          throw new Error("Verification failed: Record not found after update");
        }
        
        console.log("Verification successful, updated record exists:", verifyData);
        
        // Special check for status field since it's critical and commonly causing issues
        if (data.status && verifyData.status !== data.status) {
          console.error("Status field did not update correctly!", {
            requested: data.status,
            actual: verifyData.status
          });
          throw new Error(`Status field update failed: Expected ${data.status}, got ${verifyData.status}`);
        }
        
        // Check if some fields didn't update as expected, but don't throw errors
        // since the critical status field check is done separately
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
                verifyData[verifyKey] !== data[typedKey];
        });
        
        if (mismatchFields.length > 0) {
          console.warn("Warning: Some fields may not have updated correctly:", mismatchFields);
        }
        
        // Log history for each changed field
        if (currentData && result) {
          Object.keys(data).forEach(key => {
            const keyTyped = key as keyof typeof data;
            const currentKeyTyped = key as keyof typeof currentData;
            
            // Skip undefined new values (they shouldn't be sent to update)
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
            // For date fields, convert to ISO strings for comparison if they're not already strings
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
      
      // Invalidate all related queries immediately
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
