
import Layout from "@/components/app/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSpreadsheet, FileText, Download, ArrowUpDown } from "lucide-react";
import { CalendarIcon as CalendarLucide } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";
import { useNonConformances } from "@/hooks/useNonConformances";
import { useAuditReports } from "@/hooks/useAuditReports";
import { Toaster } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";

const ExportPage = () => {
  const [exportFormat, setExportFormat] = useState<string>("excel");
  const [dateRange, setDateRange] = useState<string>("month");
  const [year, setYear] = useState<string>("2025");
  const [date, setDate] = useState<Date>();
  const [includeFields, setIncludeFields] = useState({
    status: true,
    description: true,
    responsible: true,
    deadline: true,
    category: true
  });

  const { nonConformances } = useNonConformances();
  const { auditReports } = useAuditReports();

  const handleExport = (reportType: string) => {
    toast.success(`Exportação iniciada: ${reportType}`, {
      description: `Gerando relatório em formato ${exportFormat === 'excel' ? 'Excel' : 'PDF'}.`
    });

    setTimeout(() => {
      // Create a sample file download based on report type
      const content = `# ${reportType}\nData gerada: ${new Date().toLocaleString()}\n${JSON.stringify({
        format: exportFormat,
        dateRange,
        year,
        includeFields
      }, null, 2)}`;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType.replace(/\s+/g, '_')}_${dateRange}_${year}.${exportFormat === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`${reportType} exportado com sucesso!`);
    }, 1500);
  };

  const handleFieldToggle = (field: keyof typeof includeFields) => {
    setIncludeFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Layout>
      <Toaster position="top-right" />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Exportar Dados</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Opções de Exportação</CardTitle>
                <CardDescription>Configure as opções para exportar seus dados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Formato</h3>
                  <Tabs value={exportFormat} onValueChange={setExportFormat}>
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="excel">Excel</TabsTrigger>
                      <TabsTrigger value="pdf">PDF</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Período de Dados</h3>
                  <Tabs value={dateRange} onValueChange={setDateRange}>
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger value="month">Mês</TabsTrigger>
                      <TabsTrigger value="quarter">Trimestre</TabsTrigger>
                      <TabsTrigger value="year">Ano</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Ano de Referência</h3>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Data Específica</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PP", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {exportFormat === 'excel' && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Campos a incluir</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="status" 
                            checked={includeFields.status}
                            onCheckedChange={() => handleFieldToggle('status')}
                          />
                          <label htmlFor="status" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Status</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="description" 
                            checked={includeFields.description}
                            onCheckedChange={() => handleFieldToggle('description')}
                          />
                          <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Descrição</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="responsible" 
                            checked={includeFields.responsible}
                            onCheckedChange={() => handleFieldToggle('responsible')}
                          />
                          <label htmlFor="responsible" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Responsável</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="deadline" 
                            checked={includeFields.deadline}
                            onCheckedChange={() => handleFieldToggle('deadline')}
                          />
                          <label htmlFor="deadline" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Prazo</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="category" 
                            checked={includeFields.category}
                            onCheckedChange={() => handleFieldToggle('category')}
                          />
                          <label htmlFor="category" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Categoria</label>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Disponíveis</CardTitle>
                <CardDescription>Selecione o relatório que deseja exportar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ExportItem 
                  title="Não Conformidades Completo" 
                  description={`Relatório completo com todos os dados de não conformidades (${nonConformances.length} registros)`}
                  icon={<FileSpreadsheet className="h-6 w-6" />}
                  tag="Completo"
                  onExport={() => handleExport("Não Conformidades Completo")}
                />
                
                <ExportItem 
                  title="Ações Corretivas" 
                  description="Listagem de todas as ações corretivas e seus status"
                  icon={<FileText className="h-6 w-6" />}
                  tag="Detalhado"
                  onExport={() => handleExport("Ações Corretivas")}
                />
                
                <ExportItem 
                  title="Indicadores de Desempenho" 
                  description="KPIs e métricas de desempenho relacionadas às não conformidades"
                  icon={<ArrowUpDown className="h-6 w-6" />}
                  tag="Indicadores"
                  onExport={() => handleExport("Indicadores de Desempenho")}
                />
                
                <ExportItem 
                  title="Cronograma de Auditorias" 
                  description={`Planejamento de auditorias e seus respectivos resultados (${auditReports.length} registros)`}
                  icon={<CalendarIcon className="h-6 w-6" />}
                  tag="Agenda"
                  onExport={() => handleExport("Cronograma de Auditorias")}
                />
              </CardContent>
              <CardFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Exportar Todos os Relatórios
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Exportar todos os relatórios?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta operação irá exportar todos os relatórios disponíveis no formato selecionado. 
                        Pode levar algum tempo para completar.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleExport("Todos os Relatórios")}>
                        Exportar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface ExportItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  tag: string;
  onExport: () => void;
}

const ExportItem = ({ title, description, icon, tag, onExport }: ExportItemProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50">
      <div className="flex items-center gap-4">
        <div className="rounded-md bg-primary/10 p-2 text-primary">
          {icon}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline">{tag}</Badge>
        <Button variant="ghost" size="icon" onClick={onExport}>
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ExportPage;
