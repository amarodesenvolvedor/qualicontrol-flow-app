
import { NonConformance } from "@/hooks/useNonConformances";

// Helper function to check if a non-conformance is urgent (created in the last 7 days)
export function isUrgent(nc: NonConformance) {
  const createdDate = new Date(nc.occurrence_date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays < 7;
}

// Helper function to check if a non-conformance is approaching deadline (within next 7 days)
export function isApproachingDeadline(nc: NonConformance) {
  if (!nc.response_date) return false;
  const responseDate = new Date(nc.response_date);
  const now = new Date();
  const diffTime = responseDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 7;
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
