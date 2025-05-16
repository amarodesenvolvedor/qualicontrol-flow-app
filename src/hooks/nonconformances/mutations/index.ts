
import { useCreateNonConformance } from './createNonConformance';
import { useUpdateNonConformance } from './updateNonConformance';
import { useDeleteNonConformance } from './deleteNonConformance';
import { uploadFilesToStorage } from '@/services/nonConformance';

export const useMutations = () => {
  const createNonConformance = useCreateNonConformance();
  const updateNonConformance = useUpdateNonConformance();
  const deleteNonConformance = useDeleteNonConformance();

  return {
    createNonConformance,
    updateNonConformance,
    deleteNonConformance,
    uploadFiles: uploadFilesToStorage,
  };
};
