
import { useState } from "react";
import Layout from "@/components/app/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DownloadIcon, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNonConformances } from "@/hooks/useNonConformances";
import { CustomReportBuilder, ReportConfig } from "@/components/reports/CustomReportBuilder";
import { InteractiveChart } from "@/components/reports/InteractiveChart";
import { ScheduledReports } from "@/components/reports/ScheduledReports";

const ReportsPage = () => {
  const { getNonConformances } = useNonConformances();
  const { data: nonConformances = [], isLoading, refetch } = getNonConformances;
  const [activeTab, setActiveTab] = useState("standard");
  const [customReportData, setCustomReportData] = useState<any[]>([]);
  const [reportConfig, setReportConfig] = useState<ReportConfig | null>(null);

  // For demo purposes - transform nonConformances into chart data
  const generateDepartmentData = () => {
    const departmentMap = new Map();
    const departmentIds = new Map();
    
    nonConformances.forEach(nc => {
      const deptName = nc.department?.name || "Não especificado";
      if (!departmentMap.has(deptName)) {
        departmentMap.set(deptName, 0);
        departmentIds.set(deptName, []);
      }
      departmentMap.set(deptName, departmentMap.get(deptName) + 1);
      departmentIds.get(deptName).push(nc.id);
    });
    
    return Array.from(departmentMap.entries()).map(([name, value]) => ({
      name,
      value,
      id: departmentIds.get(name)
    }));
  };

  const generateStatusData = () => {
    const statusMap = new Map();
    const statusIds = new Map();
    const statusColors = {
      'pending': '#3B82F6',
      'in-progress': '#FBBF24',
      'completed': '#10B981',
      'critical': '#EF4444'
    };
    
    nonConformances.forEach(nc => {
      const statusName = nc.status === 'pending' ? 'Pendente' :
                         nc.status === 'in-progress' ? 'Em Andamento' :
                         nc.status === 'completed' ? 'Concluído' :
                         nc.status === 'critical' ? 'Crítico' : nc.status;
      
      if (!statusMap.has(statusName)) {
        statusMap.set(statusName, 0);
        statusIds.set(statusName, []);
      }
      statusMap.set(statusName, statusMap.get(statusName) + 1);
      statusIds.get(statusName).push(nc.id);
    });
    
    return Array.from(statusMap.entries()).map(([name, value]) => {
      const statusKey = name === 'Pendente' ? 'pending' :
                        name === 'Em Andamento' ? 'in-progress' :
                        name === 'Concluído' ? 'completed' :
                        name === 'Crítico' ? 'critical' : '';
                        
      return {
        name,
        value,
        id: statusIds.get(name),
        color: statusColors[statusKey as keyof typeof statusColors]
      };
    });
  };

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
    setActiveTab("custom");
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="standard">Relatórios Padrão</TabsTrigger>
            <TabsTrigger value="custom">Relatórios Personalizados</TabsTrigger>
            <TabsTrigger value="scheduled">Relatórios Agendados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ReportCard 
                title="Não Conformidades por Departamento" 
                description="Relatório detalhado por departamento"
                type="Mensal"
                updatedAt="10/05/2025"
              />
              
              <ReportCard 
                title="Não Conformidades por Tipo" 
                description="Análise por categorias de não conformidade"
                type="Trimestral"
                updatedAt="05/05/2025"
              />
              
              <ReportCard 
                title="Status de Não Conformidades" 
                description="Visão geral do status atual"
                type="Semanal"
                updatedAt="09/05/2025"
              />
              
              <ReportCard 
                title="Tempo de Resolução" 
                description="Análise de tempo de resposta e resolução"
                type="Mensal"
                updatedAt="01/05/2025"
              />
              
              <ReportCard 
                title="Não Conformidades por Gravidade" 
                description="Classificação por níveis de criticidade"
                type="Trimestral"
                updatedAt="15/04/2025"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="custom">
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
          </TabsContent>
          
          <TabsContent value="scheduled">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <ScheduledReports />
              </div>
              <div className="md:col-span-2">
                <div className="space-y-4">
                  <InteractiveChart 
                    title="Não Conformidades por Departamento" 
                    data={generateDepartmentData()}
                    type="pie"
                    height={350}
                  />
                  <InteractiveChart 
                    title="Status das Não Conformidades" 
                    data={generateStatusData()}
                    type="bar"
                    height={350}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

interface ReportCardProps {
  title: string;
  description: string;
  type: string;
  updatedAt: string;
}

const ReportCard = ({ title, description, type, updatedAt }: ReportCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge variant="outline">{type}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Atualizado em: {updatedAt}
          </span>
          <Button size="sm">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Baixar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsPage;
