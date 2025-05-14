
import { useState } from "react";
import Layout from "@/components/app/Layout";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNonConformances } from "@/hooks/useNonConformances";
import { StandardReportsTab } from "@/components/reports/StandardReportsTab";
import { CustomReportTab } from "@/components/reports/CustomReportTab";
import { ScheduledReportsTab } from "@/components/reports/ScheduledReportsTab";
import { toast } from "sonner";

const ReportsPage = () => {
  const { nonConformances, isLoading, refetch } = useNonConformances();
  const [activeTab, setActiveTab] = useState("standard");
  const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key state

  const handleRefresh = async () => {
    toast.info("Atualizando relatórios...");
    try {
      await refetch();
      setRefreshKey(prev => prev + 1); // Force re-render of components
      toast.success("Relatórios atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar relatórios:", error);
      toast.error("Erro ao atualizar relatórios");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 transition-all hover:-translate-y-1 hover:shadow-md duration-300" 
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fadeIn">
          <TabsList className="mb-4">
            <TabsTrigger value="standard">Relatórios Padrão</TabsTrigger>
            <TabsTrigger value="custom">Relatórios Personalizados</TabsTrigger>
            <TabsTrigger value="scheduled">Relatórios Agendados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard" className="animate-fadeIn">
            <StandardReportsTab key={`standard-${refreshKey}`} /> {/* Add key based on refreshKey */}
          </TabsContent>
          
          <TabsContent value="custom" className="animate-fadeIn">
            <CustomReportTab nonConformances={nonConformances} key={`custom-${refreshKey}`} /> {/* Add key based on refreshKey */}
          </TabsContent>
          
          <TabsContent value="scheduled" className="animate-fadeIn">
            <ScheduledReportsTab nonConformances={nonConformances} key={`scheduled-${refreshKey}`} /> {/* Add key based on refreshKey */}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ReportsPage;
