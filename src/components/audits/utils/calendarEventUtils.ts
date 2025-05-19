
import { AuditReport, ScheduledAudit } from "@/types/audit";
import { CalendarEvent } from "@/components/shared/CalendarView";

// Convert audit reports to calendar events
export const mapReportsToEvents = (auditReports: AuditReport[]): CalendarEvent[] => {
  return auditReports.map(audit => ({
    id: audit.id,
    title: audit.title,
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
    // Get start date of the week
    const { startDate } = getWeekDates(audit.year, audit.week_number);
    
    return {
      id: audit.id,
      title: `Auditoria: ${audit.department?.name || 'Departamento'}`,
      date: startDate,
      type: 'audit',
      status: audit.status,
      entityType: 'scheduled'
    };
  });
};
