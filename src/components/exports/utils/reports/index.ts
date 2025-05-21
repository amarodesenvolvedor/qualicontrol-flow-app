
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { applyDateFilters } from "./dateFilters";
import { transformNonConformanceData } from "./nonConformanceReports";
import { transformAuditScheduleData } from "./auditReports";
import { ReportExportOptions } from "./types";

/**
 * Main function to transform data into a format suitable for reports 
 * based on report type and filters
 */
export const getReportData = (
  reportType: string, 
  nonConformances: any[] = [], 
  auditReports: any[] = [],
  scheduledAudits: any[] = [],
  options?: ReportExportOptions
) => {
  // Add debug logging to see what data is being received
  console.log(`getReportData called for: ${reportType} with ${scheduledAudits.length} scheduled audits`);
  
  // Apply date filters to the relevant data
  const filteredData = applyDateFilters(
    reportType, 
    nonConformances, 
    auditReports,
    scheduledAudits,
    options
  );
  
  const { 
    filteredNonConformances, 
    filteredAuditReports, 
    filteredScheduledAudits 
  } = filteredData;

  console.log(`After filtering: ${filteredScheduledAudits.length} scheduled audits remaining`);

  // Process data based on report type
  switch (reportType) {
    case "Não Conformidades Completo":
    case "Ações Corretivas":
    case "Indicadores de Desempenho":
      return transformNonConformanceData(filteredNonConformances, reportType);
      
    case "Cronograma de Auditorias":
      return transformAuditScheduleData(filteredScheduledAudits);
      
    default:
      return [];
  }
};

// Export everything
export * from "./types";
export * from "./dateFilters";
export * from "./nonConformanceReports";
export * from "./auditReports";
