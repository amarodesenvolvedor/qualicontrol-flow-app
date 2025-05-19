
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

      console.log('Uploading file with sanitized name:', safeFilename);
      
      // Check if the bucket exists first
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        throw new Error(`Erro ao verificar buckets: ${bucketError.message}`);
      }
      
      const auditBucket = buckets.find(b => b.name === 'audit_files');
      if (!auditBucket) {
        throw new Error('O bucket de arquivos de auditoria não foi encontrado. Entre em contato com o administrador.');
      }
      
      // Upload with progress tracking
      const { error } = await supabase.storage
        .from('audit_files')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            if (progress.totalBytes > 0) {
              setUploadProgress(Math.round((progress.bytesUploaded / progress.totalBytes) * 100));
            }
          },
        });

      if (error) {
        console.error('Error uploading file:', error);
        throw error;
      }

      return { filePath, originalFilename };
    } catch (error: any) {
      console.error('Exception during file upload:', error);
      throw new Error(`Upload falhou: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadAuditFile,
    isUploading,
    uploadProgress
  };
};
