
import { useIsMobile } from "@/hooks/use-mobile";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useDashboardData } from "@/components/dashboard/utils/useDashboardData";

// Dashboard components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardKPICards from "@/components/dashboard/DashboardKPICards";
import DashboardFilters from "@/components/dashboard/DashboardFilters";
import DashboardContent from "@/components/dashboard/DashboardContent";

// Import CSS for styling
import "@/components/app/dashboard.css";

const Dashboard = () => {
  const {
    filteredNonConformances,
    isLoading,
    filterYear,
    setFilterYear,
    animateValues,
    isDarkMode,
    toggleDarkMode,
    dateRange,
    handleDateRangeChange,
    zoomLevel,
    handleZoomChange,
    availableYears
  } = useDashboardState();

  const {
    statusData,
    departmentData,
    monthlyData,
    recentItems,
    totalCount,
    openCount,
    completedCount,
    dueCount,
    overdueCount
  } = useDashboardData(filteredNonConformances);

  const isMobile = useIsMobile();

  return (
    <div className={`space-y-6 transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <DashboardHeader 
        availableYears={availableYears}
        filterYear={filterYear}
        setFilterYear={setFilterYear}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      <DashboardFilters 
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        zoomLevel={zoomLevel}
        onZoomChange={handleZoomChange}
      />

      <DashboardKPICards 
        totalCount={totalCount}
        openCount={openCount}
        completedCount={completedCount}
        dueCount={dueCount}
        overdueCount={overdueCount}
        animateValues={animateValues}
      />

      {filteredNonConformances.length > 0 && (
        <DashboardContent 
          isLoading={isLoading}
          filteredNonConformances={filteredNonConformances}
          statusData={statusData}
          departmentData={departmentData}
          monthlyData={monthlyData}
          recentItems={recentItems}
        />
      )}
    </div>
  );
};

export default Dashboard;
