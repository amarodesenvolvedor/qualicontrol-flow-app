
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
        console.log('Iniciando criação de relatório de auditoria');
        
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('O arquivo é muito grande. O tamanho máximo é de 10MB.');
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error('Tipo de arquivo não suportado. Formatos aceitos: PDF, JPEG, PNG, DOCX');
        }

        console.log('Informações do arquivo:', file.name, 'Tamanho:', file.size, 'Tipo:', file.type);

        // Upload the file with sanitized filename
        // We've simplified this by removing the bucket check, as the upload function will give a clear error
        try {
          const { filePath, originalFilename } = await uploadAuditFile(file);
          console.log('Upload com sucesso. Caminho:', filePath);

          // Update the file_name to store the original name for display
          const auditData = {
            ...data,
            file_path: filePath,
            file_name: originalFilename, // Keep original filename for display
            file_size: file.size,
            file_type: file.type
          };

          console.log('Criando registro na tabela audit_reports com dados:', auditData);

          // Create the audit report
          const { data: insertedData, error } = await supabase
            .from('audit_reports')
            .insert(auditData)
            .select();

          if (error) {
            console.error('Erro na inserção do relatório:', error);
            throw new Error(`Erro no banco de dados: ${error.message}`);
          }

          console.log('Relatório criado com sucesso:', insertedData);
          return { success: true };
        } catch (uploadError: any) {
          console.error('Erro no upload:', uploadError);
          throw new Error(`Falha no upload: ${uploadError.message}`);
        }
      } catch (error: any) {
        console.error('Erro na criação do relatório:', error);
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
          console.error('Erro ao buscar relatório para exclusão:', fetchError);
          throw fetchError;
        }

        if (report?.file_path) {
          // Delete the file from storage
          const { error: storageError } = await supabase.storage
            .from('audit_files')
            .remove([report.file_path]);
            
          if (storageError) {
            console.error('Erro ao excluir arquivo do storage:', storageError);
            // Continue with deletion even if file removal fails
          }
        }

        // Delete the report record
        const { error } = await supabase
          .from('audit_reports')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Erro ao excluir relatório de auditoria:', error);
          throw error;
        }

        return { success: true };
      } catch (error: any) {
        console.error('Erro em deleteAuditReport:', error);
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
