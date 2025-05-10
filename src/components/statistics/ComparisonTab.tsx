
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InteractiveChart } from "@/components/reports/InteractiveChart";
import { DataItem } from "@/components/charts/types";
import { useState } from "react";

interface ComparisonTabProps {
  hasData: boolean;
  comparisonData: DataItem[];
}

export const ComparisonTab = ({ hasData, comparisonData }: ComparisonTabProps) => {
  const [period1, setPeriod1] = useState("2025-1");
  const [period2, setPeriod2] = useState("2024-2");
  
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Comparativo Entre Períodos</CardTitle>
          <CardDescription>Análise comparativa de não conformidades</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div>
              <Select value={period1} onValueChange={setPeriod1}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Período 1" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025-1">2025 - 1º Semestre</SelectItem>
                  <SelectItem value="2024-2">2024 - 2º Semestre</SelectItem>
                  <SelectItem value="2024-1">2024 - 1º Semestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={period2} onValueChange={setPeriod2}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Período 2" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025-1">2025 - 1º Semestre</SelectItem>
                  <SelectItem value="2024-2">2024 - 2º Semestre</SelectItem>
                  <SelectItem value="2024-1">2024 - 1º Semestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Comparar</Button>
          </div>
          {hasData ? (
            <div className="h-[400px]">
              <InteractiveChart
                title=""
                data={comparisonData}
                type="bar"
                dataKey={period1}
                height={400}
              />
            </div>
          ) : (
            <div className="flex justify-center items-center h-[400px] text-muted-foreground">
              Sem dados suficientes para comparação
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
