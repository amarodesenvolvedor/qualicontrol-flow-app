
import { NonConformance } from "@/hooks/useNonConformances";
import { DataItem } from "@/components/charts/types";

export const generateTrendData = (nonConformances: NonConformance[]): DataItem[] => {
  // Agrupar por mês e por status
  const monthStatusMap = new Map();
  
  nonConformances.forEach(nc => {
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
    statusCount[nc.status] = (statusCount[nc.status] || 0) + 1;
  });
  
  const result = Array.from(monthStatusMap.entries()).map(([month, counts]) => {
    // Create a DataItem compatible object
    return {
      name: month,
      value: Object.values(counts).reduce((acc: number, curr: number) => acc + curr, 0),
      "Pendentes": counts.pending || 0,
      "Em Andamento": counts['in-progress'] || 0,
      "Resolvidas": (counts.resolved || 0) + (counts.closed || 0)
    };
  });

  return result;
};

export const generateComparisonData = (): DataItem[] => {
  return [
    { name: "Produção", value: 25, "2025-1": 25, "2024-2": 18 },
    { name: "Qualidade", value: 14, "2025-1": 14, "2024-2": 12 },
    { name: "Logística", value: 9, "2025-1": 9, "2024-2": 11 },
    { name: "Manutenção", value: 16, "2025-1": 16, "2024-2": 15 }
  ];
};
