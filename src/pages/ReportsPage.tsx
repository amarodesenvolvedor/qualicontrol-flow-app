
import { useState } from "react";
import Layout from "@/components/app/Layout";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNonConformances } from "@/hooks/useNonConformances";
import { StandardReportsTab } from "@/components/reports/StandardReportsTab";
import { CustomReportTab } from "@/components/reports/CustomReportTab";
import { ScheduledReportsTab } from "@/components/reports/ScheduledReportsTab";

const ReportsPage = () => {
  const { getNonConformances } = useNonConformances();
  const { data: nonConformances = [], isLoading, refetch } = getNonConformances;
  const [activeTab, setActiveTab] = useState("standard");

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="standard">Relatórios Padrão</TabsTrigger>
            <TabsTrigger value="custom">Relatórios Personalizados</TabsTrigger>
            <TabsTrigger value="scheduled">Relatórios Agendados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard">
            <StandardReportsTab />
          </TabsContent>
          
          <TabsContent value="custom">
            <CustomReportTab nonConformances={nonConformances} />
          </TabsContent>
          
          <TabsContent value="scheduled">
            <ScheduledReportsTab nonConformances={nonConformances} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ReportsPage;
