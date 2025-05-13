
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AuditReportInput } from '@/types/audit';
import { useAuditFileUpload } from './useAuditFileUpload';

export const useAuditReportsCrud = () => {
  const queryClient = useQueryClient();
  const { uploadAuditFile, isUploading } = useAuditFileUpload();

  // Mutation to create a new audit report
  const createAuditReport = useMutation({
    mutationFn: async ({ data, file }: { data: AuditReportInput, file: File }) => {
      try {
        // Upload the file first with sanitized filename
        const { filePath, originalFilename } = await uploadAuditFile(file);

        // Update the file_name to store the original name for display
        const auditData = {
          ...data,
          file_path: filePath,
          file_name: originalFilename, // Keep original filename for display
        };

        // Create the audit report
        const { error } = await supabase.from('audit_reports').insert(auditData);

        if (error) throw error;

        return { success: true };
      } catch (error: any) {
        console.error('Error creating audit report:', error);
        throw new Error(`Error creating audit report: ${error.message}`);
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

  return {
    createAuditReport,
    deleteAuditReport,
    isUploading,
  };
};
