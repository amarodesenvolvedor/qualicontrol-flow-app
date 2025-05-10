
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { CustomReportBuilder } from "@/components/reports/CustomReportBuilder";
import { InteractiveChart } from "@/components/reports/InteractiveChart";
import type { DataItem } from "@/components/charts/types";
import { ReportConfig } from "@/components/reports/types";

interface CustomReportTabProps {
  nonConformances: any[];
}

export const CustomReportTab = ({ nonConformances }: CustomReportTabProps) => {
  const [customReportData, setCustomReportData] = useState<DataItem[]>([]);
  const [reportConfig, setReportConfig] = useState<ReportConfig | null>(null);

  const generateCustomReport = (config: ReportConfig) => {
    setReportConfig(config);
    
    // Apply filters based on config
    let filteredData = [...nonConformances];
    
    // Date range filter
    if (config.dateRange.start || config.dateRange.end) {
      filteredData = filteredData.filter(nc => {
        const date = new Date(nc.occurrence_date);
        if (config.dateRange.start && date < config.dateRange.start) return false;
        if (config.dateRange.end) {
          const endDate = new Date(config.dateRange.end);
          endDate.setHours(23, 59, 59, 999); // End of the selected day
          if (date > endDate) return false;
        }
        return true;
      });
    }
    
    // Group by selected field
    const groupedData = new Map();
    const groupedIds = new Map();
    
    filteredData.forEach(nc => {
      let groupKey;
      
      switch (config.groupBy) {
        case 'department':
          groupKey = nc.department?.name || "Não especificado";
          break;
        case 'status':
          groupKey = nc.status === 'pending' ? 'Pendente' :
                    nc.status === 'in-progress' ? 'Em Andamento' :
                    nc.status === 'completed' ? 'Concluído' : 
                    nc.status === 'critical' ? 'Crítico' : 
                    nc.status;
          break;
        case 'category':
          groupKey = nc.category || "Não categorizado";
          break;
        case 'responsible':
          groupKey = nc.responsible_name || "Não atribuído";
          break;
        case 'month': {
          const date = new Date(nc.occurrence_date);
          groupKey = date.toLocaleString('pt-BR', { month: 'long' });
          break;
        }
        default:
          groupKey = "Outros";
      }
      
      if (!groupedData.has(groupKey)) {
        groupedData.set(groupKey, 0);
        groupedIds.set(groupKey, []);
      }
      groupedData.set(groupKey, groupedData.get(groupKey) + 1);
      groupedIds.get(groupKey).push(nc.id);
    });
    
    const chartData = Array.from(groupedData.entries()).map(([name, value]) => ({
      name,
      value,
      id: groupedIds.get(name)
    }));
    
    setCustomReportData(chartData);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1">
        <CustomReportBuilder onGenerateReport={generateCustomReport} />
      </div>
      <div className="md:col-span-2">
        {customReportData.length > 0 && reportConfig ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{reportConfig.title}</CardTitle>
                <CardDescription>
                  {reportConfig.dateRange.start && reportConfig.dateRange.end ? (
                    `Período: ${reportConfig.dateRange.start.toLocaleDateString()} - ${reportConfig.dateRange.end.toLocaleDateString()}`
                  ) : "Todos os registros"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InteractiveChart 
                  title={`Análise por ${reportConfig.groupBy === 'department' ? 'Departamento' : 
                                reportConfig.groupBy === 'status' ? 'Status' :
                                reportConfig.groupBy === 'category' ? 'Categoria' :
                                reportConfig.groupBy === 'responsible' ? 'Responsável' :
                                reportConfig.groupBy === 'month' ? 'Mês' : reportConfig.groupBy}`}
                  data={customReportData}
                  type={reportConfig.chartType}
                  height={350}
                />
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Exportar Relatório
              </Button>
            </div>
          </div>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-2">
                Configure e gere um relatório personalizado utilizando o painel ao lado.
              </p>
              <p className="text-sm text-muted-foreground">
                Você pode filtrar por período, agrupar por diferentes categorias e escolher o tipo de visualização.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
