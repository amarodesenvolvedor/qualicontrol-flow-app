
import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export interface OverviewTabProps {
  selectedYear: string;
}

export const OverviewTab: FC<OverviewTabProps> = ({ selectedYear }) => {
  // Dados de exemplo para a visão geral
  const overviewData = [
    { name: 'Jan', value: 4 },
    { name: 'Fev', value: 7 },
    { name: 'Mar', value: 5 },
    { name: 'Abr', value: 10 },
    { name: 'Mai', value: 8 },
    { name: 'Jun', value: 12 }
  ];
  
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
                <span className="font-bold">24</span>
              </div>
              <div className="flex justify-between">
                <span>Em Andamento</span>
                <span className="font-bold">15</span>
              </div>
              <div className="flex justify-between">
                <span>Concluídas</span>
                <span className="font-bold">32</span>
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
                <span className="font-bold">71</span>
              </div>
              <div className="flex justify-between">
                <span>Média Mensal</span>
                <span className="font-bold">11.8</span>
              </div>
              <div className="flex justify-between">
                <span>% Resolvidas</span>
                <span className="font-bold">45%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
