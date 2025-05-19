
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { isUrgent } from "@/components/dashboard/utils/dashboardHelpers";
import { useIsMobile } from "@/hooks/use-mobile";
import { NonConformance } from "@/hooks/useNonConformances";
import { COLORS } from "@/components/dashboard/utils/dashboardConstants";

// Dashboard components
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState";
import OverviewTab from "@/components/dashboard/tabs/OverviewTab";
import TrendsTab from "@/components/dashboard/tabs/TrendsTab";
import DepartmentAnalysisTab from "@/components/dashboard/tabs/DepartmentAnalysisTab";
import RecentItemsList from "@/components/dashboard/RecentItemsList";

interface DashboardContentProps {
  isLoading: boolean;
  filteredNonConformances: NonConformance[];
  statusData: Array<{ name: string; value: number; color: string }>;
  departmentData: Array<{ name: string; total: number }>;
  monthlyData: any[];
  recentItems: NonConformance[];
}

const DashboardContent = ({
  isLoading,
  filteredNonConformances,
  statusData,
  departmentData,
  monthlyData,
  recentItems
}: DashboardContentProps) => {
  const isMobile = useIsMobile();

  if (isLoading) {
    return <DashboardLoadingState />;
  }
  
  if (filteredNonConformances.length === 0) {
    return <DashboardEmptyState />;
  }

  return (
    <>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="overflow-x-auto flex w-full sm:w-auto pb-1">
          <TabsTrigger value="overview" className="flex items-center gap-2 whitespace-nowrap">
            <BarChart3 className="h-4 w-4" /> 
            {!isMobile ? "Visão Geral" : "Visão"}
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2 whitespace-nowrap">
            <TrendingUp className="h-4 w-4" /> 
            {!isMobile ? "Tendências" : "Tend."}
          </TabsTrigger>
          <TabsTrigger value="deptAnalysis" className="flex items-center gap-2 whitespace-nowrap">
            <PieChartIcon className="h-4 w-4" /> 
            {!isMobile ? "Análise por Departamento" : "Depts"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <OverviewTab 
            statusData={statusData} 
            departmentData={departmentData}
            COLORS={COLORS} 
          />
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          <TrendsTab 
            monthlyData={monthlyData}
            COLORS={COLORS}
          />
        </TabsContent>
        
        <TabsContent value="deptAnalysis" className="space-y-4">
          <DepartmentAnalysisTab 
            departmentData={departmentData}
            nonConformances={filteredNonConformances}
          />
        </TabsContent>
      </Tabs>

      <RecentItemsList 
        recentItems={recentItems}
        isUrgent={isUrgent}
      />
    </>
  );
};

export default DashboardContent;
