
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScheduledAudit } from "@/types/audit";
import { getStatusBadgeColor, getStatusDisplayName } from "../utils/statusUtils";

interface ScheduledAuditDetailsProps {
  audit: ScheduledAudit;
  getWeekDates: (year: number, weekNumber: number) => { 
    startDate: Date;
    endDate: Date;
  };
}

export const ScheduledAuditDetails = ({ audit, getWeekDates }: ScheduledAuditDetailsProps) => {
  const { startDate, endDate } = getWeekDates(
    audit.year, 
    audit.week_number
  );
  
  return (
    <div className="space-y-4 pt-4">
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Auditoria: {audit.department?.name}
          </h3>
          <Badge className={getStatusBadgeColor(audit.status)}>
            {getStatusDisplayName(audit.status)}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">Departamento</p>
          <p>{audit.department?.name || '-'}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Semana</p>
          <p>Semana {audit.week_number} ({format(startDate, 'dd/MM')} - {format(endDate, 'dd/MM/yyyy')})</p>
        </div>
        <div>
          <p className="text-sm font-medium">Auditor Responsável</p>
          <p>{audit.responsible_auditor || '-'}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Criado em</p>
          <p>{format(new Date(audit.created_at), 'dd/MM/yyyy')}</p>
        </div>
      </div>
      
      {audit.notes && (
        <div>
          <p className="text-sm font-medium">Observações</p>
          <p className="text-sm mt-1">{audit.notes}</p>
        </div>
      )}
    </div>
  );
};
