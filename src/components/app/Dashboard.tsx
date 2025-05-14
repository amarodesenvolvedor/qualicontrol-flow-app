
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
  const [filterYear, setFilterYear] = useState<string>(new Date().getFullYear().toString());
  const [animateValues, setAnimateValues] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Filter nonconformances by selected year
  const filteredNonConformances = nonConformances.filter(nc => {
    if (filterYear === 'all') return true;
    const createdYear = new Date(nc.created_at).getFullYear().toString();
    return createdYear === filterYear;
  });

  // Get available years from data for the filter
  const availableYears = Array.from(
    new Set(nonConformances.map(nc => new Date(nc.created_at).getFullYear()))
  ).sort((a, b) => b - a); // Sort descending (most recent first)

  // Prepare data based on filtered non-conformances
  const statusData = [
    { name: "Concluídas", value: filteredNonConformances.filter(nc => nc.status === "closed").length, color: COLORS.completed },
    { name: "Em Andamento", value: filteredNonConformances.filter(nc => nc.status === "in-progress").length, color: COLORS.inProgress },
    { name: "Críticas", value: filteredNonConformances.filter(nc => nc.status === "pending" && isUrgent(nc)).length, color: COLORS.critical },
    { name: "Pendentes", value: filteredNonConformances.filter(nc => nc.status === "pending" && !isUrgent(nc)).length, color: COLORS.pending },
  ];

  // Group by department
  const departmentsMap: Record<string, number> = {};
  filteredNonConformances.forEach(nc => {
    const deptName = nc.department?.name || "Sem departamento";
    departmentsMap[deptName] = (departmentsMap[deptName] || 0) + 1;
  });
  
  const departmentData = Object.entries(departmentsMap)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => Number(b.total) - Number(a.total));

  // Monthly trend data
  const monthlyData = prepareMonthlyData(filteredNonConformances);

  // Recent items
  const recentItems = filteredNonConformances
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Total counts for KPIs
  const totalCount = filteredNonConformances.length;
  const openCount = filteredNonConformances.filter(nc => nc.status !== "closed").length;
  const completedCount = filteredNonConformances.filter(nc => nc.status === "closed").length;
  const dueCount = filteredNonConformances.filter(nc => isApproachingDeadline(nc)).length;

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
        availableYears={availableYears}
        filterYear={filterYear}
        setFilterYear={setFilterYear}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <DashboardKPICards 
        totalCount={totalCount}
        openCount={openCount}
        completedCount={completedCount}
        dueCount={dueCount}
        animateValues={animateValues}
      />

      {isLoading ? (
        <DashboardLoadingState />
      ) : filteredNonConformances.length === 0 ? (
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
              nonConformances={filteredNonConformances}
            />
          </TabsContent>
        </Tabs>
      )}

      {filteredNonConformances.length > 0 && (
        <RecentItemsList 
          recentItems={recentItems}
          isUrgent={isUrgent}
        />
      )}
    </div>
  );
};

export default Dashboard;
