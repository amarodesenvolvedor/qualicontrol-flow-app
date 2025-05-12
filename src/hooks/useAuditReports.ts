
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AuditReport, AuditReportInput, AuditFilter } from '@/types/audit';
import type { Department } from '@/hooks/useDepartments';

export const useAuditReports = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<AuditFilter>({});

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

  // Function to upload a file to Supabase Storage
  const uploadAuditFile = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `audits/${fileName}`;

    const { error } = await supabase.storage.from('audit_files').upload(filePath, file);

    if (error) {
      console.error('Error uploading file:', error);
      throw new Error('Error uploading file');
    }

    return filePath;
  };

  // Mutation to create a new audit report
  const createAuditReport = useMutation({
    mutationFn: async ({ data, file }: { data: AuditReportInput, file: File }) => {
      try {
        // Upload the file first
        const filePath = await uploadAuditFile(file);

        // Create the audit report
        const { error } = await supabase.from('audit_reports').insert({
          ...data,
          file_path: filePath,
        });

        if (error) throw error;

        return { success: true };
      } catch (error) {
        console.error('Error creating audit report:', error);
        throw new Error('Error creating audit report');
      }
    },
    onSuccess: () => {
      toast({
        title: 'Relatório de auditoria criado',
        description: 'O relatório de auditoria foi criado com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['auditReports'] });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: `Erro ao criar relatório de auditoria: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Mutation to delete an audit report
  const deleteAuditReport = useMutation({
    mutationFn: async (id: string) => {
      // Get the file path first
      const { data: report } = await supabase
        .from('audit_reports')
        .select('file_path')
        .eq('id', id)
        .single();

      if (report?.file_path) {
        // Delete the file from storage
        await supabase.storage.from('audit_files').remove([report.file_path]);
      }

      // Delete the report record
      const { error } = await supabase.from('audit_reports').delete().eq('id', id);

      if (error) throw error;

      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: 'Relatório de auditoria excluído',
        description: 'O relatório de auditoria foi excluído com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['auditReports'] });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir relatório de auditoria.',
        variant: 'destructive',
      });
    },
  });

  // Function to get years from audit reports
  const getYearsFromReports = (reports: AuditReport[]): string[] => {
    const years = new Set<string>();
    
    reports.forEach(report => {
      const year = new Date(report.audit_date).getFullYear().toString();
      years.add(year);
    });

    return Array.from(years).sort().reverse();
  };

  return {
    auditReports: auditReportsQuery.data || [],
    isLoading: auditReportsQuery.isLoading,
    isError: auditReportsQuery.isError,
    createAuditReport,
    deleteAuditReport,
    filters,
    setFilters,
    getYearsFromReports,
  };
};
