
import { useNonConformances } from "@/hooks/useNonConformances";
import NonConformanceList from "./NonConformanceList";

const NonConformanceListWrapper = () => {
  const { nonConformances, isLoading, refetch } = useNonConformances();
  
  return (
    <div className="space-y-6">
      <NonConformanceList 
        nonConformances={nonConformances} 
        isLoading={isLoading} 
        refetch={refetch}
      />
    </div>
  );
};

export default NonConformanceListWrapper;
