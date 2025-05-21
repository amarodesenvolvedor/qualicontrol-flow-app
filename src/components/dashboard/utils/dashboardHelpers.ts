
import { NonConformance } from "@/types/nonConformance";
import { startOfDay, endOfDay, addDays, isWithinInterval } from "date-fns";

// Helper function to check if a non-conformance is urgent (created in the last 7 days)
export function isUrgent(nc: NonConformance) {
  const createdDate = new Date(nc.occurrence_date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays < 7;
}

// Updated function to check if a non-conformance is critical
// New rule: Status is "pending" AND due_date (response_date) is before today
export function isCritical(nc: NonConformance) {
  if (!nc.response_date || nc.status !== 'pending') return false;
  
  const now = startOfDay(new Date());
  const responseDate = new Date(nc.response_date);
  
  return responseDate < now;
}

// Helper function to check if a non-conformance is approaching deadline (within next 4 days)
// Updated rule: Status == "Pending" AND response_date <= today + 4 days AND response_date >= today
export function isApproachingDeadline(nc: NonConformance) {
  if (!nc.response_date || nc.status !== 'pending') return false;
  
  const now = startOfDay(new Date());
  const fourDaysFromNow = endOfDay(addDays(now, 4));
  const responseDate = new Date(nc.response_date);
  
  return responseDate >= now && responseDate <= fourDaysFromNow;
}

// Helper function to check if a non-conformance is past its deadline
// Updated rule: Status == "Pending" AND response_date < today
export function isPastDeadline(nc: NonConformance) {
  if (!nc.response_date) return false;
  
  const now = startOfDay(new Date());
  const responseDate = new Date(nc.response_date);
  
  return responseDate < now && nc.status === "pending";
}

/**
 * Checks if a non-conformance falls within the selected date range
 * 
 * @param nc The non-conformance to check
 * @param startDate The start date of the range (optional)
 * @param endDate The end date of the range (optional)
 * @returns True if the non-conformance is within range, false otherwise
 */
export const isWithinSelectedDateRange = (
  nc: any, 
  startDate: Date | null, 
  endDate: Date | null
): boolean => {
  if (!nc || !nc.occurrence_date) return false;
  
  const occurrenceDate = new Date(nc.occurrence_date);
  
  // If we have a start date and the occurrence date is before it, return false
  if (startDate && occurrenceDate < startDate) {
    return false;
  }
  
  // If we have an end date and the occurrence date is after it, return false
  if (endDate) {
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999); // Set to end of day
    
    if (occurrenceDate > endOfDay) {
      return false;
    }
  }
  
  // If we've made it this far, the date is within range
  return true;
};

// Helper function to prepare monthly data
export function prepareMonthlyData(data: NonConformance[]) {
  const months: Record<string, { name: string; pending: number; inProgress: number; completed: number; total: number }> = {};
  const now = new Date();
  
  // Initialize with last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = date.toLocaleString('pt-BR', { month: 'short' });
    months[monthKey] = { name: monthKey, pending: 0, inProgress: 0, completed: 0, total: 0 };
  }

  // Fill with actual data
  data.forEach(nc => {
    const date = new Date(nc.occurrence_date);
    const monthKey = date.toLocaleString('pt-BR', { month: 'short' });
    if (months[monthKey]) {
      months[monthKey].total += 1;
      
      if (nc.status === "pending") {
        months[monthKey].pending += 1;
      } else if (nc.status === "in-progress") {
        months[monthKey].inProgress += 1;
      } else {
        months[monthKey].completed += 1;
      }
    }
  });

  return Object.values(months);
}
