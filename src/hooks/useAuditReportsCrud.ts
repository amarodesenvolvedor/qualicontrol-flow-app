
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AuditReportInput } from '@/types/audit';
import { useAuditFileUpload } from './useAuditFileUpload';

export const useAuditReportsCrud = () => {
  const queryClient = useQueryClient();
  const { uploadAuditFile, isUploading, uploadProgress } = useAuditFileUpload();

  // Mutation to create a new audit report
  const createAuditReport = useMutation({
    mutationFn: async ({ data, file }: { data: AuditReportInput, file: File }) => {
      try {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('O arquivo é muito grande. O tamanho máximo é de 10MB.');
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error('Tipo de arquivo não suportado. Formatos aceitos: PDF, JPEG, PNG, DOCX');
        }

        console.log('Starting upload for file:', file.name, 'Size:', file.size, 'Type:', file.type);

        // First check if the bucket exists
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        
        if (bucketError) {
          console.error('Error checking for buckets:', bucketError);
          throw new Error(`Erro ao verificar sistema de armazenamento: ${bucketError.message}`);
        }
        
        const auditBucket = buckets.find(b => b.name === 'audit_files');
        if (!auditBucket) {
          console.error('Audit files bucket not found');
          throw new Error('O bucket de arquivos de auditoria não foi encontrado. Entre em contato com o administrador.');
        }

        // Upload the file with sanitized filename
        const { filePath, originalFilename } = await uploadAuditFile(file);
        
        console.log('File uploaded successfully. Path:', filePath, 'Original name:', originalFilename);

        // Update the file_name to store the original name for display
        const auditData = {
          ...data,
          file_path: filePath,
          file_name: originalFilename, // Keep original filename for display
        };

        console.log('Creating audit report with data:', auditData);

        // Create the audit report
        const { data: insertedData, error } = await supabase
          .from('audit_reports')
          .insert(auditData)
          .select();

        if (error) {
          console.error('Error inserting audit report:', error);
          throw error;
        }

        console.log('Audit report created successfully:', insertedData);
        return { success: true };
      } catch (error: any) {
        console.error('Error creating audit report:', error);
        throw new Error(`Erro ao criar relatório: ${error.message}`);
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
      try {
        // Get the file path first
        const { data: report, error: fetchError } = await supabase
          .from('audit_reports')
          .select('file_path')
          .eq('id', id)
          .single();
          
        if (fetchError) {
          console.error('Error fetching audit report for deletion:', fetchError);
          throw fetchError;
        }

        if (report?.file_path) {
          // Delete the file from storage
          const { error: storageError } = await supabase.storage
            .from('audit_files')
            .remove([report.file_path]);
            
          if (storageError) {
            console.error('Error deleting file from storage:', storageError);
            // Continue with deletion even if file removal fails
          }
        }

        // Delete the report record
        const { error } = await supabase
          .from('audit_reports')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting audit report:', error);
          throw error;
        }

        return { success: true };
      } catch (error: any) {
        console.error('Error in deleteAuditReport:', error);
        throw new Error(`Erro ao excluir: ${error.message}`);
      }
    },
    onSuccess: () => {
      toast({
        title: 'Relatório de auditoria excluído',
        description: 'O relatório de auditoria foi excluído com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['auditReports'] });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: `Erro ao excluir relatório de auditoria: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    createAuditReport,
    deleteAuditReport,
    isUploading,
    uploadProgress
  };
};
