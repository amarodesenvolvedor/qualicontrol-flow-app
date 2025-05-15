
import { supabase } from '@/integrations/supabase/client';
import { NonConformance, NonConformanceFilter } from '@/types/nonConformance';

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
