
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createSafeStorageFilename } from '@/utils/fileUtils';
import { toast } from '@/hooks/use-toast';

export const useAuditFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  // Function to upload a file to Supabase Storage
  const uploadAuditFile = async (file: File): Promise<{filePath: string, originalFilename: string}> => {
    setIsUploading(true);
    
    try {
      // Create a safe filename for storage
      const { safeFilename, originalFilename } = createSafeStorageFilename(file.name);
      const filePath = `audits/${safeFilename}`;

      console.log('Uploading file with sanitized name:', safeFilename);
      
      const { error } = await supabase.storage.from('audit_files').upload(filePath, file);

      if (error) {
        console.error('Error uploading file:', error);
        toast({
          title: 'Erro no upload',
          description: `Erro ao fazer upload do arquivo: ${error.message}`,
          variant: 'destructive',
        });
        throw new Error(`Error uploading file: ${error.message}`);
      }

      return { filePath, originalFilename };
    } catch (error: any) {
      console.error('Exception during file upload:', error);
      throw new Error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadAuditFile,
    isUploading
  };
};
