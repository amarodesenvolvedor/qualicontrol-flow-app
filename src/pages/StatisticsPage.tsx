
import { useState } from "react";
import Layout from "@/components/app/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNonConformances } from "@/hooks/useNonConformances";
import { generateDepartmentData, generateStatusData, generateMonthlyData } from "@/components/reports/DataUtils";
import { OverviewTab } from "@/components/statistics/OverviewTab";
import { TrendsTab } from "@/components/statistics/TrendsTab";
import { ComparisonTab } from "@/components/statistics/ComparisonTab";
import { StatisticsHeader } from "@/components/statistics/StatisticsHeader";
import { generateTrendData, generateComparisonData } from "@/components/statistics/StatisticsDataUtils";

const StatisticsPage = () => {
  const { nonConformances, isLoading, refetch } = useNonConformances();
  const [selectedYear, setSelectedYear] = useState("2025");

  // Gerar dados para os gráficos usando os dados reais
  const departmentStats = nonConformances.length > 0 
    ? generateDepartmentData(nonConformances)
    : [];

  const statusStats = nonConformances.length > 0 
    ? generateStatusData(nonConformances)
    : [];

  const monthlyStats = nonConformances.length > 0 
    ? generateMonthlyData(nonConformances)
    : [];
    
  const trendData = nonConformances.length > 0 
    ? generateTrendData(nonConformances)
    : [];
  
  const comparisonData = generateComparisonData();

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    // Em um aplicativo real, buscaríamos dados para o ano selecionado
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <StatisticsHeader 
          selectedYear={selectedYear} 
          onYearChange={handleYearChange} 
          onRefresh={refetch} 
        />
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="trends">Tendências</TabsTrigger>
            <TabsTrigger value="comparison">Comparativo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTab 
              isLoading={isLoading}
              hasData={nonConformances.length > 0}
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
              hasData={nonConformances.length > 0}
              comparisonData={comparisonData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StatisticsPage;
