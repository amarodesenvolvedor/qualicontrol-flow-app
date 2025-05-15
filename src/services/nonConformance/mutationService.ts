
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
      .select('id')
      .eq('id', id)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking existing record:', checkError);
      throw new Error(`Error checking record existence: ${checkError.message}`);
    }
    
    if (!existingRecord) {
      console.error('Record not found with ID:', id);
      throw new Error('Record not found for update');
    }
    
    // Now perform the update
    const { data: updatedData, error } = await supabase
      .from('non_conformances')
      .update({
        ...data,
        updated_at: new Date().toISOString() // Ensure updated_at is set
      })
      .eq('id', id)
      .select(`
        *,
        department:department_id (
          id,
          name
        )
      `)
      .maybeSingle();

    if (error) {
      console.error('Supabase error updating non-conformance:', error);
      throw new Error(`Error updating non-conformance: ${error.message}`);
    }

    if (!updatedData) {
      console.error('No record returned after update with ID:', id);
      throw new Error('No record was returned after update. The update may have failed.');
    }

    console.log('Successfully updated non-conformance:', updatedData);
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
