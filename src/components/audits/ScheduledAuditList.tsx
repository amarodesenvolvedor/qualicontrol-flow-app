
import { useState } from 'react';
import { ScheduledAudit } from '@/types/audit';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Calendar, Check, Clock, Edit, MoreHorizontal, Trash2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useScheduledAudits } from '@/hooks/useScheduledAudits';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface ScheduledAuditListProps {
  scheduledAudits: ScheduledAudit[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

export const ScheduledAuditList = ({ 
  scheduledAudits, 
  isLoading, 
  onDelete, 
  onStatusChange 
}: ScheduledAuditListProps) => {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { getWeekDates } = useScheduledAudits();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'programada':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Programada</Badge>;
      case 'agendada':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Agendada</Badge>;
      case 'concluida':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Concluída</Badge>;
      case 'atrasada':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Atrasada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatWeekDate = (weekNumber: number, year: number) => {
    try {
      const { startDate, endDate } = getWeekDates(year, weekNumber);
      return `${format(startDate, 'dd/MM')} - ${format(endDate, 'dd/MM/yyyy')}`;
    } catch (error) {
      console.error(`Erro ao formatar data da semana ${weekNumber}/${year}:`, error);
      return `Semana ${weekNumber}`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (scheduledAudits.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/10">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
        <h3 className="mt-4 text-lg font-semibold">Nenhuma auditoria programada</h3>
        <p className="text-muted-foreground">
          Clique em "Nova Auditoria Programada" para adicionar a primeira.
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Departamento</TableHead>
            <TableHead>Auditor Responsável</TableHead>
            <TableHead>Semana</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scheduledAudits.map((audit) => (
            <TableRow key={audit.id} className={audit.status === 'atrasada' ? 'bg-red-50' : ''}>
              <TableCell className="font-medium">{audit.department?.name}</TableCell>
              <TableCell>{audit.responsible_auditor}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                  <span>Semana {audit.week_number} ({formatWeekDate(audit.week_number, audit.year)})</span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(audit.status)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Ações</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onStatusChange(audit.id, 'programada')}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Marcar como Programada
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(audit.id, 'agendada')}>
                      <Clock className="mr-2 h-4 w-4" />
                      Marcar como Agendada
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(audit.id, 'concluida')}>
                      <Check className="mr-2 h-4 w-4" />
                      Marcar como Concluída
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setConfirmDelete(audit.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta auditoria programada? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (confirmDelete) {
                  onDelete(confirmDelete);
                  setConfirmDelete(null);
                }
              }}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
