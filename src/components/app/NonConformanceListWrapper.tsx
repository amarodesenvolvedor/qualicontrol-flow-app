
import { useNonConformances } from "@/hooks/useNonConformances";
import NonConformanceList from "./NonConformanceList";
import NonConformanceFilters from "./NonConformanceFilters";
import { NotificationWrapper } from "./NotificationWrapper";
import { Toaster } from "sonner";

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
    <>
      <NotificationWrapper>
        <Toaster position="top-right" />
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
      </NotificationWrapper>
    </>
  );
};

export default NonConformanceListWrapper;
