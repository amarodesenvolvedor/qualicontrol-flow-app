
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </div>
    );
  }
  
  if (!hasData) {
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
