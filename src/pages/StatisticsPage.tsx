
import { useState } from "react";
import Layout from "@/components/app/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNonConformances } from "@/hooks/useNonConformances";
import { generateDepartmentData, generateStatusData, generateMonthlyData } from "@/components/reports/DataUtils";
import { OverviewTab } from "@/components/statistics/OverviewTab";
import { TrendsTab } from "@/components/statistics/TrendsTab";
import { ComparisonTab } from "@/components/statistics/ComparisonTab";
import { StatisticsHeader } from "@/components/statistics/StatisticsHeader";
import { generateTrendData } from "@/components/statistics/StatisticsDataUtils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const StatisticsPage = () => {
  const { nonConformances, isLoading, refetch } = useNonConformances();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Filter data based on selected year
  const filteredNonConformances = nonConformances.filter(nc => {
    const occurrenceYear = new Date(nc.occurrence_date).getFullYear().toString();
    return occurrenceYear === selectedYear;
  });

  // Generate data for charts using filtered data
  const departmentStats = filteredNonConformances.length > 0 
    ? generateDepartmentData(filteredNonConformances)
    : [];

  const statusStats = filteredNonConformances.length > 0 
    ? generateStatusData(filteredNonConformances)
    : [];

  const monthlyStats = filteredNonConformances.length > 0 
    ? generateMonthlyData(filteredNonConformances)
    : [];
    
  const trendData = filteredNonConformances.length > 0 
    ? generateTrendData(filteredNonConformances)
    : [];

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };

  // Generate available years from data
  const getAvailableYears = () => {
    if (!nonConformances.length) return [new Date().getFullYear().toString()];
    
    const years = nonConformances.map(nc => 
      new Date(nc.occurrence_date).getFullYear().toString()
    );
    
    // Get unique years and sort them
    const uniqueYears = [...new Set(years)].sort((a, b) => b.localeCompare(a));
    
    if (uniqueYears.length === 0) {
      return [new Date().getFullYear().toString()];
    }
    
    return uniqueYears;
  };

  const availableYears = getAvailableYears();

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Estatísticas de Não Conformidades</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Ano:</span>
                <Select value={selectedYear} onValueChange={handleYearChange}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder={selectedYear} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={() => refetch()}>
                Atualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Filtrando dados por {selectedYear}. {filteredNonConformances.length} não conformidades encontradas.
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="trends">Tendências</TabsTrigger>
            <TabsTrigger value="comparison">Comparativo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTab 
              isLoading={isLoading}
              hasData={filteredNonConformances.length > 0}
              departmentStats={departmentStats}
              statusStats={statusStats}
              monthlyStats={monthlyStats}
            />
          </TabsContent>
          
          <TabsContent value="trends">
            <TrendsTab trendData={trendData} />
          </TabsContent>
          
          <TabsContent value="comparison">
            <ComparisonTab 
              hasData={filteredNonConformances.length > 0}
              comparisonData={[]} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StatisticsPage;
