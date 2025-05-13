
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AuditReport } from '@/types/audit';
import { useAuditFilters } from './useAuditFilters';
import { useAuditReportsCrud } from './useAuditReportsCrud';

export const useAuditReports = () => {
  const { filters, setFilters, getYearsFromReports } = useAuditFilters();
  const { createAuditReport, deleteAuditReport, isUploading } = useAuditReportsCrud();

  // Function to fetch all audit reports
  const fetchAuditReports = async (): Promise<AuditReport[]> => {
    let query = supabase
      .from('audit_reports')
      .select(`
        *,
        department:department_id (
          id,
          name
        )
      `)
      .order('audit_date', { ascending: false });

    // Apply filters
    if (filters.year) {
      const startDate = `${filters.year}-01-01`;
      const endDate = `${filters.year}-12-31`;
      query = query.gte('audit_date', startDate).lte('audit_date', endDate);
    }

    if (filters.departmentId) {
      // Handle multiple departments
      const departmentIds = filters.departmentId.split(',');
      query = query.in('department_id', departmentIds);
    }

    if (filters.status) {
      // Handle multiple statuses
      const statuses = filters.status.split(',');
      query = query.in('status', statuses);
    }

    if (filters.dateRange?.from) {
      query = query.gte('audit_date', filters.dateRange.from.toISOString().split('T')[0]);
    }

    if (filters.dateRange?.to) {
      query = query.lte('audit_date', filters.dateRange.to.toISOString().split('T')[0]);
    }

    if (filters.searchTerm) {
      query = query.ilike('title', `%${filters.searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching audit reports:', error);
      throw new Error('Error fetching audit reports');
    }

    // Type assertion to satisfy TypeScript
    return data as unknown as AuditReport[];
  };

  // Query to fetch all audit reports
  const auditReportsQuery = useQuery({
    queryKey: ['auditReports', filters],
    queryFn: fetchAuditReports,
  });

  return {
    auditReports: auditReportsQuery.data || [],
    isLoading: auditReportsQuery.isLoading,
    isError: auditReportsQuery.isError,
    createAuditReport,
    deleteAuditReport,
    filters,
    setFilters,
    getYearsFromReports,
    isUploading,
  };
};
