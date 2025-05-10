
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, Send } from "lucide-react";
import { DateRangeSelector } from "./filters/DateRangeSelector";
import { ChartTypeSelector } from "./filters/ChartTypeSelector";
import { GroupBySelector } from "./filters/GroupBySelector";
import { toast } from "@/components/ui/use-toast";
import { ReportConfig } from "./types";

interface CustomReportBuilderProps {
  onGenerateReport: (config: ReportConfig) => void;
}

export const CustomReportBuilder = ({ onGenerateReport }: CustomReportBuilderProps) => {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    title: "Relatório Personalizado",
    dateRange: {},
    filters: {
      departments: [],
      status: [],
      category: [],
    },
    groupBy: "department",
    chartType: "bar",
  });

  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  const handleGenerateReport = () => {
    const config = {
      ...reportConfig,
      dateRange: {
        start: fromDate,
        end: toDate
      }
    };
    
    onGenerateReport(config);
    toast({
      title: "Relatório gerado",
      description: `O relatório "${reportConfig.title}" foi gerado com sucesso.`,
    });
  };

  const handleScheduleReport = () => {
    toast({
      title: "Relatório agendado",
      description: `O relatório "${reportConfig.title}" será enviado periodicamente.`,
    });
  };

  const updateChartType = (type: "bar" | "pie" | "line") => {
    setReportConfig({...reportConfig, chartType: type});
  };

  const updateGroupBy = (value: string) => {
    setReportConfig({...reportConfig, groupBy: value});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurar Relatório Personalizado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="report-title">Título do Relatório</Label>
            <Input 
              id="report-title" 
              placeholder="Insira um título para o relatório"
              value={reportConfig.title}
              onChange={(e) => setReportConfig({
                ...reportConfig,
                title: e.target.value
              })}
            />
          </div>

          <DateRangeSelector 
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
          />

          <ChartTypeSelector 
            selectedType={reportConfig.chartType}
            onChange={updateChartType}
          />

          <GroupBySelector 
            value={reportConfig.groupBy}
            onChange={updateGroupBy}
          />

          <div className="flex justify-between mt-4 space-x-2">
            <Button 
              variant="default" 
              onClick={handleGenerateReport}
              className="flex-1"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Button>
            <Button 
              variant="outline"
              onClick={handleScheduleReport}
            >
              <Send className="mr-2 h-4 w-4" />
              Agendar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
