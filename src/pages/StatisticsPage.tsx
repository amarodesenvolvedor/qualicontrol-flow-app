
import { useState } from "react";
import Layout from "@/components/app/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNonConformances } from "@/hooks/useNonConformances";
import { useNavigate } from "react-router-dom";
import { InteractiveChart } from "@/components/reports/InteractiveChart";
import { generateDepartmentData, generateStatusData, generateMonthlyData } from "@/components/reports/DataUtils";
import { Skeleton } from "@/components/ui/skeleton";

const StatisticsPage = () => {
  const navigate = useNavigate();
  const { nonConformances, isLoading, refetch } = useNonConformances();
  
  const [selectedYear, setSelectedYear] = useState("2025");

  // Gerar dados para os gráficos usando os dados reais
  const departmentStats = nonConformances.length > 0 
    ? generateDepartmentData(nonConformances)
    : [];

  const statusStats = nonConformances.length > 0 
    ? generateStatusData(nonConformances)
    : [];

  const monthlyStats = nonConformances.length > 0 
    ? generateMonthlyData(nonConformances)
    : [];

  // Converter os dados para o formato multi-série para gráficos de tendência
  const generateTrendData = () => {
    // Agrupar por mês e por status
    const monthStatusMap = new Map();
    
    nonConformances.forEach(nc => {
      const date = new Date(nc.occurrence_date);
      const month = date.toLocaleString('pt-BR', { month: 'short' });
      
      if (!monthStatusMap.has(month)) {
        monthStatusMap.set(month, {
          pending: 0,
          'in-progress': 0,
          resolved: 0,
          closed: 0
        });
      }
      
      const statusCount = monthStatusMap.get(month);
      statusCount[nc.status] = (statusCount[nc.status] || 0) + 1;
    });
    
    return Array.from(monthStatusMap.entries()).map(([month, counts]) => ({
      name: month,
      "Pendentes": counts.pending || 0,
      "Em Andamento": counts['in-progress'] || 0,
      "Resolvidas": (counts.resolved || 0) + (counts.closed || 0)
    }));
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    // Em um aplicativo real, buscaríamos dados para o ano selecionado
  };

  const renderChartContent = () => {
    if (isLoading) {
      return <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>;
    }
    
    if (nonConformances.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="mb-4 text-muted-foreground">Nenhuma não conformidade cadastrada ainda.</p>
            <Button onClick={() => navigate("/nao-conformidades/nova")}>
              Cadastrar Não Conformidade
            </Button>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Não Conformidades por Departamento</CardTitle>
            <CardDescription>Distribuição atual por área</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <InteractiveChart
              title=""
              data={departmentStats}
              type="pie"
              height={300}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Status das Não Conformidades</CardTitle>
            <CardDescription>Distribuição por status atual</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <InteractiveChart
              title=""
              data={statusStats}
              type="pie"
              height={300}
            />
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Não Conformidades Mensais</CardTitle>
            <CardDescription>Quantidade registrada por mês</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <InteractiveChart
              title=""
              data={monthlyStats}
              type="bar"
              dataKey="value"
              height={300}
            />
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Gráficos e Estatísticas</h1>
          <div className="flex items-center gap-2">
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9" onClick={() => refetch()}>
              Atualizar
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="trends">Tendências</TabsTrigger>
            <TabsTrigger value="comparison">Comparativo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            {renderChartContent()}
          </TabsContent>
          
          <TabsContent value="trends">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tendência de Não Conformidades</CardTitle>
                  <CardDescription>Evolução mensal por status</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-[400px]">
                    <InteractiveChart
                      title=""
                      data={nonConformances.length > 0 ? generateTrendData() : []}
                      type="line"
                      dataKey="Pendentes"
                      height={400}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comparativo Entre Períodos</CardTitle>
                  <CardDescription>Análise comparativa de não conformidades</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div>
                      <Select defaultValue="2025-1">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Período 1" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2025-1">2025 - 1º Semestre</SelectItem>
                          <SelectItem value="2024-2">2024 - 2º Semestre</SelectItem>
                          <SelectItem value="2024-1">2024 - 1º Semestre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select defaultValue="2024-2">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Período 2" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2025-1">2025 - 1º Semestre</SelectItem>
                          <SelectItem value="2024-2">2024 - 2º Semestre</SelectItem>
                          <SelectItem value="2024-1">2024 - 1º Semestre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button>Comparar</Button>
                  </div>
                  {nonConformances.length > 0 ? (
                    <div className="h-[400px]">
                      <InteractiveChart
                        title=""
                        data={[
                          { name: "Produção", "2025-1": 25, "2024-2": 18 },
                          { name: "Qualidade", "2025-1": 14, "2024-2": 12 },
                          { name: "Logística", "2025-1": 9, "2024-2": 11 },
                          { name: "Manutenção", "2025-1": 16, "2024-2": 15 }
                        ]}
                        type="bar"
                        dataKey="2025-1"
                        height={400}
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-[400px] text-muted-foreground">
                      Sem dados suficientes para comparação
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StatisticsPage;
