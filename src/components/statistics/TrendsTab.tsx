
import { FC, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNonConformances } from "@/hooks/useNonConformances";
import { generateTrendData } from "@/components/statistics/StatisticsDataUtils";

export interface TrendsTabProps {
  selectedYear: string;
}

export const TrendsTab: FC<TrendsTabProps> = ({ selectedYear }) => {
  const { nonConformances, isLoading } = useNonConformances();
  const [trendsData, setTrendsData] = useState<any[]>([]);

  useEffect(() => {
    if (!nonConformances) return;

    // Filter by selected year
    const yearData = nonConformances.filter(nc => {
      const ncDate = new Date(nc.occurrence_date);
      return ncDate.getFullYear().toString() === selectedYear;
    });

    // Generate trend data using utility function
    const processedData = generateTrendData(yearData);
    setTrendsData(processedData);
  }, [nonConformances, selectedYear]);

  if (isLoading) {
    return <div className="p-8 text-center">Carregando dados...</div>;
  }
  
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
                <Line type="monotone" dataKey="value" name="Total" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="Pendentes" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="Em Andamento" stroke="#ec4899" strokeWidth={2} />
                <Line type="monotone" dataKey="Resolvidas" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {trendsData.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Não há dados suficientes para mostrar tendências no ano selecionado.
          </CardContent>
        </Card>
      )}
    </div>
  );
};
