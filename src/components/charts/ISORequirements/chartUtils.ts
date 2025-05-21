
import { addDays, isAfter, isBefore, isWithinInterval } from "date-fns";
import { ISO_REQUIREMENTS, ISO_REQUIREMENT_GROUPS } from "@/utils/isoRequirements";

export type DateRange = {
  from: Date | null;
  to: Date | null;
};

export type GroupingType = "none" | "chapter";

export type DataItem = {
  name: string;
  pending: number;
  inProgress: number;
  closed: number;
  total: number;
  value: number;
};

// Filter data by date range
export const filterDataByDateRange = (data: any[], dateRange: DateRange | null) => {
  if (!dateRange?.from && !dateRange?.to) return data;
  
  return data.filter(item => {
    const itemDate = new Date(item.occurrence_date);
    
    if (dateRange.from && dateRange.to) {
      return isWithinInterval(itemDate, { 
        start: dateRange.from, 
        end: addDays(dateRange.to, 1) // Include end date
      });
    }
    
    if (dateRange.from) {
      return isAfter(itemDate, dateRange.from) || 
             itemDate.toDateString() === dateRange.from.toDateString();
    }
    
    if (dateRange.to) {
      return isBefore(itemDate, addDays(dateRange.to, 1));
    }
    
    return true;
  });
};

// Process data for chart
export const processChartData = (filteredData: any[], groupingType: GroupingType): DataItem[] => {
  // Create a map to count occurrences by ISO requirement
  const requirementCounts: Record<string, {
    pending: number;
    inProgress: number;
    closed: number;
    total: number;
    name: string;
    value: number;
  }> = {};
  
  // Initialize with all ISO requirements
  if (groupingType === "none") {
    ISO_REQUIREMENTS.forEach(req => {
      requirementCounts[req.value] = {
        pending: 0,
        inProgress: 0,
        closed: 0,
        total: 0,
        name: req.value,
        value: 0
      };
    });
  } else {
    // For chapter grouping, initialize with chapter numbers
    const chapters = new Set<string>();
    
    ISO_REQUIREMENTS.forEach(req => {
      const chapter = req.value.split('.')[0];
      chapters.add(chapter);
    });
    
    chapters.forEach(chapter => {
      requirementCounts[chapter] = {
        pending: 0,
        inProgress: 0,
        closed: 0,
        total: 0,
        name: chapter,
        value: 0
      };
    });
  }
  
  // Count non-conformances by requirement
  filteredData.forEach(nc => {
    if (!nc.iso_requirement) return;
    
    let key = nc.iso_requirement;
    
    // For chapter grouping, use the chapter number
    if (groupingType === "chapter") {
      key = nc.iso_requirement.split('.')[0];
    }
    
    // Create entry if it doesn't exist (for custom requirements not in the list)
    if (!requirementCounts[key]) {
      requirementCounts[key] = {
        pending: 0,
        inProgress: 0,
        closed: 0,
        total: 0,
        name: key,
        value: 0
      };
    }
    
    // Increment counts by status
    requirementCounts[key].total += 1;
    requirementCounts[key].value += 1; // Update value property to match total
    
    if (nc.status === "pending") {
      requirementCounts[key].pending += 1;
    } else if (nc.status === "in-progress") {
      requirementCounts[key].inProgress += 1;
    } else if (nc.status === "closed") {
      requirementCounts[key].closed += 1;
    }
  });
  
  // Convert to array and filter out requirements with zero count
  const result = Object.values(requirementCounts)
    .filter(item => item.total > 0)
    .sort((a, b) => {
      // Sort numerically for chapters
      if (groupingType === "chapter") {
        return parseInt(a.name) - parseInt(b.name);
      }
      
      // For regular requirements, sort by requirement value
      const [aMajor, aMinor] = a.name.split('.').map(Number);
      const [bMajor, bMinor] = b.name.split('.').map(Number);
      
      if (aMajor !== bMajor) {
        return aMajor - bMajor;
      }
      
      return aMinor - bMinor;
    });
  
  return result;
};

// Get requirement label for tooltips
export const getRequirementLabel = (requirement: string, groupingType: GroupingType) => {
  if (groupingType === "chapter") {
    const group = ISO_REQUIREMENT_GROUPS.find(
      g => g.title.includes(`Capítulo ${requirement}`)
    );
    return group ? group.title.replace('📘 ', '') : `Capítulo ${requirement}`;
  }
  
  const reqDetails = ISO_REQUIREMENTS.find(req => req.value === requirement);
  return reqDetails ? reqDetails.label : requirement;
};

// Chart configuration
export const chartConfig = {
  pending: { 
    label: "Pendentes", 
    theme: { light: "#3b82f6", dark: "#3b82f6" } 
  },
  inProgress: { 
    label: "Em Andamento", 
    theme: { light: "#f59e0b", dark: "#f59e0b" } 
  },
  closed: { 
    label: "Concluídas", 
    theme: { light: "#10b981", dark: "#10b981" } 
  },
};
