
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { useNonConformances } from "@/hooks/useNonConformances";
import { COLORS } from "@/components/dashboard/utils/dashboardConstants";
import { isUrgent, isApproachingDeadline, prepareMonthlyData } from "@/components/dashboard/utils/dashboardHelpers";

// Dashboard components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardKPICards from "@/components/dashboard/DashboardKPICards";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState";
import OverviewTab from "@/components/dashboard/tabs/OverviewTab";
import TrendsTab from "@/components/dashboard/tabs/TrendsTab";
import DepartmentAnalysisTab from "@/components/dashboard/tabs/DepartmentAnalysisTab";
import RecentItemsList from "@/components/dashboard/RecentItemsList";

const Dashboard = () => {
  const { nonConformances, isLoading, refetch } = useNonConformances();
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [animateValues, setAnimateValues] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Prepare data based on real non-conformances
  const statusData = [
    { name: "Concluídas", value: nonConformances.filter(nc => nc.status === "closed").length, color: COLORS.completed },
    { name: "Em Andamento", value: nonConformances.filter(nc => nc.status === "in-progress").length, color: COLORS.inProgress },
    { name: "Críticas", value: nonConformances.filter(nc => nc.status === "pending" && isUrgent(nc)).length, color: COLORS.critical },
    { name: "Pendentes", value: nonConformances.filter(nc => nc.status === "pending" && !isUrgent(nc)).length, color: COLORS.pending },
  ];

  // Group by department
  const departmentsMap: Record<string, number> = {};
  nonConformances.forEach(nc => {
    const deptName = nc.department?.name || "Sem departamento";
    departmentsMap[deptName] = (departmentsMap[deptName] || 0) + 1;
  });
  
  const departmentData = Object.entries(departmentsMap)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => Number(b.total) - Number(a.total));

  // Monthly trend data
  const monthlyData = prepareMonthlyData(nonConformances);

  // Recent items
  const recentItems = nonConformances
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Total counts for KPIs
  const totalCount = nonConformances.length;
  const openCount = nonConformances.filter(nc => nc.status !== "closed").length;
  const criticalCount = nonConformances.filter(nc => nc.status === "pending" && isUrgent(nc)).length;
  const dueCount = nonConformances.filter(nc => isApproachingDeadline(nc)).length;

  // Animation effect for counts
  useEffect(() => {
    setAnimateValues(true);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`space-y-6 transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <DashboardHeader 
        filterPeriod={filterPeriod}
        setFilterPeriod={setFilterPeriod}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <DashboardKPICards 
        totalCount={totalCount}
        openCount={openCount}
        criticalCount={criticalCount}
        dueCount={dueCount}
        animateValues={animateValues}
      />

      {isLoading ? (
        <DashboardLoadingState />
      ) : nonConformances.length === 0 ? (
        <DashboardEmptyState />
      ) : (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Visão Geral
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Tendências
            </TabsTrigger>
            <TabsTrigger value="deptAnalysis" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" /> Análise por Departamento
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
              nonConformances={nonConformances}
            />
          </TabsContent>
        </Tabs>
      )}

      {nonConformances.length > 0 && (
        <RecentItemsList 
          recentItems={recentItems}
          isUrgent={isUrgent}
        />
      )}
    </div>
  );
};

export default Dashboard;
