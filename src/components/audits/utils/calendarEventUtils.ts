
import { AuditReport, ScheduledAudit } from "@/types/audit";
import { CalendarEvent } from "@/components/shared/calendar/types";

// Convert audit reports to calendar events
export const mapReportsToEvents = (auditReports: AuditReport[]): CalendarEvent[] => {
  return auditReports.map(audit => ({
    id: audit.id,
    title: audit.title || 'Sem título',
    date: new Date(audit.audit_date),
    type: 'audit',
    status: audit.status,
    entityType: 'report'
  }));
};

// Convert scheduled audits to calendar events
export const mapScheduledToEvents = (
  scheduledAudits: ScheduledAudit[], 
  getWeekDates: (year: number, weekNumber: number) => { startDate: Date; endDate: Date }
): CalendarEvent[] => {
  return scheduledAudits.map(audit => {
    try {
      // CORREÇÃO: Certifique-se de que os parâmetros estão na ordem correta: year seguido por week_number
      const { startDate } = getWeekDates(audit.year, audit.week_number);
      
      return {
        id: audit.id,
        title: `Auditoria: ${audit.department?.name || 'Departamento'}`,
        date: startDate,
        type: 'audit',
        status: audit.status,
        entityType: 'scheduled'
      };
    } catch (error) {
      console.error(`Erro ao processar auditoria agendada ID ${audit.id}:`, error);
      // Fallback to current date if there's an error with the date calculation
      return {
        id: audit.id,
        title: `Auditoria: ${audit.department?.name || 'Departamento'} (data inválida)`,
        date: new Date(),
        type: 'audit',
        status: audit.status,
        entityType: 'scheduled'
      };
    }
  });
};
