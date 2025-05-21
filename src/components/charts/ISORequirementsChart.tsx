
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange, GroupingType, filterDataByDateRange, processChartData } from "./ISORequirements/chartUtils";
import { ChartControls } from "./ISORequirements/ChartControls";
import { ChartComponent } from "./ISORequirements/ChartComponent";

interface ISORequirementsChartProps {
  data: any[];
  isLoading?: boolean;
  onExport?: (format: string) => void;
  height?: number;
}

export function ISORequirementsChart({ 
  data, 
  isLoading = false, 
  onExport,
  height = 400
}: ISORequirementsChartProps) {
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [groupingType, setGroupingType] = useState<GroupingType>("none");
  
  // Filter data by date range
  const filteredByDateData = useMemo(() => {
    return filterDataByDateRange(data, dateRange);
  }, [data, dateRange]);
  
  // Process data for chart
  const chartData = useMemo(() => {
    return processChartData(filteredByDateData, groupingType);
  }, [filteredByDateData, groupingType]);
  
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">
          Não Conformidades por Requisitos ISO 9001:2015
        </CardTitle>
        
        <ChartControls 
          dateRange={dateRange}
          setDateRange={setDateRange}
          groupingType={groupingType}
          setGroupingType={setGroupingType}
          onExport={onExport}
        />
      </CardHeader>
      
      <CardContent>
        <div className="text-center text-sm text-muted-foreground mb-4">
          Clique em um item no gráfico para ver detalhes
        </div>
        
        <ChartComponent 
          chartData={chartData} 
          groupingType={groupingType}
          height={height}
        />
      </CardContent>
    </Card>
  );
}
