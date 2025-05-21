
import { FC, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNonConformances } from "@/hooks/useNonConformances";
import { useDepartments } from "@/hooks/useDepartments";
import { ComparisonChart } from "@/components/statistics/comparison/ComparisonChart";
import { ComparisonFilters } from "@/components/statistics/comparison/ComparisonFilters";
import { generateComparisonData } from "@/components/statistics/comparison/ComparisonDataUtil";

export interface ComparisonTabProps {
  selectedYear: string;
}

export const ComparisonTab: FC<ComparisonTabProps> = ({ selectedYear }) => {
  const { nonConformances, isLoading } = useNonConformances();
  const { departments } = useDepartments();
  
  const [year1, setYear1] = useState(selectedYear);
  const [year2, setYear2] = useState((parseInt(selectedYear) - 1).toString());
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  useEffect(() => {
    if (!nonConformances?.length) return;

    // Calculate available years from data
    const yearsSet = new Set<string>();
    nonConformances.forEach(nc => {
      const year = new Date(nc.occurrence_date).getFullYear().toString();
      yearsSet.add(year);
    });
    
    // Sort years descending
    const years = Array.from(yearsSet).sort((a, b) => parseInt(b) - parseInt(a));
    setAvailableYears(years);

    // Default to current year and previous year
    if (years.length >= 1) setYear1(years[0]);
    if (years.length >= 2) setYear2(years[1]);
  }, [nonConformances]);

  const handleCompare = () => {
    if (!nonConformances?.length) return;
    setIsComparing(true);
    
    try {
      // Use the utility function to generate comparison data
      const processedData = generateComparisonData(
        nonConformances,
        departments,
        year1,
        year2,
        selectedDepartments
      );
      
      setComparisonData(processedData);
    } catch (error) {
      console.error("Error processing comparison data:", error);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Comparação</h2>
      
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
        isLoading={isLoading || isComparing}
        year1={year1}
        year2={year2}
      />
      
      {comparisonData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Análise Comparativa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Comparação entre {year1} e {year2}:</p>
              {comparisonData.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  Sem dados para comparação nos anos selecionados.
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
