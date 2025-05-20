import { useState } from "react";
import Layout from "@/components/app/Layout";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNonConformances } from "@/hooks/useNonConformances";
import { StandardReportsTab } from "@/components/reports/StandardReportsTab";
import { CustomReportTab } from "@/components/reports/CustomReportTab";
import { ScheduledReportsTab } from "@/components/reports/ScheduledReportsTab";
import { toast } from "@/components/ui/use-toast";
const ReportsPage = () => {
  const {
    nonConformances,
    isLoading,
    refetch
  } = useNonConformances();
  const [activeTab, setActiveTab] = useState("standard");
  const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key state

  const handleRefresh = async () => {
    toast({
      title: "Atualizando relatórios..."
    });
    try {
      await refetch();
      setRefreshKey(prev => prev + 1); // Force re-render of components
      toast({
        title: "Relatórios atualizados com sucesso!"
      });
    } catch (error) {
      console.error("Erro ao atualizar relatórios:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar relatórios"
      });
    }
  };
  return <Layout>
      <div className="flex flex-col gap-6 animate-fadeIn">
        <div className="flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-slate-950">
            Relatórios
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 transition-all hover:-translate-y-1 hover:shadow-md duration-300 border-blue-200" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin text-blue-500' : 'text-blue-500'}`} />
              Atualizar
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fadeIn">
          <TabsList className="mb-4 bg-card border shadow-sm p-1">
            <TabsTrigger value="standard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm">
              Relatórios Padrão
            </TabsTrigger>
            <TabsTrigger value="custom" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm">
              Relatórios Personalizados
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm">
              Relatórios Agendados
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard" className="animate-fadeIn">
            <StandardReportsTab key={`standard-${refreshKey}`} />
          </TabsContent>
          
          <TabsContent value="custom" className="animate-fadeIn">
            <CustomReportTab nonConformances={nonConformances} key={`custom-${refreshKey}`} />
          </TabsContent>
          
          <TabsContent value="scheduled" className="animate-fadeIn">
            <ScheduledReportsTab nonConformances={nonConformances} key={`scheduled-${refreshKey}`} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>;
};
export default ReportsPage;