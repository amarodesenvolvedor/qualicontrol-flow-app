
import { format, isWithinInterval, startOfWeek, endOfWeek, addWeeks, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getWeekDates } from "@/hooks/scheduledAudits/utils";

// Interface for export options
interface ExportOptions {
  dateRange?: string;
  year?: number;
  specificDate?: Date;
  includeFields?: Record<string, boolean>;
}

/**
 * Transforms data into a format suitable for reports based on report type and filters
 */
export const getReportData = (
  reportType: string, 
  nonConformances: any[] = [], 
  auditReports: any[] = [],
  scheduledAudits: any[] = [],
  options?: ExportOptions
) => {
  // Status map para traduzir o status para português
  const statusMap: Record<string, string> = {
    'pending': 'Pendente',
    'in-progress': 'Em Andamento',
    'resolved': 'Resolvido',
    'closed': 'Encerrado',
    'critical': 'Crítico',
    'completed': 'Concluído',
    'programada': 'Programada',
    'agendada': 'Agendada',
    'concluida': 'Concluída',
    'atrasada': 'Atrasada'
  };
  
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

  switch (reportType) {
    case "Não Conformidades Completo":
      return filteredNonConformances.map(nc => ({
        codigo: nc.code,
        titulo: nc.title,
        status: statusMap[nc.status] || nc.status,
        departamento: nc.department?.name,
        categoria: nc.category || "N/A",
        responsavel: nc.responsible_name,
        data_ocorrencia: nc.occurrence_date ? format(new Date(nc.occurrence_date), "dd/MM/yyyy") : "N/A",
        prazo: nc.response_date ? format(new Date(nc.response_date), "dd/MM/yyyy") : "N/A"
      }));
      
    case "Ações Corretivas":
      return filteredNonConformances
        .filter(nc => nc.immediate_actions)
        .map(nc => ({
          codigo: nc.code, 
          titulo: nc.title,
          acoes_imediatas: nc.immediate_actions,
          status: statusMap[nc.status] || nc.status,
          responsavel: nc.responsible_name
        }));
        
    case "Indicadores de Desempenho":
      // Sample KPI data
      const pendingCount = filteredNonConformances.filter(nc => nc.status === 'pending').length;
      const inProgressCount = filteredNonConformances.filter(nc => nc.status === 'in-progress').length;
      const resolvedCount = filteredNonConformances.filter(nc => nc.status === 'resolved').length;
      const totalCount = filteredNonConformances.length;
      
      return [
        { indicador: "Não Conformidades em Aberto", valor: pendingCount, percentual: totalCount ? (pendingCount / totalCount * 100).toFixed(1) + "%" : "0%" },
        { indicador: "Não Conformidades em Progresso", valor: inProgressCount, percentual: totalCount ? (inProgressCount / totalCount * 100).toFixed(1) + "%" : "0%" },
        { indicador: "Não Conformidades Resolvidas", valor: resolvedCount, percentual: totalCount ? (resolvedCount / totalCount * 100).toFixed(1) + "%" : "0%" },
        { indicador: "Total de Não Conformidades", valor: totalCount, percentual: "100%" },
      ];
      
    case "Cronograma de Auditorias":
      // Usar os dados de auditorias programadas com formatação aprimorada
      return filteredScheduledAudits.map(audit => {
        try {
          // Get week dates for better display
          const { startDate, endDate } = getWeekDates(audit.week_number, audit.year);
          const formattedStartDate = format(startDate, "dd/MM/yyyy", { locale: ptBR });
          const formattedEndDate = format(endDate, "dd/MM/yyyy", { locale: ptBR });
          
          return {
            semana: `Semana ${audit.week_number}`,
            periodo: `${formattedStartDate} - ${formattedEndDate}`,
            departamento: audit.department?.name || "N/A",
            auditor_responsavel: audit.responsible_auditor,
            status: statusMap[audit.status] || audit.status,
            ano: audit.year.toString(),
            observacoes: audit.notes || "N/A"
          };
        } catch (error) {
          console.error(`Erro ao processar auditoria: ${error.message}`, audit);
          // Return a fallback object with available data
          return {
            semana: `Semana ${audit.week_number || 'N/A'}`,
            periodo: `N/A`,
            departamento: audit.department?.name || "N/A",
            auditor_responsavel: audit.responsible_auditor || "N/A",
            status: statusMap[audit.status] || audit.status || "N/A",
            ano: (audit.year || 'N/A').toString(),
            observacoes: audit.notes || "N/A"
          };
        }
      });
      
    default:
      return [];
  }
};

/**
 * Apply date filters to the data based on export options
 */
function applyDateFilters(
  reportType: string,
  nonConformances: any[],
  auditReports: any[],
  scheduledAudits: any[],
  options?: ExportOptions
) {
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
        const { startDate, endDate } = getWeekDates(item.week_number, item.year);
        return isWithinInterval(specificDate, { start: startDate, end: endDate });
      } catch (error) {
        console.error(`Error filtering by specific date: ${error.message}`, item);
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
        // Calculate if the week overlaps with the date range
        const { startDate, endDate } = getWeekDates(item.week_number, item.year);
        return (
          (startDate <= endFilterDate && startDate >= startFilterDate) ||
          (endDate >= startFilterDate && endDate <= endFilterDate) ||
          (startDate <= startFilterDate && endDate >= endFilterDate)
        );
      } catch (error) {
        console.error(`Error in date range filter: ${error.message}`, item);
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
