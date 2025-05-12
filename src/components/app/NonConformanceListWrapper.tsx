
import { useNonConformances } from "@/hooks/useNonConformances";
import NonConformanceList from "./NonConformanceList";
import NonConformanceFilters from "./NonConformanceFilters";

const NonConformanceListWrapper = () => {
  const { 
    nonConformances, 
    isLoading, 
    refetch, 
    deleteNonConformance,
    filters,
    setFilters
  } = useNonConformances();
  
  const handleDeleteNonConformance = async (id: string) => {
    await deleteNonConformance.mutateAsync(id);
  };
  
  return (
    <div className="space-y-6">
      <NonConformanceFilters 
        filters={filters}
        onFilterChange={setFilters}
      />
      <NonConformanceList 
        nonConformances={nonConformances} 
        isLoading={isLoading} 
        refetch={refetch}
        deleteNonConformance={handleDeleteNonConformance}
      />
    </div>
  );
};

export default NonConformanceListWrapper;
