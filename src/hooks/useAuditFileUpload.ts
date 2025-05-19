
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createSafeStorageFilename } from '@/utils/fileUtils';
import { toast } from '@/hooks/use-toast';

export const useAuditFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Function to upload a file to Supabase Storage
  const uploadAuditFile = async (file: File): Promise<{filePath: string, originalFilename: string}> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('O arquivo é muito grande. O tamanho máximo é de 10MB.');
      }
      
      // Create a safe filename for storage
      const { safeFilename, originalFilename } = createSafeStorageFilename(file.name);
      const filePath = `audits/${safeFilename}`;

      console.log('Tentando fazer upload do arquivo:', safeFilename, 'para o bucket audit_files');
      
      // Upload directly to the bucket without prior checks
      const { error } = await supabase.storage
        .from('audit_files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Erro detalhado no upload:', error);
        
        if (error.message.includes('bucket') || error.message.includes('404')) {
          throw new Error('O bucket de arquivos de auditoria não está acessível. Entre em contato com o administrador.');
        }
        
        if (error.message.includes('permission') || error.message.includes('403')) {
          throw new Error('Sem permissão para enviar arquivos. Verifique se você está autenticado.');
        }
        
        throw new Error(`Erro no upload: ${error.message}`);
      }

      // Simulate progress since we can't track it directly
      setUploadProgress(100);
      
      return { filePath, originalFilename };
    } catch (error: any) {
      console.error('Exceção durante upload de arquivo:', error);
      throw new Error(`Upload falhou: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadAuditFile,
    isUploading,
    uploadProgress
  };
};
