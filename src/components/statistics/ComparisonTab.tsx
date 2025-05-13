
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataItem } from "@/components/charts/types";
import { useDepartments } from "@/hooks/useDepartments";
import { useNonConformances } from "@/hooks/useNonConformances";
import { ComparisonFilters } from "./comparison/ComparisonFilters";
import { ComparisonChart } from "./comparison/ComparisonChart";
import { extractAvailableYears, generateComparisonData } from "./comparison/ComparisonDataUtil";

interface ComparisonTabProps {
  hasData: boolean;
  comparisonData: DataItem[];
}

export const ComparisonTab = ({ hasData }: ComparisonTabProps) => {
  const [year1, setYear1] = useState<string>("");
  const [year2, setYear2] = useState<string>("");
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<DataItem[]>([]);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  
  const { departments } = useDepartments();
  const { nonConformances } = useNonConformances();
  
  // Extrair anos dos dados de não conformidade
  useEffect(() => {
    const yearsList = extractAvailableYears(nonConformances);
    setAvailableYears(yearsList);
    
    if (yearsList.length > 0) {
      setYear1(yearsList[0]);
      setYear2(yearsList.length > 1 ? yearsList[1] : yearsList[0]);
    }
  }, [nonConformances]);

  // Função para gerar dados de comparação com base nos filtros selecionados
  const handleCompare = () => {
    setIsComparing(true);
    
    const chartData = generateComparisonData(
      nonConformances, 
      departments, 
      year1, 
      year2, 
      selectedDepartments
    );
    
    setComparisonData(chartData);
    setIsComparing(false);
  };
  
  return (
    <div className="grid gap-6">
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Comparativo Entre Períodos</CardTitle>
          <CardDescription>Análise comparativa de não conformidades</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ComparisonFilters 
            availableYears={availableYears}
            year1={year1}
            year2={year2}
            selectedDepartments={selectedDepartments}
            departments={departments}
            isComparing={isComparing}
            onYear1Change={setYear1}
            onYear2Change={setYear2}
            onDepartmentChange={setSelectedDepartments}
            onCompare={handleCompare}
          />
          
          <ComparisonChart 
            data={comparisonData}
            isLoading={isComparing}
            year1={year1}
            year2={year2}
          />
        </CardContent>
      </Card>
    </div>
  );
};
