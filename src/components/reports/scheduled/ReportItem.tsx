
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Clock, Trash2 } from "lucide-react";
import { ScheduledReport } from "../types";

interface ReportItemProps {
  report: ScheduledReport;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ReportItem = ({ report, onToggleStatus, onDelete }: ReportItemProps) => {
  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "daily": return "Diário";
      case "weekly": return "Semanal";
      case "monthly": return "Mensal";
      case "quarterly": return "Trimestral";
      default: return frequency;
    }
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case "nonconformities": return "Não Conformidades";
      case "actions": return "Ações Corretivas";
      case "audits": return "Auditorias";
      default: return type;
    }
  };

  return (
    <Card className="p-4 hover:bg-muted/10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-medium">{report.name}</h4>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {getFrequencyLabel(report.frequency)} • {getReportTypeLabel(report.reportType)}
            </span>
          </div>
          <div className="text-sm">{report.email}</div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={report.active}
            onCheckedChange={() => onToggleStatus(report.id)}
          />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onDelete(report.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
