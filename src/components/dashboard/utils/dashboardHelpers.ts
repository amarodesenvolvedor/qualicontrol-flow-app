
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

// Helper function to check if a non-conformance is within the selected date range
export function isWithinSelectedDateRange(nc: NonConformance, fromDate: Date | null, toDate: Date | null) {
  if (!fromDate && !toDate) return true;
  
  const occurrenceDate = new Date(nc.occurrence_date);
  
  if (fromDate && toDate) {
    return isWithinInterval(occurrenceDate, {
      start: startOfDay(fromDate),
      end: endOfDay(toDate)
    });
  }
  
  if (fromDate && !toDate) {
    return occurrenceDate >= startOfDay(fromDate);
  }
  
  if (!fromDate && toDate) {
    return occurrenceDate <= endOfDay(toDate);
  }
  
  return true;
}

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
