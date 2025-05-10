
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { NewReportForm } from "./scheduled/NewReportForm";
import { ReportItem } from "./scheduled/ReportItem";
import { ScheduledReport } from "./types";

export const ScheduledReports = () => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([
    {
      id: "1",
      name: "Relatório Semanal de Não Conformidades",
      frequency: "weekly",
      email: "coordenador@empresa.com",
      reportType: "nonconformities",
      active: true
    },
    {
      id: "2",
      name: "Relatório Mensal de Auditorias",
      frequency: "monthly",
      email: "diretoria@empresa.com",
      reportType: "audits",
      active: true
    }
  ]);

  const handleSubmit = (newReportData: Omit<ScheduledReport, "id" | "active">) => {
    const id = `${Date.now()}`;
    setScheduledReports([
      ...scheduledReports,
      { ...newReportData, id, active: true }
    ]);
    setIsAddingNew(false);
  };

  const toggleReportStatus = (id: string) => {
    setScheduledReports(
      scheduledReports.map(report =>
        report.id === id ? { ...report, active: !report.active } : report
      )
    );
  };

  const deleteReport = (id: string) => {
    setScheduledReports(scheduledReports.filter(report => report.id !== id));
    toast({
      title: "Relatório removido",
      description: "O relatório automático foi removido com sucesso."
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Relatórios Agendados</CardTitle>
        <Button 
          size="sm" 
          onClick={() => setIsAddingNew(!isAddingNew)}
        >
          {isAddingNew ? (
            <>
              <X className="mr-2 h-4 w-4" /> Cancelar
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Novo Agendamento
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {isAddingNew && (
          <NewReportForm onSubmit={handleSubmit} />
        )}
        
        <div className="space-y-2">
          {scheduledReports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum relatório agendado. Clique em "Novo Agendamento" para criar um.
            </div>
          ) : (
            scheduledReports.map(report => (
              <ReportItem 
                key={report.id}
                report={report}
                onToggleStatus={toggleReportStatus}
                onDelete={deleteReport}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
