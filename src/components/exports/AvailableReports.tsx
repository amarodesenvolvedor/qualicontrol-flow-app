
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown, Calendar, Download, FileSpreadsheet, FileText } from "lucide-react";
import ExportItem from "./ExportItem";

interface AvailableReportsProps {
  nonConformancesCount: number;
  auditReportsCount: number;
  handleExport: (reportType: string) => Promise<void>;
}

export const AvailableReports = ({ nonConformancesCount, auditReportsCount, handleExport }: AvailableReportsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatórios Disponíveis</CardTitle>
        <CardDescription>Selecione o relatório que deseja exportar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ExportItem 
          title="Não Conformidades Completo" 
          description={`Relatório completo com todos os dados de não conformidades (${nonConformancesCount} registros)`}
          icon={<FileSpreadsheet className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
          count={nonConformancesCount}
          onExport={() => handleExport("Não Conformidades Completo")}
        />
        
        <ExportItem 
          title="Ações Corretivas" 
          description="Listagem de todas as ações corretivas e seus status"
          icon={<FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
          count={nonConformancesCount}
          onExport={() => handleExport("Ações Corretivas")}
        />
        
        <ExportItem 
          title="Indicadores de Desempenho" 
          description="KPIs e métricas de desempenho relacionadas às não conformidades"
          icon={<ArrowUpDown className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
          count={nonConformancesCount}
          onExport={() => handleExport("Indicadores de Desempenho")}
        />
        
        <ExportItem 
          title="Cronograma de Auditorias" 
          description={`Planejamento de auditorias e seus respectivos resultados (${auditReportsCount} registros)`}
          icon={<Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
          count={auditReportsCount}
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
  );
};
