
import { format } from "date-fns";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuditReport } from "@/types/audit";
import { getStatusBadgeColor, getStatusDisplayName } from "../utils/statusUtils";

interface AuditReportDetailsProps {
  audit: AuditReport;
  onDownload: () => void;
}

export const AuditReportDetails = ({ audit, onDownload }: AuditReportDetailsProps) => {
  return (
    <div className="space-y-4 pt-4">
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{audit.title}</h3>
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
          <p className="text-sm font-medium">Data da Auditoria</p>
          <p>{format(new Date(audit.audit_date), 'dd/MM/yyyy')}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Criado em</p>
          <p>{format(new Date(audit.created_at), 'dd/MM/yyyy')}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Auditor Responsável</p>
          <p>{audit.responsible_auditor || '-'}</p>
        </div>
      </div>
      
      <div>
        <p className="text-sm font-medium">Descrição</p>
        <p className="text-sm mt-1">{audit.description || '-'}</p>
      </div>
      
      <div>
        <p className="text-sm font-medium">Arquivo</p>
        <div className="flex items-center mt-1">
          <FileText className="h-4 w-4 mr-2" />
          <span className="text-sm">{audit.file_name}</span>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={onDownload}>
          Baixar Relatório
        </Button>
      </div>
    </div>
  );
};
