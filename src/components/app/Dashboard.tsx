
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, BarChart, Bar, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Link } from "react-router-dom";
import { FileText, Plus, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data
const statusData = [
  { name: "Concluídas", value: 25, color: "#10B981" },
  { name: "Em Andamento", value: 14, color: "#FBBF24" },
  { name: "Críticas", value: 7, color: "#EF4444" },
  { name: "Pendentes", value: 4, color: "#3B82F6" },
];

const departmentData = [
  { name: "Produção", total: 15 },
  { name: "Manutenção", total: 12 },
  { name: "Qualidade", total: 8 },
  { name: "Segurança", total: 7 },
  { name: "Logística", total: 6 },
  { name: "Compras", total: 2 },
];

const recentItems = [
  {
    id: "NC-2023-045",
    title: "Falha no sistema de refrigeração",
    status: "critical",
    department: "Manutenção",
    date: "10/05/2023",
    dueDate: "20/05/2023"
  },
  {
    id: "NC-2023-044",
    title: "Produto fora de especificação",
    status: "in-progress",
    department: "Qualidade",
    date: "09/05/2023",
    dueDate: "18/05/2023"
  },
  {
    id: "NC-2023-043",
    title: "Falta de EPI no setor de produção",
    status: "in-progress",
    department: "Segurança",
    date: "08/05/2023",
    dueDate: "15/05/2023"
  },
  {
    id: "NC-2023-042",
    title: "Documentação incompleta",
    status: "completed",
    department: "Qualidade",
    date: "07/05/2023",
    dueDate: "14/05/2023"
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das não conformidades e indicadores principais.
          </p>
        </div>
        <Button asChild>
          <Link to="/nao-conformidades/nova">
            <Plus className="mr-2 h-4 w-4" /> Nova Não Conformidade
          </Link>
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50</div>
            <p className="text-xs text-muted-foreground">Não conformidades registradas</p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Em Aberto</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">Não conformidades em análise</p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Críticas</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Requerem ação imediata</p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">A Vencer</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Prazos próximos</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Análise</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Distribution */}
            <Card className="col-span-1">
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
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Distribution */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Não Conformidades por Departamento</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-7">
              <CardHeader>
                <CardTitle>Análise Detalhada</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Visualização detalhada de análise a ser implementada na próxima versão.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Items */}
      <Card>
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
                {recentItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/30">
                    <td className="p-2">{item.id}</td>
                    <td className="p-2 font-medium">{item.title}</td>
                    <td className="p-2">{item.department}</td>
                    <td className="p-2">
                      <Badge variant="outline" className={`status-badge status-${item.status}`}>
                        {item.status === "completed" && "Concluído"}
                        {item.status === "in-progress" && "Em Andamento"}
                        {item.status === "critical" && "Crítico"}
                        {item.status === "pending" && "Pendente"}
                      </Badge>
                    </td>
                    <td className="p-2">{item.date}</td>
                    <td className="p-2">{item.dueDate}</td>
                  </tr>
                ))}
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
    </div>
  );
};

export default Dashboard;
