
// Since we can't modify this file directly as it's in read-only files list,
// we'll create a wrapper component to handle the correct query access

import { useNonConformances } from "@/hooks/useNonConformances";

const NonConformanceListWrapper = () => {
  const { nonConformances, isLoading, refetch } = useNonConformances();
  
  // Pass the correct props to the original NonConformanceList component
  return (
    <div>
      <NonConformanceList 
        nonConformances={nonConformances} 
        isLoading={isLoading} 
        refetch={refetch}
      />
    </div>
  );
};

export default NonConformanceListWrapper;
