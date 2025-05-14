
import { format } from "date-fns";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NonConformance } from "@/types/nonConformance";

interface DetailsTabProps {
  nonConformance: NonConformance;
  onExportToPDF: () => void;
  onExportToExcel: () => void;
}

const DetailsTab = ({ nonConformance, onExportToPDF, onExportToExcel }: DetailsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Departamento</h3>
          <p>{nonConformance.department?.name || '-'}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Data de Ocorrência</h3>
          <p>{format(new Date(nonConformance.occurrence_date), 'dd/MM/yyyy')}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Data de Resposta</h3>
          <p>{nonConformance.response_date ? format(new Date(nonConformance.response_date), 'dd/MM/yyyy') : 'Não definida'}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Auditor</h3>
          <p>{nonConformance.auditor_name}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Responsável</h3>
          <p>{nonConformance.responsible_name}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Local</h3>
          <p>{nonConformance.location}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Criado em</h3>
          <p>{format(new Date(nonConformance.created_at), 'dd/MM/yyyy HH:mm')}</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Descrição</h3>
        <p className="mt-1">{nonConformance.description}</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Ações Imediatas Tomadas</h3>
        <p className="mt-1">{nonConformance.immediate_actions || 'Nenhuma ação registrada'}</p>
      </div>
      
      <div className="flex gap-4 pt-4">
        <Button variant="outline" onClick={onExportToPDF}>
          <FileDown className="h-4 w-4 mr-2" />
          Exportar para PDF
        </Button>
        <Button variant="outline" onClick={onExportToExcel}>
          <FileDown className="h-4 w-4 mr-2" />
          Exportar para Excel
        </Button>
      </div>
    </div>
  );
};

export default DetailsTab;
