
import { isWithinInterval, startOfWeek, endOfWeek } from "date-fns";
import { format } from "date-fns";
import { getWeekDates } from "@/hooks/scheduledAudits/utils";
import { FilteredReportData, ReportExportOptions } from "./types";

/**
 * Apply date filters to the data based on export options
 */
export function applyDateFilters(
  reportType: string,
  nonConformances: any[],
  auditReports: any[],
  scheduledAudits: any[],
  options?: ReportExportOptions
): FilteredReportData {
  // Default to original data if no filters
  if (!options) {
    return {
      filteredNonConformances: nonConformances,
      filteredAuditReports: auditReports,
      filteredScheduledAudits: scheduledAudits
    };
  }
  
  let filteredNonConformances = [...nonConformances];
  let filteredAuditReports = [...auditReports];
  let filteredScheduledAudits = [...scheduledAudits];
  
  // Filter by year if specified
  if (options.year) {
    const year = options.year;
    
    filteredNonConformances = filteredNonConformances.filter(item => {
      if (!item.occurrence_date) return false;
      const itemDate = new Date(item.occurrence_date);
      return itemDate.getFullYear() === year;
    });
    
    filteredAuditReports = filteredAuditReports.filter(item => {
      if (!item.audit_date) return false;
      const itemDate = new Date(item.audit_date);
      return itemDate.getFullYear() === year;
    });
    
    filteredScheduledAudits = filteredScheduledAudits.filter(item => 
      item.year === year
    );
  }
  
  // Filter by specific date if provided
  if (options.specificDate) {
    const specificDate = options.specificDate;
    
    filteredNonConformances = filteredNonConformances.filter(item => {
      if (!item.occurrence_date) return false;
      const itemDate = new Date(item.occurrence_date);
      return itemDate.toDateString() === specificDate.toDateString();
    });
    
    filteredAuditReports = filteredAuditReports.filter(item => {
      if (!item.audit_date) return false;
      const itemDate = new Date(item.audit_date);
      return itemDate.toDateString() === specificDate.toDateString();
    });
    
    // For scheduled audits, check if the specific date falls within the week period
    filteredScheduledAudits = filteredScheduledAudits.filter(item => {
      try {
        const { startDate, endDate } = getWeekDates(item.year, item.week_number);
        return isWithinInterval(specificDate, { start: startDate, end: endDate });
      } catch (error) {
        console.error(`Erro ao filtrar por data específica (Semana ${item.week_number}, Ano ${item.year}): ${error.message}`, item);
        return false; // Exclude items that cause errors
      }
    });
  }
  
  // Filter by date range
  else if (options.dateRange) {
    const now = new Date();
    const currentYear = now.getFullYear();
    let startFilterDate: Date;
    let endFilterDate = new Date();
    
    switch (options.dateRange) {
      case 'month':
        // Current month
        startFilterDate = new Date(currentYear, now.getMonth(), 1);
        endFilterDate = new Date(currentYear, now.getMonth() + 1, 0);
        break;
      case 'quarter':
        // Current quarter
        const currentQuarter = Math.floor(now.getMonth() / 3);
        startFilterDate = new Date(currentYear, currentQuarter * 3, 1);
        endFilterDate = new Date(currentYear, (currentQuarter + 1) * 3, 0);
        break;
      default: // year
        // Current year
        startFilterDate = new Date(currentYear, 0, 1);
        endFilterDate = new Date(currentYear, 11, 31);
    }
    
    // Apply date range filters to each data type
    filteredNonConformances = filteredNonConformances.filter(item => {
      if (!item.occurrence_date) return false;
      const itemDate = new Date(item.occurrence_date);
      return itemDate >= startFilterDate && itemDate <= endFilterDate;
    });
    
    filteredAuditReports = filteredAuditReports.filter(item => {
      if (!item.audit_date) return false;
      const itemDate = new Date(item.audit_date);
      return itemDate >= startFilterDate && itemDate <= endFilterDate;
    });
    
    // For scheduled audits, use a different approach based on weeks
    filteredScheduledAudits = filteredScheduledAudits.filter(item => {
      try {
        const { startDate, endDate } = getWeekDates(item.year, item.week_number);
        
        // Logging for debugging
        console.log(`Filtrando auditoria da Semana ${item.week_number}, Ano ${item.year}:`);
        console.log(`- Período da semana: ${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`);
        console.log(`- Período do filtro: ${format(startFilterDate, "dd/MM/yyyy")} - ${format(endFilterDate, "dd/MM/yyyy")}`);
        
        const overlap = (
          (startDate <= endFilterDate && startDate >= startFilterDate) ||
          (endDate >= startFilterDate && endDate <= endFilterDate) ||
          (startDate <= startFilterDate && endDate >= endFilterDate)
        );
        
        console.log(`- Resultado do filtro: ${overlap ? 'Incluído' : 'Excluído'}`);
        return overlap;
      } catch (error) {
        console.error(`Erro no filtro de intervalo de datas (Semana ${item.week_number}, Ano ${item.year}): ${error.message}`, item);
        return false; // Exclude items that cause errors
      }
    });
  }
  
  return {
    filteredNonConformances,
    filteredAuditReports,
    filteredScheduledAudits
  };
}
