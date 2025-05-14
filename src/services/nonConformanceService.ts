
import { supabase } from '@/integrations/supabase/client';
import { NonConformance, NonConformanceFilter, NonConformanceCreateData, NonConformanceUpdateData } from '@/types/nonConformance';

// Function to fetch all non conformances with filters
export const fetchNonConformances = async (filters: NonConformanceFilter): Promise<NonConformance[]> => {
  let query = supabase
    .from('non_conformances')
    .select(`
      *,
      department:department_id (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters.status) {
    const statuses = filters.status.split(',');
    if (statuses.length > 0) {
      query = query.in('status', statuses);
    }
  }

  if (filters.category) {
    const categories = filters.category.split(',');
    if (categories.length > 0) {
      query = query.in('category', categories);
    }
  }

  if (filters.departmentId) {
    const departments = filters.departmentId.split(',');
    if (departments.length > 0) {
      query = query.in('department_id', departments);
    }
  }

  if (filters.dateRange?.from) {
    query = query.gte('occurrence_date', filters.dateRange.from.toISOString().split('T')[0]);
  }

  if (filters.dateRange?.to) {
    query = query.lte('occurrence_date', filters.dateRange.to.toISOString().split('T')[0]);
  }

  if (filters.searchTerm) {
    query = query.or(`title.ilike.%${filters.searchTerm}%,code.ilike.%${filters.searchTerm}%`);
  }

  if (filters.responsibleName) {
    const responsibles = filters.responsibleName.split(',');
    if (responsibles.length > 0) {
      query = query.in('responsible_name', responsibles);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching non conformances:', error);
    throw new Error('Error fetching non conformances');
  }

  return data as unknown as NonConformance[];
};

// Create a new non-conformance
export const createNonConformance = async (data: NonConformanceCreateData): Promise<NonConformance> => {
  // Use the user-provided code or set it to null if not provided
  const insertData = {
    title: data.title,
    description: data.description,
    location: data.location,
    department_id: data.department_id,
    category: data.category,
    immediate_actions: data.immediate_actions,
    responsible_name: data.responsible_name,
    auditor_name: data.auditor_name,
    occurrence_date: data.occurrence_date,
    deadline_date: data.deadline_date,
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
  const { data: updatedData, error } = await supabase
    .from('non_conformances')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating non-conformance:', error);
    throw new Error('Error updating non-conformance');
  }

  return updatedData as unknown as NonConformance;
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

// Upload files to Supabase storage
export const uploadFilesToStorage = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(async (file) => {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `evidences/${fileName}`;

    const { error } = await supabase.storage
      .from('non_conformance_files')
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    return filePath;
  });

  return Promise.all(uploadPromises);
};

// Function to get all responsible names
export const fetchResponsibleNames = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('non_conformances')
    .select('responsible_name')
    .order('responsible_name');
    
  if (error) {
    console.error('Error fetching responsible names:', error);
    throw new Error('Error fetching responsible names');
  }
  
  // Extract unique responsible names
  const names = new Set<string>();
  data.forEach(item => {
    if (item.responsible_name) {
      names.add(item.responsible_name);
    }
  });
  
  return Array.from(names);
};
