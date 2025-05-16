
import { NonConformance, NonConformanceCreateData, NonConformanceUpdateData, NonConformanceFilter } from '@/types/nonConformance';
import { useNonConformanceQueries } from './useNonConformanceQueries';
import { useNonConformanceMutations } from './useNonConformanceMutations';
import { fetchNonConformances } from '@/services/nonConformance';

export const useNonConformances = () => {
  const { 
    nonConformances, 
    isLoading, 
    error, 
    refetch,
    filters,
    setFilters,
    fetchNonConformanceById,
    responsibleNames
  } = useNonConformanceQueries();

  const {
    createNonConformance,
    updateNonConformance,
    deleteNonConformance,
    uploadFiles
  } = useNonConformanceMutations();

  return {
    nonConformances,
    isLoading,
    error,
    refetch,
    createNonConformance,
    updateNonConformance,
    deleteNonConformance,
    uploadFiles,
    filters,
    setFilters,
    fetchNonConformanceById,
    responsibleNames
  };
};

// Reexport types for backward compatibility
export type { NonConformance, NonConformanceCreateData, NonConformanceUpdateData, NonConformanceFilter };
