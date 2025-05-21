
import { useEffect, useState } from "react";
import { useNonConformances } from "@/hooks/useNonConformances";
import { NonConformance } from "@/types/nonConformance";
import { ISORequirementsChart } from "@/components/charts/ISORequirementsChart";
import { StatisticsDataUtils } from "@/components/statistics/StatisticsDataUtils";

export const ISORequirementsTab = () => {
  const { nonConformances, isLoading } = useNonConformances();
  const [filteredData, setFilteredData] = useState<NonConformance[]>([]);
  
  useEffect(() => {
    // Set filtered data when non-conformances are loaded
    if (nonConformances) {
      setFilteredData(nonConformances);
    }
  }, [nonConformances]);
  
  const handleExport = (format: string) => {
    console.log(`Exporting in ${format} format`);
    // Future integration with export service 
    // exportService.exportChart(filteredData, format);
  };
  
  return (
    <div className="space-y-4">
      <ISORequirementsChart 
        data={filteredData}
        isLoading={isLoading}
        onExport={handleExport}
        height={450}
      />
      
      <StatisticsDataUtils data={filteredData} />
    </div>
  );
};
