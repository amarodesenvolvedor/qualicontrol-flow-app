
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Clock, Plus, Trash2, Send, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

interface ScheduledReport {
  id: string;
  name: string;
  frequency: string;
  email: string;
  reportType: string;
  active: boolean;
}

export const ScheduledReports = () => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newReport, setNewReport] = useState<Omit<ScheduledReport, "id" | "active">>({
    name: "",
    frequency: "weekly",
    email: "",
    reportType: "nonconformities",
  });

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

  const handleSubmit = () => {
    if (!newReport.name || !newReport.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const id = `${Date.now()}`;
    setScheduledReports([
      ...scheduledReports,
      { ...newReport, id, active: true }
    ]);
    
    setNewReport({
      name: "",
      frequency: "weekly",
      email: "",
      reportType: "nonconformities",
    });
    
    setIsAddingNew(false);
    
    toast({
      title: "Relatório agendado",
      description: "O relatório automático foi agendado com sucesso."
    });
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
          <Card className="mb-4 border-dashed">
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="report-name">Nome do Relatório</Label>
                  <Input 
                    id="report-name" 
                    placeholder="Ex: Relatório Semanal de Não Conformidades"
                    value={newReport.name}
                    onChange={(e) => setNewReport({...newReport, name: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="report-type">Tipo de Relatório</Label>
                    <Select 
                      value={newReport.reportType}
                      onValueChange={(value) => setNewReport({...newReport, reportType: value})}
                    >
                      <SelectTrigger id="report-type" className="mt-1">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nonconformities">Não Conformidades</SelectItem>
                        <SelectItem value="actions">Ações Corretivas</SelectItem>
                        <SelectItem value="audits">Auditorias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="frequency">Frequência</Label>
                    <Select 
                      value={newReport.frequency}
                      onValueChange={(value) => setNewReport({...newReport, frequency: value})}
                    >
                      <SelectTrigger id="frequency" className="mt-1">
                        <SelectValue placeholder="Selecione a frequência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="quarterly">Trimestral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email para envio</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="email@empresa.com"
                    value={newReport.email}
                    onChange={(e) => setNewReport({...newReport, email: e.target.value})}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSubmit}>
                    <Send className="mr-2 h-4 w-4" />
                    Agendar Relatório
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="space-y-2">
          {scheduledReports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum relatório agendado. Clique em "Novo Agendamento" para criar um.
            </div>
          ) : (
            scheduledReports.map(report => (
              <Card key={report.id} className="p-4 hover:bg-muted/10">
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
                      onCheckedChange={() => toggleReportStatus(report.id)}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteReport(report.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
