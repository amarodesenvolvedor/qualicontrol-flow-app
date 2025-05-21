
import React from "react";
import { Bar, BarChart, CartesianGrid, Label, Legend, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { ChartTooltipContent } from "./ChartTooltipContent";
import { DataItem, GroupingType, chartConfig } from "./chartUtils";
import { getDataKeys } from "@/components/charts/BarChart/utils";

interface ChartComponentProps {
  chartData: DataItem[];
  groupingType: GroupingType;
  height: number;
}

export const ChartComponent = ({ 
  chartData, 
  groupingType,
  height 
}: ChartComponentProps) => {
  // Calculate chart width based on data length
  const chartWidth = Math.max(800, chartData.length * 80);

  // Get data keys for the chart
  const dataKeys = getDataKeys(chartData, "total").filter(key => 
    ["pending", "inProgress", "closed"].includes(key)
  );

  return (
    <div className="overflow-x-auto">
      <div style={{ width: chartWidth, minHeight: height }}>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 100 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              interval={0}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            >
              <Label 
                value="Requisito ISO" 
                position="insideBottom" 
                offset={-10} 
                fill="#6b7280" 
              />
            </XAxis>
            <YAxis 
              tick={{ fill: '#6b7280' }}
            >
              <Label 
                value="Quantidade" 
                angle={-90} 
                position="insideLeft" 
                style={{ textAnchor: 'middle' }} 
                fill="#6b7280" 
              />
            </YAxis>
            <ChartTooltip 
              content={(props) => (
                <ChartTooltipContent {...props} groupingType={groupingType} />
              )}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value: string) => {
                const valueMap: Record<string, string> = {
                  "pending": "Pendentes",
                  "inProgress": "Em Andamento",
                  "closed": "Concluídas"
                };
                return valueMap[value] || value;
              }}
            />
            
            {dataKeys.map((key) => (
              <Bar 
                key={key}
                dataKey={key}
                name={
                  key === "pending" ? "Pendentes" : 
                  key === "inProgress" ? "Em Andamento" : 
                  "Concluídas"
                }
                stackId="stack"
                fill={
                  key === "pending" ? "#3b82f6" : 
                  key === "inProgress" ? "#f59e0b" : 
                  "#10b981"
                }
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};
