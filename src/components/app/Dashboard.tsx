
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { PieChart, BarChart, Bar, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, LineChart, Line, AreaChart, Area } from "recharts";
import { FileText, Plus, Clock, AlertCircle, Search, Filter, TrendingUp, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNonConformances } from "@/hooks/useNonConformances";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { TooltipProvider, Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Modern color palette
const COLORS = {
  primary: "#0ea5e9",
  secondary: "#10b981",
  warning: "#f59e0b", 
  danger: "#ef4444",
  info: "#8b5cf6",
  completed: "#10b981",
  inProgress: "#f59e0b",
  critical: "#ef4444",
  pending: "#3B82F6",
  bgLight: "#F8FAFC",
  bgDark: "#0F172A",
}

const Dashboard = () => {
  const { nonConformances, isLoading, refetch } = useNonConformances();
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [animateValues, setAnimateValues] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Prepare data based on real non-conformances
  const statusData = [
    { name: "Concluídas", value: nonConformances.filter(nc => nc.status === "closed").length, color: COLORS.completed },
    { name: "Em Andamento", value: nonConformances.filter(nc => nc.status === "in-progress").length, color: COLORS.inProgress },
    { name: "Críticas", value: nonConformances.filter(nc => nc.status === "pending" && isUrgent(nc)).length, color: COLORS.critical },
    { name: "Pendentes", value: nonConformances.filter(nc => nc.status === "pending" && !isUrgent(nc)).length, color: COLORS.pending },
  ];

  // Group by department
  const departmentsMap = {};
  nonConformances.forEach(nc => {
    const deptName = nc.department?.name || "Sem departamento";
    departmentsMap[deptName] = (departmentsMap[deptName] || 0) + 1;
  });
  
  const departmentData = Object.entries(departmentsMap)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => Number(b.total) - Number(a.total));

  // Monthly trend data
  const monthlyData = prepareMonthlyData(nonConformances);

  // Recent items
  const recentItems = nonConformances
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Total counts for KPIs
  const totalCount = nonConformances.length;
  const openCount = nonConformances.filter(nc => nc.status !== "closed").length;
  const criticalCount = nonConformances.filter(nc => nc.status === "pending" && isUrgent(nc)).length;
  const dueCount = nonConformances.filter(nc => isApproachingDeadline(nc)).length;

  // Animation effect for counts
  useEffect(() => {
    setAnimateValues(true);
  }, []);

  // Helper function to check if a non-conformance is urgent (created in the last 7 days)
  function isUrgent(nc) {
    const createdDate = new Date(nc.occurrence_date);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 7;
  }

  // Helper function to check if a non-conformance is approaching deadline (within next 7 days)
  function isApproachingDeadline(nc) {
    if (!nc.deadline_date) return false;
    const deadlineDate = new Date(nc.deadline_date);
    const now = new Date();
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }

  // Helper function to prepare monthly data
  function prepareMonthlyData(data) {
    const months = {};
    const now = new Date();
    // Initialize with last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleString('pt-BR', { month: 'short' });
      months[monthKey] = { name: monthKey, pending: 0, inProgress: 0, completed: 0, total: 0 };
    }

    // Fill with actual data
    data.forEach(nc => {
      const date = new Date(nc.occurrence_date);
      const monthKey = date.toLocaleString('pt-BR', { month: 'short' });
      if (months[monthKey]) {
        months[monthKey].total += 1;
        
        if (nc.status === "pending") {
          months[monthKey].pending += 1;
        } else if (nc.status === "in-progress") {
          months[monthKey].inProgress += 1;
        } else {
          months[monthKey].completed += 1;
        }
      }
    });

    return Object.values(months);
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`space-y-6 transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das não conformidades e indicadores principais.
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                  <label htmlFor="dark-mode" className="text-sm">Modo escuro</label>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Alternar entre modo claro e escuro</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>

          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os períodos</SelectItem>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mês</SelectItem>
              <SelectItem value="quarter">Último trimestre</SelectItem>
            </SelectContent>
          </Select>
          
          <Button asChild>
            <Link to="/nao-conformidades/nova">
              <Plus className="mr-2 h-4 w-4" /> Nova Não Conformidade
            </Link>
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover transition-all hover:shadow-md hover:-translate-y-1 duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${animateValues ? 'animate-fade-in' : ''}`}>
              {totalCount}
            </div>
            <p className="text-xs text-muted-foreground">Não conformidades registradas</p>
            <div className="mt-2 h-1 w-full bg-muted">
              <div className="h-1 bg-primary" style={{ width: `100%` }}></div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover transition-all hover:shadow-md hover:-translate-y-1 duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Em Aberto</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${animateValues ? 'animate-fade-in' : ''}`}>
              {openCount}
            </div>
            <p className="text-xs text-muted-foreground">Não conformidades em análise</p>
            <div className="mt-2 h-1 w-full bg-muted">
              <div className="h-1 bg-amber-500" style={{ width: `${totalCount ? (openCount / totalCount) * 100 : 0}%` }}></div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover transition-all hover:shadow-md hover:-translate-y-1 duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Críticas</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${animateValues ? 'animate-fade-in' : ''}`}>
              {criticalCount}
            </div>
            <p className="text-xs text-muted-foreground">Requerem ação imediata</p>
            <div className="mt-2 h-1 w-full bg-muted">
              <div className="h-1 bg-destructive" style={{ width: `${totalCount ? (criticalCount / totalCount) * 100 : 0}%` }}></div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover transition-all hover:shadow-md hover:-translate-y-1 duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">A Vencer</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${animateValues ? 'animate-fade-in' : ''}`}>
              {dueCount}
            </div>
            <p className="text-xs text-muted-foreground">Prazos próximos</p>
            <div className="mt-2 h-1 w-full bg-muted">
              <div className="h-1 bg-blue-500" style={{ width: `${totalCount ? (dueCount / totalCount) * 100 : 0}%` }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="animate-pulse w-16 h-16 rounded-full bg-muted"></div>
            <p className="mt-4 text-muted-foreground">Carregando dados...</p>
          </CardContent>
        </Card>
      ) : nonConformances.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">Nenhuma não conformidade registrada</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Registre uma nova não conformidade para visualizar os dados.
            </p>
            <Button className="mt-4" asChild>
              <Link to="/nao-conformidades/nova">
                <Plus className="mr-2 h-4 w-4" /> Nova Não Conformidade
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Visão Geral
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Tendências
            </TabsTrigger>
            <TabsTrigger value="deptAnalysis" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" /> Análise por Departamento
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Distribution */}
              <Card className="col-span-1 transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle>Distribuição por Status</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        cornerRadius={4}
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color} 
                            stroke="#ffffff"
                            strokeWidth={2}
                            className="transition-all hover:opacity-80"
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} não conformidades`, '']}
                        contentStyle={{ 
                          borderRadius: '8px',
                          padding: '10px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          border: 'none'
                        }}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Department Distribution */}
              <Card className="col-span-1 transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle>Não Conformidades por Departamento</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} não conformidades`, '']}
                        contentStyle={{ 
                          borderRadius: '8px',
                          padding: '10px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          border: 'none'
                        }}
                      />
                      <Bar 
                        dataKey="total" 
                        fill={COLORS.primary}
                        radius={[4, 4, 0, 0]} 
                        barSize={30}
                        className="transition-all hover:opacity-80"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-4">
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>Evolução Mensal de Não Conformidades</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px',
                        padding: '10px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        border: 'none'
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stackId="1" 
                      stroke={COLORS.primary} 
                      fill={COLORS.primary + "80"}
                      activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pending" 
                      stackId="2" 
                      stroke={COLORS.pending} 
                      fill={COLORS.pending + "80"}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="inProgress" 
                      stackId="2" 
                      stroke={COLORS.inProgress} 
                      fill={COLORS.inProgress + "80"}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="completed" 
                      stackId="2" 
                      stroke={COLORS.completed} 
                      fill={COLORS.completed + "80"}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="deptAnalysis" className="space-y-4">
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <CardTitle>Análise por Departamento</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Ajustar visualização:</span>
                    <Slider
                      defaultValue={[75]}
                      max={100}
                      step={5}
                      className="w-[100px]"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left bg-muted/60">
                      <tr>
                        <th className="p-2 font-medium">Departamento</th>
                        <th className="p-2 font-medium">Total</th>
                        <th className="p-2 font-medium">Abertas</th>
                        <th className="p-2 font-medium">Concluídas</th>
                        <th className="p-2 font-medium">Taxa de Resolução</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentData.map((dept, index) => {
                        const deptName = dept.name;
                        const deptTotal = dept.total;
                        const deptOpen = nonConformances.filter(nc => 
                          (nc.department?.name === deptName) && nc.status !== "closed"
                        ).length;
                        const deptClosed = deptTotal - deptOpen;
                        const resolutionRate = deptTotal ? Math.round((deptClosed / deptTotal) * 100) : 0;
                        
                        return (
                          <tr key={index} className="border-b hover:bg-muted/30">
                            <td className="p-2 font-medium">{deptName}</td>
                            <td className="p-2">{deptTotal}</td>
                            <td className="p-2">{deptOpen}</td>
                            <td className="p-2">{deptClosed}</td>
                            <td className="p-2">
                              <div className="flex items-center">
                                <div className="w-full bg-muted h-2 rounded-full mr-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      resolutionRate > 66 ? 'bg-green-500' : 
                                      resolutionRate > 33 ? 'bg-amber-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${resolutionRate}%` }}
                                  ></div>
                                </div>
                                <span>{resolutionRate}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Recent Items */}
      {nonConformances.length > 0 && (
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle>Não Conformidades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left bg-muted/60">
                  <tr>
                    <th className="p-2 font-medium">ID</th>
                    <th className="p-2 font-medium">Título</th>
                    <th className="p-2 font-medium">Departamento</th>
                    <th className="p-2 font-medium">Status</th>
                    <th className="p-2 font-medium">Data</th>
                    <th className="p-2 font-medium">Prazo</th>
                  </tr>
                </thead>
                <tbody>
                  {recentItems.map((item) => {
                    const statusMap = {
                      "closed": { label: "Concluído", class: "bg-green-100 text-green-800 border-green-200" },
                      "in-progress": { label: "Em Andamento", class: "bg-amber-100 text-amber-800 border-amber-200" },
                      "pending": { label: "Pendente", class: "bg-blue-100 text-blue-800 border-blue-200" }
                    };
                    const itemStatus = statusMap[item.status] || { label: item.status, class: "" };
                    const isItemCritical = item.status === "pending" && isUrgent(item);

                    return (
                      <tr key={item.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-2">{item.code}</td>
                        <td className="p-2 font-medium">
                          <Link to={`/nao-conformidades/${item.id}`} className="hover:text-primary transition-colors">
                            {item.title}
                          </Link>
                          {isItemCritical && (
                            <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 border-red-200">
                              Crítico
                            </Badge>
                          )}
                        </td>
                        <td className="p-2">{item.department?.name}</td>
                        <td className="p-2">
                          <Badge variant="outline" className={`${itemStatus.class}`}>
                            {itemStatus.label}
                          </Badge>
                        </td>
                        <td className="p-2">{new Date(item.occurrence_date).toLocaleDateString('pt-BR')}</td>
                        <td className="p-2">{item.deadline_date ? new Date(item.deadline_date).toLocaleDateString('pt-BR') : '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" asChild>
                <Link to="/nao-conformidades">Ver todas</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
