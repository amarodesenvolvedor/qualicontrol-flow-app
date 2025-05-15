
import { supabase } from '@/integrations/supabase/client';

// Upload files to Supabase storage
export const uploadFilesToStorage = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(async (file) => {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `evidences/${fileName}`;

    const { error } = await supabase.storage
      .from('non_conformance_files')
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    return filePath;
  });

  return Promise.all(uploadPromises);
};
