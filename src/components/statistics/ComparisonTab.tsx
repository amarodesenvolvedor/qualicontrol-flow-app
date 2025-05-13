
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InteractiveChart } from "@/components/reports/InteractiveChart";
import { DataItem } from "@/components/charts/types";
import { MultiSelectFilter } from "@/components/shared/AdvancedFilters";
import { useDepartments } from "@/hooks/useDepartments";
import { useNonConformances } from "@/hooks/useNonConformances";
import { ScrollArea } from "@/components/ui/scroll-area";
import { COLORS } from "@/components/dashboard/utils/dashboardConstants";

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
    if (nonConformances.length > 0) {
      const years = new Set<string>();
      
      nonConformances.forEach(nc => {
        const year = new Date(nc.occurrence_date).getFullYear().toString();
        years.add(year);
      });
      
      const yearsList = Array.from(years).sort().reverse();
      setAvailableYears(yearsList);
      
      if (yearsList.length > 0) {
        setYear1(yearsList[0]);
        setYear2(yearsList.length > 1 ? yearsList[1] : yearsList[0]);
      }
    }
  }, [nonConformances]);

  // Função para gerar dados de comparação com base nos filtros selecionados
  const generateComparisonData = () => {
    setIsComparing(true);
    
    // Filtrar não conformidades por anos selecionados
    const year1Data = nonConformances.filter(nc => {
      const ncYear = new Date(nc.occurrence_date).getFullYear().toString();
      return ncYear === year1;
    });
    
    const year2Data = nonConformances.filter(nc => {
      const ncYear = new Date(nc.occurrence_date).getFullYear().toString();
      return ncYear === year2;
    });
    
    // Filtrar por departamentos selecionados, se houver
    const filteredYear1Data = selectedDepartments.length > 0 
      ? year1Data.filter(nc => selectedDepartments.includes(nc.department_id))
      : year1Data;
      
    const filteredYear2Data = selectedDepartments.length > 0 
      ? year2Data.filter(nc => selectedDepartments.includes(nc.department_id))
      : year2Data;
    
    // Agrupar por departamento
    const departmentCounts1: Record<string, number> = {};
    const departmentCounts2: Record<string, number> = {};
    const departmentIds: Record<string, string[]> = {};
    const departmentDescriptions: Record<string, string[]> = {};
    
    // Inicializar contagens
    departments.forEach(dept => {
      departmentCounts1[dept.name] = 0;
      departmentCounts2[dept.name] = 0;
      departmentIds[dept.name] = [];
      departmentDescriptions[dept.name] = [];
    });
    
    // Contar não conformidades por departamento para o ano 1
    filteredYear1Data.forEach(nc => {
      const deptName = departments.find(d => d.id === nc.department_id)?.name || "Não especificado";
      departmentCounts1[deptName] = (departmentCounts1[deptName] || 0) + 1;
      
      if (!departmentIds[deptName]) {
        departmentIds[deptName] = [];
        departmentDescriptions[deptName] = [];
      }
      
      departmentIds[deptName].push(nc.id);
      departmentDescriptions[deptName].push(nc.title);
    });
    
    // Contar não conformidades por departamento para o ano 2
    filteredYear2Data.forEach(nc => {
      const deptName = departments.find(d => d.id === nc.department_id)?.name || "Não especificado";
      departmentCounts2[deptName] = (departmentCounts2[deptName] || 0) + 1;
      
      if (!departmentIds[deptName]) {
        departmentIds[deptName] = [];
        departmentDescriptions[deptName] = [];
      }
      
      departmentIds[deptName].push(nc.id);
      departmentDescriptions[deptName].push(nc.title);
    });
    
    // Formatar dados para o gráfico
    const chartData = Object.keys(departmentCounts1)
      .filter(deptName => departmentCounts1[deptName] > 0 || departmentCounts2[deptName] > 0)
      .map((deptName, index) => ({
        name: deptName,
        value: departmentCounts1[deptName],
        [year1]: departmentCounts1[deptName],
        [year2]: departmentCounts2[deptName],
        id: departmentIds[deptName],
        descriptions: departmentDescriptions[deptName],
        color: COLORS.primary // Cor padrão para o item
      }));
    
    setComparisonData(chartData);
    setIsComparing(false);
  };
  
  const handleDepartmentChange = (values: string[]) => {
    setSelectedDepartments(values);
  };
  
  return (
    <div className="grid gap-6">
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Comparativo Entre Períodos</CardTitle>
          <CardDescription>Análise comparativa de não conformidades</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium block mb-2">Ano 1</label>
              <Select value={year1} onValueChange={setYear1}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-40">
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Ano 2</label>
              <Select value={year2} onValueChange={setYear2}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-40">
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Departamentos</label>
              <MultiSelectFilter
                label="Selecionar departamentos"
                options={departments.map(dept => ({ value: dept.id || "", label: dept.name }))}
                selectedValues={selectedDepartments}
                onChange={handleDepartmentChange}
              />
            </div>
            <div className="lg:col-span-3 flex justify-end">
              <Button onClick={generateComparisonData} disabled={!year1 || !year2 || isComparing} className="bg-primary hover:bg-primary/90">
                {isComparing ? "Processando..." : "Comparar"}
              </Button>
            </div>
          </div>
          
          {comparisonData.length > 0 ? (
            <div className="h-[400px]">
              <InteractiveChart
                title={`Comparação de Não Conformidades: ${year1} vs ${year2}`}
                description="Comparativo por departamento"
                data={comparisonData}
                type="bar"
                height={400}
              />
            </div>
          ) : (
            <div className="flex justify-center items-center h-[400px] text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
              {isComparing ? "Processando dados..." : "Selecione os anos e clique em comparar para visualizar dados"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
