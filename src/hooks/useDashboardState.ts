import { useState, useEffect } from "react";
import { DEFAULT_YEAR, DEFAULT_ZOOM_LEVEL } from "@/components/dashboard/constants/dashboardConfig";
import { useNonConformances } from "@/hooks/useNonConformances";
import { isWithinSelectedDateRange } from "@/components/dashboard/utils/dashboardHelpers";

export function useDashboardState() {
  const { nonConformances = [], isLoading, refetch } = useNonConformances();
  const [filterYear, setFilterYear] = useState<string>(DEFAULT_YEAR);
  const [animateValues, setAnimateValues] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null } | null>(null);
  const [zoomLevel, setZoomLevel] = useState([DEFAULT_ZOOM_LEVEL]);

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
    
    // Apply zoom to charts using CSS
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

  return {
    nonConformances,
    filteredNonConformances,
    isLoading,
    refetch,
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
  };
}
