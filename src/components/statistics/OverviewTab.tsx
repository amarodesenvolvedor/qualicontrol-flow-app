
import { FC, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useNonConformances } from "@/hooks/useNonConformances";
import { NonConformance } from "@/types/nonConformance";

export interface OverviewTabProps {
  selectedYear: string;
}

export const OverviewTab: FC<OverviewTabProps> = ({ selectedYear }) => {
  const { nonConformances, isLoading } = useNonConformances();
  const [overviewData, setOverviewData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    total: 0,
    monthlyAvg: 0
  });

  useEffect(() => {
    if (!nonConformances) return;

    // Filter non-conformances by selected year
    const yearData = nonConformances.filter(nc => {
      const ncDate = new Date(nc.occurrence_date);
      return ncDate.getFullYear().toString() === selectedYear;
    });

    // Process monthly data
    const monthlyData: {[key: string]: number} = {};
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    months.forEach(month => {
      monthlyData[month] = 0;
    });

    yearData.forEach(nc => {
      const date = new Date(nc.occurrence_date);
      const monthIdx = date.getMonth();
      const monthName = months[monthIdx];
      monthlyData[monthName] = (monthlyData[monthName] || 0) + 1;
    });

    const formattedData = Object.keys(monthlyData).map(month => ({
      name: month,
      value: monthlyData[month]
    }));

    setOverviewData(formattedData);

    // Calculate stats
    const pending = yearData.filter(nc => nc.status === 'pending').length;
    const inProgress = yearData.filter(nc => nc.status === 'in-progress').length;
    const completed = yearData.filter(nc => 
      nc.status === 'resolved' || nc.status === 'closed'
    ).length;

    setStats({
      pending,
      inProgress,
      completed,
      total: yearData.length,
      monthlyAvg: yearData.length > 0 ? +(yearData.length / 12).toFixed(1) : 0
    });

  }, [nonConformances, selectedYear]);

  if (isLoading) {
    return <div className="p-8 text-center">Carregando dados...</div>;
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Visão Geral - {selectedYear}</h2>
      
      <Card className="w-full shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Não Conformidades por Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overviewData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Totais por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Pendentes</span>
                <span className="font-bold">{stats.pending}</span>
              </div>
              <div className="flex justify-between">
                <span>Em Andamento</span>
                <span className="font-bold">{stats.inProgress}</span>
              </div>
              <div className="flex justify-between">
                <span>Concluídas</span>
                <span className="font-bold">{stats.completed}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total de Não Conformidades</span>
                <span className="font-bold">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Média Mensal</span>
                <span className="font-bold">{stats.monthlyAvg}</span>
              </div>
              <div className="flex justify-between">
                <span>% Resolvidas</span>
                <span className="font-bold">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
