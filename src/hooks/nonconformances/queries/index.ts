
import { useState } from 'react';
import { useNonConformanceList } from './useNonConformanceList';
import { useNonConformanceDetails } from './useNonConformanceDetails';
import { useResponsibleNames } from './useResponsibleNames';
import { NonConformanceFilter } from '@/types/nonConformance';

export const useQueries = () => {
  const [filters, setFilters] = useState<NonConformanceFilter>({});
  
  const { 
    data: nonConformances = [], 
    isLoading, 
    error, 
    refetch 
  } = useNonConformanceList(filters);
  
  const { fetchNonConformanceById } = useNonConformanceDetails();
  const { data: responsibleNames = [] } = useResponsibleNames();

  return {
    nonConformances,
    isLoading,
    error,
    refetch,
    filters,
    setFilters,
    fetchNonConformanceById,
    responsibleNames
  };
};

export * from './useNonConformanceList';
export * from './useNonConformanceDetails';
export * from './useResponsibleNames';
