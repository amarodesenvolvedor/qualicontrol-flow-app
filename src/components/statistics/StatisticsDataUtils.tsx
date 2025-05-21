
import { NonConformance } from "@/types/nonConformance";
import { DataItem } from "@/components/charts/types";
import { FC } from "react";

export const generateTrendData = (nonConformances: NonConformance[]): DataItem[] => {
  // Ensure nonConformances is an array
  if (!Array.isArray(nonConformances)) {
    console.warn("generateTrendData received non-array input:", nonConformances);
    return [];
  }
  
  // Agrupar por mês e por status
  const monthStatusMap = new Map();
  
  nonConformances.forEach(nc => {
    if (!nc || !nc.occurrence_date) return;
    
    const date = new Date(nc.occurrence_date);
    const month = date.toLocaleString('pt-BR', { month: 'short' });
    
    if (!monthStatusMap.has(month)) {
      monthStatusMap.set(month, {
        pending: 0,
        'in-progress': 0,
        resolved: 0,
        closed: 0
      });
    }
    
    const statusCount = monthStatusMap.get(month);
    if (nc.status) {
      statusCount[nc.status] = (statusCount[nc.status] || 0) + 1;
    }
  });
  
  // Convert to DataItem format with proper types
  return Array.from(monthStatusMap.entries()).map(([month, counts]: [string, any]) => {
    return {
      name: month,
      value: Object.values(counts).reduce((acc: number, curr: number) => acc + curr, 0),
      "Pendentes": counts.pending || 0,
      "Em Andamento": counts['in-progress'] || 0,
      "Resolvidas": (counts.resolved || 0) + (counts.closed || 0)
    } as DataItem;
  });
};

// Create a StatisticsDataUtils component that we can import in ISORequirementsTab
interface StatisticsDataUtilsProps {
  data: NonConformance[];
}

export const StatisticsDataUtils: FC<StatisticsDataUtilsProps> = ({ data }) => {
  // Simple component that can be used to display statistics data
  // Currently doesn't render anything, but could be extended to show additional data analysis
  return null;
};
