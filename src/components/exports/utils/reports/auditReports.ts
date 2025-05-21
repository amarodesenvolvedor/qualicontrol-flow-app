
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getWeekDates } from "@/hooks/scheduledAudits/utils";
import { STATUS_MAP } from "./types";

/**
 * Transform data for audit schedule reports
 */
export function transformAuditScheduleData(filteredScheduledAudits: any[]) {
  console.log(`Processando ${filteredScheduledAudits.length} auditorias para o relatório`);
  
  return filteredScheduledAudits.map(audit => {
    try {
      console.log(`Processando auditoria: Semana ${audit.week_number}, Ano ${audit.year}`);
      
      const { startDate, endDate } = getWeekDates(audit.year, audit.week_number);
      const formattedStartDate = format(startDate, "dd/MM/yyyy", { locale: ptBR });
      const formattedEndDate = format(endDate, "dd/MM/yyyy", { locale: ptBR });
      
      console.log(`Datas calculadas: ${formattedStartDate} - ${formattedEndDate}`);
      
      return {
        semana: `Semana ${audit.week_number}`,
        periodo: `${formattedStartDate} - ${formattedEndDate}`,
        departamento: audit.department?.name || "N/A",
        auditor_responsavel: audit.responsible_auditor,
        status: STATUS_MAP[audit.status] || audit.status,
        ano: audit.year.toString(),
        observacoes: audit.notes || "N/A"
      };
    } catch (error) {
      console.error(`Erro ao processar auditoria (Semana ${audit.week_number}, Ano ${audit.year}): ${error.message}`, audit);
      
      return {
        semana: `Semana ${audit.week_number || 'N/A'}`,
        periodo: `Período indisponível`,
        departamento: audit.department?.name || "N/A",
        auditor_responsavel: audit.responsible_auditor || "N/A",
        status: STATUS_MAP[audit.status] || audit.status || "N/A",
        ano: (audit.year || 'N/A').toString(),
        observacoes: audit.notes || "N/A"
      };
    }
  });
}
