
import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export interface TrendsTabProps {
  selectedYear: string;
}

export const TrendsTab: FC<TrendsTabProps> = ({ selectedYear }) => {
  // Dados de exemplo para as tendências
  const trendsData = [
    { name: 'Jan', pendentes: 4, concluidas: 2, total: 6 },
    { name: 'Fev', pendentes: 3, concluidas: 4, total: 7 },
    { name: 'Mar', pendentes: 2, concluidas: 3, total: 5 },
    { name: 'Abr', pendentes: 6, concluidas: 4, total: 10 },
    { name: 'Mai', pendentes: 5, concluidas: 3, total: 8 },
    { name: 'Jun', pendentes: 7, concluidas: 5, total: 12 }
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tendências - {selectedYear}</h2>
      
      <Card className="w-full shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Evolução de Não Conformidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="pendentes" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="concluidas" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Análise de Tendências</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Análise das tendências para o ano de {selectedYear}:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Observa-se um aumento constante no número total de não conformidades.</li>
              <li>A taxa de resolução manteve um crescimento gradual durante os meses.</li>
              <li>Os departamentos com maior incidência foram: Produção, Qualidade e Logística.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
