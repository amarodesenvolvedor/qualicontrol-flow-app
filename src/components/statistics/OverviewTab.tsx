
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InteractiveChart } from "@/components/reports/InteractiveChart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { DataItem } from "@/components/charts/types";

interface OverviewTabProps {
  isLoading: boolean;
  hasData: boolean;
  departmentStats: DataItem[];
  statusStats: DataItem[];
  monthlyStats: DataItem[];
}

export const OverviewTab = ({
  isLoading,
  hasData,
  departmentStats,
  statusStats,
  monthlyStats
}: OverviewTabProps) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="grid gap-6">
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    );
  }
  
  if (!hasData) {
    return (
      <Card className="rounded-xl shadow">
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
    <div className="grid gap-6 animate-fade-in">
      {/* Horizontal Bar Chart for Departments - Full Width */}
      <Card className="w-full rounded-xl shadow hover:shadow-md transition-all duration-300">
        <CardHeader>
          <CardTitle>Não Conformidades por Departamento</CardTitle>
          <CardDescription>Distribuição atual por área</CardDescription>
        </CardHeader>
        <CardContent className="pt-2 overflow-x-auto">
          <div className="min-h-[400px] min-w-[600px]">
            <InteractiveChart
              title=""
              data={departmentStats}
              type="bar"
              layout="horizontal"
              height={400}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Two Charts Side by Side (or Stacked on Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Pie Chart */}
        <Card className="rounded-xl shadow hover:shadow-md transition-all duration-300">
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
        
        {/* Monthly Bar Chart */}
        <Card className="rounded-xl shadow hover:shadow-md transition-all duration-300">
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
    </div>
  );
};
