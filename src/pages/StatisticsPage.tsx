
import Layout from "@/components/app/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { PieChart as RechartsSimplePieChart, BarChart, Bar, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const departmentData = [
  { name: 'Produção', value: 35 },
  { name: 'Qualidade', value: 20 },
  { name: 'Logística', value: 15 },
  { name: 'Manutenção', value: 25 },
  { name: 'Administrativo', value: 5 },
];

const statusData = [
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

const chartConfig = {
  primary: {
    theme: {
      light: "#0088FE",
      dark: "#0088FE"
    }
  },
  secondary: {
    theme: {
      light: "#00C49F",
      dark: "#00C49F"
    }
  },
  tertiary: {
    theme: {
      light: "#FFBB28",
      dark: "#FFBB28"
    }
  },
};

const StatisticsPage = () => {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Gráficos e Estatísticas</h1>
          <div className="flex items-center gap-2">
            <Select defaultValue="2025">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
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
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <RechartsSimplePieChart data={departmentData}>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </RechartsSimplePieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Status das Não Conformidades</CardTitle>
                  <CardDescription>Distribuição por status atual</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <RechartsSimplePieChart data={statusData}>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </RechartsSimplePieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle>Não Conformidades Mensais</CardTitle>
                  <CardDescription>Quantidade registrada por mês</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <BarChart
                      data={monthlyData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="quantidade" name="Quantidade" fill="#0088FE" />
                    </BarChart>
                  </ChartContainer>
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
                    <p className="text-center text-muted-foreground py-8">
                      Selecione um período específico para visualizar a tendência de não conformidades.
                    </p>
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
                  <div className="h-[400px]">
                    <p className="text-center text-muted-foreground py-8">
                      Selecione dois períodos para gerar um comparativo de não conformidades.
                    </p>
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
