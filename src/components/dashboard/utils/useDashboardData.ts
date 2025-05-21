
import { useMemo } from "react";
import { NonConformance } from "@/hooks/useNonConformances";
import { COLORS } from "@/components/dashboard/utils/dashboardConstants";
import { isCritical, isPastDeadline, isApproachingDeadline, prepareMonthlyData } from "@/components/dashboard/utils/dashboardHelpers";

export function useDashboardData(filteredNonConformances: NonConformance[]) {
  return useMemo(() => {
    // Status data
    const statusData = [
      { name: "Concluídas", value: filteredNonConformances.filter(nc => nc && nc.status === "closed").length, color: COLORS.completed },
      { name: "Em Andamento", value: filteredNonConformances.filter(nc => nc && nc.status === "in-progress").length, color: COLORS.inProgress },
      { name: "Críticas", value: filteredNonConformances.filter(nc => nc && isCritical(nc)).length, color: COLORS.critical },
      { name: "Pendentes", value: filteredNonConformances.filter(nc => nc && nc.status === "pending" && !isCritical(nc)).length, color: COLORS.pending },
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
    const totalCount = filteredNonConformances.length;
    const openCount = filteredNonConformances.filter(nc => nc && nc.status !== "closed").length;
    const completedCount = filteredNonConformances.filter(nc => nc && nc.status === "closed").length;
    const dueCount = filteredNonConformances.filter(nc => nc && isApproachingDeadline(nc)).length;
    const overdueCount = filteredNonConformances.filter(nc => nc && isPastDeadline(nc)).length;

    return {
      statusData,
      departmentData,
      monthlyData,
      recentItems,
      totalCount,
      openCount,
      completedCount,
      dueCount,
      overdueCount
    };
  }, [filteredNonConformances]);
}
