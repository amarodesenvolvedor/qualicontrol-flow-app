import { useState } from "react";
import Layout from "@/components/app/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNonConformances } from "@/hooks/useNonConformances";
import { useNavigate } from "react-router-dom";
import { InteractiveChart, DataItem } from "@/components/reports/InteractiveChart";

const StatisticsPage = () => {
  const navigate = useNavigate();
  const { nonConformances, isLoading, refetch } = useNonConformances();
  
  const [selectedYear, setSelectedYear] = useState("2025");

  // Generate data for department chart from actual data
  const generateDepartmentData = () => {
    const departmentMap = new Map();
    const departmentIds = new Map();
    const departmentDescriptions = new Map();
    
    nonConformances.forEach(nc => {
      const deptName = nc.department?.name || "Não especificado";
      if (!departmentMap.has(deptName)) {
        departmentMap.set(deptName, 0);
        departmentIds.set(deptName, []);
        departmentDescriptions.set(deptName, []);
      }
      departmentMap.set(deptName, departmentMap.get(deptName) + 1);
      departmentIds.get(deptName).push(nc.id);
      departmentDescriptions.get(deptName).push(nc.title);
    });
    
    return Array.from(departmentMap.entries()).map(([name, value]) => ({
      name,
      value,
      id: departmentIds.get(name),
      descriptions: departmentDescriptions.get(name)
    }));
  };

  // Generate data for status chart
  const generateStatusData = () => {
    const statusMap = new Map();
    const statusIds = new Map();
    const statusDescriptions = new Map();
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
        statusDescriptions.set(statusName, []);
      }
      statusMap.set(statusName, statusMap.get(statusName) + 1);
      statusIds.get(statusName).push(nc.id);
      statusDescriptions.get(statusName).push(nc.title);
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
        descriptions: statusDescriptions.get(name),
        color: statusColors[statusKey as keyof typeof statusColors]
      };
    });
  };

  // Generate monthly data
  const generateMonthlyData = () => {
    // Use real data if available, otherwise fall back to mock data
    if (!nonConformances.length) {
      return monthlyData.map(item => ({
        name: item.month,
        value: item.quantidade
      }));
    }
    
    const monthlyMap = new Map();
    const monthlyIds = new Map();
    const monthlyDescriptions = new Map();
    
    // Initialize all months
    const months = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", 
      "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];
    
    months.forEach(month => {
      monthlyMap.set(month, 0);
      monthlyIds.set(month, []);
      monthlyDescriptions.set(month, []);
    });
    
    // Count non-conformances by month
    nonConformances.forEach(nc => {
      const date = new Date(nc.occurrence_date);
      const month = months[date.getMonth()];
      
      monthlyMap.set(month, monthlyMap.get(month) + 1);
      monthlyIds.get(month).push(nc.id);
      monthlyDescriptions.get(month).push(nc.title);
    });
    
    return Array.from(monthlyMap.entries()).map(([month, quantidade]) => ({
      name: month,
      value: quantidade,
      id: monthlyIds.get(month),
      descriptions: monthlyDescriptions.get(month)
    }));
  };

  // Mock data if no real data is available
  const departmentData: DataItem[] = [
    { name: 'Produção', value: 35 },
    { name: 'Qualidade', value: 20 },
    { name: 'Logística', value: 15 },
    { name: 'Manutenção', value: 25 },
    { name: 'Administrativo', value: 5 },
  ];

  const statusData: DataItem[] = [
    { name: 'Abertas', value: 45 },
    { name: 'Em análise', value: 30 },
    { name: 'Concluídas', value: 25 },
  ];

  const monthlyData = [
    { month: 'Jan', quantidade: 12 },
    { month: 'Fev', quantidade: 19 },
    { month: 'Mar', quantidade: 8 },
    { month: 'Abr', quantidade: 15 },
    { month: 'Mai', quantidade: 22 },
    { month: 'Jun', quantidade: 14 },
    { month: 'Jul', quantidade: 7 },
    { month: 'Ago', quantidade: 10 },
    { month: 'Set', quantidade: 13 },
    { month: 'Out', quantidade: 17 },
    { month: 'Nov', quantidade: 9 },
    { month: 'Dez', quantidade: 11 },
  ];
  
  // Convert multi-series data format for trend charts
  const generateTrendData = (): DataItem[] => {
    return [
      { name: "Jan", value: 4, Críticas: 4, Normais: 8 },
      { name: "Fev", value: 3, Críticas: 3, Normais: 16 },
      { name: "Mar", value: 2, Críticas: 2, Normais: 6 },
      { name: "Abr", value: 5, Críticas: 5, Normais: 10 },
      { name: "Mai", value: 6, Críticas: 6, Normais: 16 },
      { name: "Jun", value: 2, Críticas: 2, Normais: 12 }
    ];
  };

  // Convert multi-series data format for comparison charts
  const generateComparisonData = (): DataItem[] => {
    return [
      { name: "Produção", value: 25, "2025-1": 25, "2024-2": 18 },
      { name: "Qualidade", value: 14, "2025-1": 14, "2024-2": 12 },
      { name: "Logística", value: 9, "2025-1": 9, "2024-2": 11 },
      { name: "Manutenção", value: 16, "2025-1": 16, "2024-2": 15 }
    ];
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    // In a real app, we'd fetch data for the selected year
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Não Conformidades por Departamento</CardTitle>
                  <CardDescription>Distribuição atual por área</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <InteractiveChart
                    title=""
                    data={nonConformances.length > 0 ? generateDepartmentData() : departmentData}
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
                    data={nonConformances.length > 0 ? generateStatusData() : statusData}
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
                    data={generateMonthlyData()}
                    type="bar"
                    dataKey="value"
                    height={300}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="trends">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tendência de Não Conformidades</CardTitle>
                  <CardDescription>Evolução anual por categoria</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-[400px]">
                    <InteractiveChart
                      title=""
                      data={generateTrendData()}
                      type="line"
                      dataKey="Críticas"
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
                  <div className="h-[400px]">
                    <InteractiveChart
                      title=""
                      data={generateComparisonData()}
                      type="bar"
                      dataKey="2025-1"
                      height={400}
                    />
                  </div>
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
