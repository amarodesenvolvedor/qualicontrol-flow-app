
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, BarChart3, PieChart, LineChart, Download, Send, Plus } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

interface CustomReportBuilderProps {
  onGenerateReport: (config: ReportConfig) => void;
}

export interface ReportConfig {
  title: string;
  dateRange: {
    start?: Date;
    end?: Date;
  };
  filters: {
    departments: string[];
    status: string[];
    category: string[];
  };
  groupBy: string;
  chartType: "bar" | "pie" | "line";
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? (
                      format(fromDate, "dd/MM/yyyy")
                    ) : (
                      <span>Selecionar data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Data Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? (
                      format(toDate, "dd/MM/yyyy")
                    ) : (
                      <span>Selecionar data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    locale={ptBR}
                    disabled={(date) => 
                      fromDate ? date < fromDate : false
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label>Tipo de Gráfico</Label>
            <div className="flex space-x-2 mt-2">
              <Button 
                variant={reportConfig.chartType === "bar" ? "default" : "outline"}
                size="sm"
                onClick={() => setReportConfig({...reportConfig, chartType: "bar"})}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Barras
              </Button>
              <Button 
                variant={reportConfig.chartType === "pie" ? "default" : "outline"}
                size="sm"
                onClick={() => setReportConfig({...reportConfig, chartType: "pie"})}
              >
                <PieChart className="mr-2 h-4 w-4" />
                Pizza
              </Button>
              <Button 
                variant={reportConfig.chartType === "line" ? "default" : "outline"}
                size="sm"
                onClick={() => setReportConfig({...reportConfig, chartType: "line"})}
              >
                <LineChart className="mr-2 h-4 w-4" />
                Linha
              </Button>
            </div>
          </div>

          <div>
            <Label>Agrupar por</Label>
            <Select 
              value={reportConfig.groupBy}
              onValueChange={(value) => setReportConfig({...reportConfig, groupBy: value})}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione um campo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="department">Departamento</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="category">Categoria</SelectItem>
                <SelectItem value="month">Mês</SelectItem>
                <SelectItem value="responsible">Responsável</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
