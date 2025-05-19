
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { useNonConformances } from "@/hooks/useNonConformances";
import { COLORS } from "@/components/dashboard/utils/dashboardConstants";
import { 
  isUrgent, 
  isApproachingDeadline, 
  isPastDeadline, 
  prepareMonthlyData,
  isWithinSelectedDateRange 
} from "@/components/dashboard/utils/dashboardHelpers";
import { useIsMobile } from "@/hooks/use-mobile";

// Dashboard components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardKPICards from "@/components/dashboard/DashboardKPICards";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState";
import OverviewTab from "@/components/dashboard/tabs/OverviewTab";
import TrendsTab from "@/components/dashboard/tabs/TrendsTab";
import DepartmentAnalysisTab from "@/components/dashboard/tabs/DepartmentAnalysisTab";
import RecentItemsList from "@/components/dashboard/RecentItemsList";
import { DateRangeFilter } from "@/components/shared/filters/DateRangeFilter";
import { Slider } from "@/components/ui/slider";

const Dashboard = () => {
  const { nonConformances = [], isLoading, refetch } = useNonConformances();
  const [filterYear, setFilterYear] = useState<string>(new Date().getFullYear().toString());
  const [animateValues, setAnimateValues] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null } | null>(null);
  const [zoomLevel, setZoomLevel] = useState([100]);
  const isMobile = useIsMobile();

  // Filter non-conformances by selected year or date range
  const filteredNonConformances = Array.isArray(nonConformances) ? nonConformances.filter(nc => {
    if (!nc || !nc.occurrence_date) return false;
    
    // If we have a date range filter, use that instead of year filter
    if (dateRange && (dateRange.from || dateRange.to)) {
      return isWithinSelectedDateRange(nc, dateRange.from, dateRange.to);
    }
    
    // Otherwise, use the year filter
    if (filterYear === 'all') return true;
    const createdYear = new Date(nc.occurrence_date).getFullYear().toString();
    return createdYear === filterYear;
  }) : [];

  // Get available years from data for the filter
  const availableYears = Array.isArray(nonConformances) ? Array.from(
    new Set(nonConformances.filter(nc => nc && nc.occurrence_date).map(nc => new Date(nc.occurrence_date).getFullYear()))
  ).sort((a, b) => b - a) : []; // Sort descending (most recent first)

  // Prepare data based on filtered non-conformances
  const statusData = [
    { name: "Concluídas", value: filteredNonConformances.filter(nc => nc && nc.status === "closed").length, color: COLORS.completed },
    { name: "Em Andamento", value: filteredNonConformances.filter(nc => nc && nc.status === "in-progress").length, color: COLORS.inProgress },
    { name: "Críticas", value: filteredNonConformances.filter(nc => nc && nc.status === "pending" && isUrgent(nc)).length, color: COLORS.critical },
    { name: "Pendentes", value: filteredNonConformances.filter(nc => nc && nc.status === "pending" && !isUrgent(nc)).length, color: COLORS.pending },
  ];

  // Group by department
  const departmentsMap: Record<string, number> = {};
  filteredNonConformances.forEach(nc => {
    if (!nc || !nc.department) return;
    
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
    .filter(nc => nc && nc.created_at)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Total counts for KPIs based on the new rules
  // 1. Total: All non-conformances within the selected date range (based on "occurrence_date")
  const totalCount = filteredNonConformances.length;
  
  // 2. Em Aberto: All non-conformances with Status different from "closed"
  const openCount = filteredNonConformances.filter(nc => nc && nc.status !== "closed").length;
  
  // 3. Concluídas: All non-conformances with Status equal to "closed"
  const completedCount = filteredNonConformances.filter(nc => nc && nc.status === "closed").length;
  
  // 4. A Vencer: All non-conformances with Status "pending" and Response Date within 4 days from today
  const dueCount = filteredNonConformances.filter(nc => nc && isApproachingDeadline(nc)).length;
  
  // 5. Vencidas: All non-conformances with Status "pending" and Response Date before today's date
  const overdueCount = filteredNonConformances.filter(nc => nc && isPastDeadline(nc)).length;

  // Animation effect for counts
  useEffect(() => {
    setAnimateValues(true);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Handle date range change
  const handleDateRangeChange = (range: { from: Date | null; to: Date | null } | null) => {
    setDateRange(range);
    if (range && (range.from || range.to)) {
      setFilterYear('all'); // Clear year filter when date range is selected
    }
  };

  // Handle zoom level change
  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value);
    
    // Aplicar o zoom nos gráficos usando CSS
    const dashboardCharts = document.querySelectorAll('.recharts-responsive-container');
    const zoomValue = value[0] / 100;
    
    dashboardCharts.forEach(chart => {
      const element = chart as HTMLElement;
      if (element) {
        element.style.transform = `scale(${zoomValue})`;
        element.style.transformOrigin = 'center center';
      }
    });
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
      
      <div className="p-3 sm:p-4 bg-card rounded-lg border shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <h3 className="text-sm font-medium mb-2">Filtro por Período</h3>
            <DateRangeFilter 
              value={dateRange} 
              onChange={handleDateRangeChange} 
            />
          </div>
          
          <div className="w-full">
            <h3 className="text-sm font-medium mb-2">Ajustar visualização</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">50%</span>
              <Slider
                value={zoomLevel}
                onValueChange={handleZoomChange}
                min={50}
                max={150}
                step={10}
                className="cursor-pointer flex-1 max-w-[200px] sm:max-w-full"
              />
              <span className="text-xs text-muted-foreground">150%</span>
            </div>
          </div>
        </div>
      </div>

      <DashboardKPICards 
        totalCount={totalCount}
        openCount={openCount}
        completedCount={completedCount}
        dueCount={dueCount}
        overdueCount={overdueCount}
        animateValues={animateValues}
      />

      {isLoading ? (
        <DashboardLoadingState />
      ) : filteredNonConformances.length === 0 ? (
        <DashboardEmptyState />
      ) : (
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
