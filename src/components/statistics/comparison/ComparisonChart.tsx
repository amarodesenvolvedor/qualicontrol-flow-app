
import { InteractiveChart } from "@/components/reports/InteractiveChart";
import { DataItem } from "@/components/charts/types";

interface ComparisonChartProps {
  data: DataItem[];
  isLoading: boolean;
  year1: string;
  year2: string;
}

export const ComparisonChart = ({ 
  data, 
  isLoading, 
  year1, 
  year2 
}: ComparisonChartProps) => {
  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-[400px] text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
        {isLoading ? "Processando dados..." : "Selecione os anos e clique em comparar para visualizar dados"}
      </div>
    );
  }

  return (
    <div className="h-[400px]">
      <InteractiveChart
        title={`Comparação de Não Conformidades: ${year1} vs ${year2}`}
        description="Comparativo por departamento"
        data={data}
        type="bar"
        height={400}
      />
    </div>
  );
};
