
import { supabase } from '@/integrations/supabase/client';
import { NonConformance, NonConformanceFilter } from '@/types/nonConformance';
import { format } from 'date-fns';

export const fetchNonConformances = async (filters: NonConformanceFilter = {}): Promise<NonConformance[]> => {
  try {
    console.log('Fetching non-conformances with filters:', filters);
    
    let query = supabase
      .from('non_conformances')
      .select(`
        *,
        department:departments(*)
      `)
      .order('created_at', { ascending: false });
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.departmentId) {
      const departmentIds = filters.departmentId.split(',');
      query = query.in('department_id', departmentIds);
    }
    
    if (filters.responsibleName) {
      query = query.ilike('responsible_name', `%${filters.responsibleName}%`);
    }

    // Handle ISO requirement filtering with explicit type casting to avoid deep instantiation
    const isoReq = filters.isoRequirement;
    if (typeof isoReq === 'string' && isoReq.length > 0) {
      query = query.eq('iso_requirement', isoReq);
    }
    
    if (filters.dateRange?.from || filters.dateRange?.to) {
      if (filters.dateRange.from) {
        const formattedFrom = format(filters.dateRange.from, 'yyyy-MM-dd');
        query = query.gte('occurrence_date', formattedFrom);
      }
      
      if (filters.dateRange.to) {
        const formattedTo = format(filters.dateRange.to, 'yyyy-MM-dd');
        query = query.lte('occurrence_date', formattedTo);
      }
    }
    
    if (filters.searchTerm) {
      query = query.or(`
        title.ilike.%${filters.searchTerm}%, 
        description.ilike.%${filters.searchTerm}%, 
        code.ilike.%${filters.searchTerm}%
      `);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching non-conformances:', error);
      throw new Error(error.message);
    }
    
    return data as NonConformance[];
    
  } catch (error) {
    console.error('Error in fetchNonConformances:', error);
    throw error;
  }
};

export const fetchNonConformanceById = async (id: string): Promise<NonConformance> => {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .select(`
        *,
        department:departments(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching non-conformance by ID:', error);
      throw new Error(error.message);
    }
    
    return data as NonConformance;
    
  } catch (error) {
    console.error('Error in fetchNonConformanceById:', error);
    throw error;
  }
};

export const fetchResponsibleNames = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .select('responsible_name')
      .order('responsible_name');
    
    if (error) {
      console.error('Error fetching responsible names:', error);
      throw new Error(error.message);
    }
    
    // Extract unique names
    const uniqueNames = [...new Set(data.map(item => item.responsible_name))];
    return uniqueNames;
    
  } catch (error) {
    console.error('Error in fetchResponsibleNames:', error);
    throw error;
  }
};
