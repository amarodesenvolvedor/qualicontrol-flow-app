
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Send } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface NewReportFormProps {
  onSubmit: (report: {
    name: string;
    frequency: string;
    email: string;
    reportType: string;
  }) => void;
}

export const NewReportForm = ({ onSubmit }: NewReportFormProps) => {
  const [newReport, setNewReport] = useState({
    name: "",
    frequency: "weekly",
    email: "",
    reportType: "nonconformities",
  });

  const handleSubmit = () => {
    if (!newReport.name || !newReport.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    onSubmit(newReport);
    
    setNewReport({
      name: "",
      frequency: "weekly",
      email: "",
      reportType: "nonconformities",
    });
    
    toast({
      title: "Relatório agendado",
      description: "O relatório automático foi agendado com sucesso."
    });
  };

  return (
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
  );
};
