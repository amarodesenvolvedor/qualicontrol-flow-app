
import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export interface ComparisonTabProps {
  selectedYear: string;
}

export const ComparisonTab: FC<ComparisonTabProps> = ({ selectedYear }) => {
  // Dados de exemplo para comparação entre anos
  const comparisonData = [
    { name: 'Produção', atual: 24, anterior: 18 },
    { name: 'Qualidade', atual: 14, anterior: 12 },
    { name: 'Logística', atual: 9, anterior: 11 },
    { name: 'Manutenção', atual: 16, anterior: 15 }
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Comparação - {selectedYear}</h2>
      
      <Card className="w-full shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Comparativo entre {selectedYear} e {parseInt(selectedYear) - 1}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="atual" name={`${selectedYear}`} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="anterior" name={`${parseInt(selectedYear) - 1}`} fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Análise Comparativa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Comparação com o ano anterior ({parseInt(selectedYear) - 1}):</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h3 className="font-bold mb-2">Melhorias</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Redução de 15% em não conformidades críticas</li>
                  <li>Tempo médio de resolução reduzido em 3 dias</li>
                  <li>Maior taxa de conformidade no departamento de Logística</li>
                </ul>
              </div>
              <div className="border rounded-md p-4">
                <h3 className="font-bold mb-2">Pontos de Atenção</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Aumento de 22% em não conformidades na Produção</li>
                  <li>Taxa de recorrência cresceu 8%</li>
                  <li>Requisito 8.5.1 com maior incidência pelo segundo ano</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
