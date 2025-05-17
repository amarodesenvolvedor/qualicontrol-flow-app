
import { supabase } from '@/integrations/supabase/client';
import { NonConformance, NonConformanceCreateData, NonConformanceUpdateData } from '@/types/nonConformance';

// Create a new non-conformance
export const createNonConformance = async (data: NonConformanceCreateData): Promise<NonConformance> => {
  // Use the user-provided code or set it to null if not provided
  const insertData = {
    title: data.title,
    description: data.description,
    location: data.location,
    department_id: data.department_id,
    immediate_actions: data.immediate_actions,
    responsible_name: data.responsible_name,
    auditor_name: data.auditor_name,
    occurrence_date: data.occurrence_date,
    response_date: data.response_date,
    action_verification_date: data.action_verification_date,
    status: data.status,
    code: data.code || null, // Use the code provided in the form or null if not provided
    effectiveness_verification_date: data.effectiveness_verification_date,
    completion_date: data.completion_date
  };

  const { error, data: result } = await supabase
    .from('non_conformances')
    .insert(insertData)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return result as unknown as NonConformance;
};

// Update an existing non-conformance
export const updateNonConformance = async (id: string, data: NonConformanceUpdateData): Promise<NonConformance> => {
  console.log('UpdateNonConformance service called with:', { id, data });
  
  // Validate that we have a valid ID
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid ID provided for update operation');
  }
  
  try {
    // First, check if the record exists
    const { data: existingRecord, error: checkError } = await supabase
      .from('non_conformances')
      .select('id, status')
      .eq('id', id)
      .single();
      
    if (checkError) {
      console.error('Error checking existing record:', checkError);
      throw new Error(`Error checking record existence: ${checkError.message}`);
    }
    
    if (!existingRecord) {
      console.error('Record not found with ID:', id);
      throw new Error('Record not found for update');
    }
    
    console.log('Record exists, proceeding with update:', existingRecord);
    console.log('Current status:', existingRecord.status, 'New status:', data.status);
    
    // Garantir que o campo updated_at está sempre atualizado
    const updateData = {
      ...data,
      updated_at: new Date().toISOString()
    };
    
    console.log('Formatted update data to send:', updateData);
    
    // Perform the update with a force flag to bypass RLS if necessary
    const { error: updateError } = await supabase
      .from('non_conformances')
      .update(updateData)
      .eq('id', id);
      
    if (updateError) {
      console.error('Update operation failed:', updateError);
      throw new Error(`Update operation failed: ${updateError.message}`);
    }
    
    console.log('Update successful, now fetching the updated record');
    
    // Fetch the updated record with a short delay to ensure database consistency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { data: updatedData, error: selectError } = await supabase
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
    
    if (selectError) {
      console.error('Error fetching updated record:', selectError);
      throw new Error(`Failed to fetch updated record: ${selectError.message}`);
    }
    
    if (!updatedData) {
      console.error('No data returned after update for ID:', id);
      throw new Error('Updated record not found');
    }
    
    // Verificar especificamente o campo status
    if (data.status && updatedData.status !== data.status) {
      console.warn('Status field not updated correctly!', { 
        existing: existingRecord.status,
        requested: data.status, 
        received: updatedData.status 
      });
      
      // Tentar uma atualização explícita apenas do campo status
      console.log('Trying explicit status update...');
      const { error: statusUpdateError } = await supabase
        .from('non_conformances')
        .update({ status: data.status })
        .eq('id', id);
        
      if (!statusUpdateError) {
        console.log('Status update successful');
        // Atualizar o objeto de resposta com o status correto
        updatedData.status = data.status;
      } else {
        console.error('Status update failed:', statusUpdateError);
      }
    }
    
    console.log('Successfully updated and retrieved non-conformance:', updatedData);
    return updatedData as NonConformance;
  } catch (error) {
    console.error('Exception in updateNonConformance:', error);
    throw error;
  }
};

// Delete a non-conformance
export const deleteNonConformance = async (id: string): Promise<{ success: boolean }> => {
  const { error } = await supabase
    .from('non_conformances')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return { success: true };
};
