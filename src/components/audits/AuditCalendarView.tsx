
import { useState } from "react";
import { CalendarView, CalendarEvent } from "../shared/CalendarView";
import { AuditReport } from "@/types/audit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AuditCalendarViewProps {
  auditReports: AuditReport[];
}

const AuditCalendarView = ({ auditReports }: AuditCalendarViewProps) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const getStatusBadgeColor = (status: AuditReport['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'in_progress': return 'bg-blue-500 hover:bg-blue-600';
      case 'completed': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  // Convert audit reports to calendar events
  const events: CalendarEvent[] = auditReports.map(audit => ({
    id: audit.id,
    title: audit.title,
    date: new Date(audit.audit_date),
    type: 'audit',
    status: audit.status,
  }));
  
  // Find the complete audit report object based on the selected event
  const selectedAudit = selectedEvent 
    ? auditReports.find(audit => audit.id === selectedEvent.id)
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
            <DialogTitle>Detalhes da Auditoria</DialogTitle>
            <DialogDescription>
              Informações completas sobre esta auditoria.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAudit && (
            <div className="space-y-4 pt-4">
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{selectedAudit.title}</h3>
                  <Badge className={getStatusBadgeColor(selectedAudit.status)}>
                    {selectedAudit.status}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Departamento</p>
                  <p>{selectedAudit.department?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Data da Auditoria</p>
                  <p>{format(new Date(selectedAudit.audit_date), 'dd/MM/yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Criado em</p>
                  <p>{format(new Date(selectedAudit.created_at), 'dd/MM/yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Auditor Responsável</p>
                  <p>{selectedAudit.responsible_auditor || '-'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Descrição</p>
                <p className="text-sm mt-1">{selectedAudit.description || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Arquivo</p>
                <div className="flex items-center mt-1">
                  <FileText className="h-4 w-4 mr-2" />
                  <span className="text-sm">{selectedAudit.file_name}</span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleDownloadFile}>
                  Baixar Relatório
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuditCalendarView;
