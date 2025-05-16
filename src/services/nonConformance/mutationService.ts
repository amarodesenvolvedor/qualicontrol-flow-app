
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
    
    // Format the update data - ensure proper date formatting
    const updateData = {
      ...data,
      updated_at: new Date().toISOString()
    };
    
    console.log('Formatted update data to send:', updateData);
    
    // IMPROVEMENT: Separate the update and select operations for better error handling
    // Step 1: Perform the update operation
    const { error: updateError } = await supabase
      .from('non_conformances')
      .update(updateData)
      .eq('id', id);
      
    if (updateError) {
      console.error('Update operation failed:', updateError);
      throw new Error(`Update operation failed: ${updateError.message}`);
    }
    
    console.log('Update successful, now fetching the updated record');
    
    // Step 2: Fetch the updated record in a separate operation
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
      throw new Error(`Update succeeded but could not fetch updated record: ${selectError.message}`);
    }
    
    if (!updatedData) {
      console.error('No data returned after update for ID:', id);
      throw new Error('Update appeared to succeed but no record was returned');
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
