
import { useState } from "react";
import { CalendarView, CalendarEvent } from "../shared/CalendarView";
import { AuditReport, ScheduledAudit } from "@/types/audit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useScheduledAudits } from "@/hooks/useScheduledAudits";
import { AuditReportDetails } from "./calendar/AuditReportDetails";
import { ScheduledAuditDetails } from "./calendar/ScheduledAuditDetails";
import { mapReportsToEvents, mapScheduledToEvents } from "./utils/calendarEventUtils";

interface AuditCalendarViewProps {
  auditReports: AuditReport[];
  scheduledAudits?: ScheduledAudit[];
}

const AuditCalendarView = ({ auditReports, scheduledAudits = [] }: AuditCalendarViewProps) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { getWeekDates } = useScheduledAudits();

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  // Map audit reports and scheduled audits to calendar events
  const reportEvents = mapReportsToEvents(auditReports);
  const scheduledEvents = mapScheduledToEvents(scheduledAudits, getWeekDates);

  // Combine all events
  const events: CalendarEvent[] = [...reportEvents, ...scheduledEvents];
  
  // Find the complete audit information based on the selected event
  const selectedAudit = selectedEvent && selectedEvent.entityType === 'report'
    ? auditReports.find(audit => audit.id === selectedEvent.id)
    : null;
    
  const selectedScheduledAudit = selectedEvent && selectedEvent.entityType === 'scheduled'
    ? scheduledAudits.find(audit => audit.id === selectedEvent.id)
    : null;

  const handleDownloadFile = async () => {
    if (selectedAudit) {
      try {
        const { data, error } = await supabase.storage
          .from('audit_files')
          .download(selectedAudit.file_path);
          
        if (error) {
          throw error;
        }
        
        // Create a download link for the file
        const url = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = selectedAudit.file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Erro ao baixar o arquivo:', error);
      }
    }
  };

  return (
    <>
      <CalendarView
        events={events}
        onEventClick={handleEventClick}
        onFilterChange={setActiveFilters}
        activeFilters={activeFilters}
      />

      {/* Event Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent?.entityType === 'scheduled' ? 'Detalhes da Auditoria Programada' : 'Detalhes da Auditoria'}
            </DialogTitle>
            <DialogDescription>
              {selectedEvent?.entityType === 'scheduled' 
                ? 'Informações da auditoria programada.' 
                : 'Informações completas sobre esta auditoria.'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent?.entityType === 'scheduled' && selectedScheduledAudit ? (
            <ScheduledAuditDetails 
              audit={selectedScheduledAudit}
              getWeekDates={getWeekDates}
            />
          ) : selectedAudit ? (
            <AuditReportDetails 
              audit={selectedAudit}
              onDownload={handleDownloadFile}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuditCalendarView;
