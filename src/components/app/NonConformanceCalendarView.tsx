
import { useState } from "react";
import { CalendarView, CalendarEvent } from "../shared/CalendarView";
import { NonConformance } from "@/types/nonConformance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface NonConformanceCalendarViewProps {
  nonConformances: NonConformance[];
}

const NonConformanceCalendarView = ({ nonConformances }: NonConformanceCalendarViewProps) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const navigate = useNavigate();

  const mapStatusToSeverity = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'critical';
      case 'in-progress':
        return 'pending';
      default:
        return status;
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const getStatusBadgeColor = (status: NonConformance['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'in-progress': return 'bg-blue-500 hover:bg-blue-600';
      case 'resolved': return 'bg-green-500 hover:bg-green-600';
      case 'closed': return 'bg-gray-500 hover:bg-gray-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  // Convert non-conformances to calendar events
  const events: CalendarEvent[] = nonConformances.map(nc => ({
    id: nc.id,
    title: nc.title,
    date: nc.deadline_date ? new Date(nc.deadline_date) : new Date(nc.occurrence_date),
    type: 'nonconformance',
    status: mapStatusToSeverity(nc.status),
  }));
  
  const handleViewDetails = () => {
    if (selectedEvent) {
      navigate(`/nao-conformidades/${selectedEvent.id}`);
      setDialogOpen(false);
    }
  };

  // Find the complete non-conformance object based on the selected event
  const selectedNonConformance = selectedEvent 
    ? nonConformances.find(nc => nc.id === selectedEvent.id)
    : null;

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
            <DialogTitle>Detalhes da Não Conformidade</DialogTitle>
            <DialogDescription>
              Informações completas sobre esta não conformidade.
            </DialogDescription>
          </DialogHeader>
          
          {selectedNonConformance && (
            <div className="space-y-4 pt-4">
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{selectedNonConformance.title}</h3>
                  <Badge className={getStatusBadgeColor(selectedNonConformance.status)}>
                    {selectedNonConformance.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{selectedNonConformance.code}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Departamento</p>
                  <p>{selectedNonConformance.department?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Categoria</p>
                  <p>{selectedNonConformance.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Data de Ocorrência</p>
                  <p>{format(new Date(selectedNonConformance.occurrence_date), 'dd/MM/yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Prazo</p>
                  <p>{selectedNonConformance.deadline_date 
                    ? format(new Date(selectedNonConformance.deadline_date), 'dd/MM/yyyy')
                    : 'Sem prazo definido'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Responsável</p>
                  <p>{selectedNonConformance.responsible_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Auditor</p>
                  <p>{selectedNonConformance.auditor_name}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Descrição</p>
                <p className="text-sm mt-1">{selectedNonConformance.description || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Ações Imediatas</p>
                <p className="text-sm mt-1">{selectedNonConformance.immediate_actions || '-'}</p>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleViewDetails}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Ver Detalhes
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NonConformanceCalendarView;
