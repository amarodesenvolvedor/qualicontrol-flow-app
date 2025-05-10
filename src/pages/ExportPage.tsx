
import Layout from "@/components/app/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSpreadsheet, FileText, Download, Calendar, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const ExportPage = () => {
  const [exportFormat, setExportFormat] = useState<string>("excel");
  const [dateRange, setDateRange] = useState<string>("month");
  const { toast } = useToast();

  const handleExport = (reportType: string) => {
    toast({
      title: "Exportação iniciada",
      description: `Exportando ${reportType} em formato ${exportFormat === 'excel' ? 'Excel' : 'CSV'}.`,
    });
  };

  return (
    <Layout>
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
                      <TabsTrigger value="csv">CSV</TabsTrigger>
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
                  <Select defaultValue="2025">
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
                  description="Relatório completo com todos os dados de não conformidades"
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
                  description="Planejamento de auditorias e seus respectivos resultados"
                  icon={<Calendar className="h-6 w-6" />}
                  tag="Agenda"
                  onExport={() => handleExport("Cronograma de Auditorias")}
                />
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleExport("Todos os Relatórios")}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Todos os Relatórios
                </Button>
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
