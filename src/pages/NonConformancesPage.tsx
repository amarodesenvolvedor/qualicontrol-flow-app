
import { useState, useEffect } from "react";
import Layout from "@/components/app/Layout";
import { useNonConformances } from "@/hooks/useNonConformances";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar as CalendarIcon, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NonConformanceList from "@/components/app/NonConformanceList";
import NonConformanceFilters from "@/components/app/NonConformanceFilters";
import NonConformanceCalendarView from "@/components/app/NonConformanceCalendarView";
import { useNavigate } from "react-router-dom";
import { NotificationWrapper } from "@/components/app/NotificationWrapper";
import { Toaster } from "sonner";
import { requestNotificationPermission } from "@/services/notificationService";

const NonConformancesPage = () => {
  const [selectedTab, setSelectedTab] = useState("list");
  const navigate = useNavigate();
  
  const { 
    nonConformances, 
    isLoading, 
    refetch, 
    deleteNonConformance,
    filters,
    setFilters
  } = useNonConformances();
  
  useEffect(() => {
    // Request notification permission when the page loads
    const requestPermission = async () => {
      const permission = await requestNotificationPermission();
      console.log("Notification permission:", permission);
    };
    
    requestPermission();
  }, []);
  
  const handleDeleteNonConformance = async (id: string) => {
    await deleteNonConformance.mutateAsync(id);
  };

  const handleNewNonConformance = () => {
    navigate("/nao-conformidades/nova");
  };
  
  return (
    <Layout>
      <NotificationWrapper>
        <Toaster position="top-right" />
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">Não Conformidades</h1>
            <Button onClick={handleNewNonConformance}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Não Conformidade
            </Button>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="list">
                <List className="mr-2 h-4 w-4" />
                Lista
              </TabsTrigger>
              <TabsTrigger value="calendar">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Calendário
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <div className="space-y-4">
                <NonConformanceFilters 
                  filters={filters}
                  onFilterChange={setFilters}
                />
                <NonConformanceList 
                  nonConformances={nonConformances} 
                  isLoading={isLoading} 
                  refetch={refetch}
                  deleteNonConformance={handleDeleteNonConformance}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="calendar">
              <div className="space-y-4">
                <NonConformanceCalendarView nonConformances={nonConformances} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </NotificationWrapper>
    </Layout>
  );
};

export default NonConformancesPage;
