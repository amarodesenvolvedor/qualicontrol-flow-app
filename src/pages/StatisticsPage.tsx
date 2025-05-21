
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatisticsHeader } from "@/components/statistics/StatisticsHeader";
import { OverviewTab } from "@/components/statistics/OverviewTab";
import { TrendsTab } from "@/components/statistics/TrendsTab";
import { ComparisonTab } from "@/components/statistics/ComparisonTab";
import { ISORequirementsTab } from "@/components/statistics/ISORequirementsTab";
import { useNonConformances } from "@/hooks/useNonConformances";

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
    <>
      <StatisticsHeader
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <div className="mt-8">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="trends">Tendências</TabsTrigger>
            <TabsTrigger value="comparison">Comparação</TabsTrigger>
            <TabsTrigger value="iso-requirements">Requisitos ISO</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <OverviewTab selectedYear={selectedYear} />
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <TrendsTab selectedYear={selectedYear} />
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <ComparisonTab selectedYear={selectedYear} />
          </TabsContent>
          
          <TabsContent value="iso-requirements" className="space-y-4">
            <ISORequirementsTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default StatisticsPage;
