
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatisticsHeader } from "@/components/statistics/StatisticsHeader";
import { OverviewTab } from "@/components/statistics/OverviewTab";
import { TrendsTab } from "@/components/statistics/TrendsTab";
import { ComparisonTab } from "@/components/statistics/ComparisonTab";
import { ISORequirementsTab } from "@/components/statistics/ISORequirementsTab";
import { useNonConformances } from "@/hooks/useNonConformances";
import Layout from "@/components/app/Layout";

const StatisticsPage = () => {
  const [selectedYear, setSelectedYear] = useState("2024");
  const { refetch, isLoading } = useNonConformances();

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Layout>
      <StatisticsHeader
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <div className="mt-8 container mx-auto">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full border-b flex overflow-x-auto pb-px">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="iso-requirements">Requisitos ISO</TabsTrigger>
            <TabsTrigger value="trends">Tendências</TabsTrigger>
            <TabsTrigger value="comparison">Comparação</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <OverviewTab selectedYear={selectedYear} />
          </TabsContent>
          
          <TabsContent value="iso-requirements" className="space-y-4">
            <ISORequirementsTab />
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <TrendsTab selectedYear={selectedYear} />
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <ComparisonTab selectedYear={selectedYear} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StatisticsPage;
