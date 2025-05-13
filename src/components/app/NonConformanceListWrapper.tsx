
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
    try {
      await deleteNonConformance.mutateAsync(id);
      return Promise.resolve();
    } catch (error) {
      console.error("Error in delete handler:", error);
      return Promise.reject(error);
    }
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
