
import { useNonConformances } from "@/hooks/useNonConformances";
import NonConformanceList from "./NonConformanceList";

const NonConformanceListWrapper = () => {
  const { 
    nonConformances, 
    isLoading, 
    refetch, 
    deleteNonConformance 
  } = useNonConformances();
  
  const handleDeleteNonConformance = async (id: string) => {
    await deleteNonConformance.mutateAsync(id);
  };
  
  return (
    <div className="space-y-6">
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
