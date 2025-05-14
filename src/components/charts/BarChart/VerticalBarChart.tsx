
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, LabelList } from "recharts";
import { DataItem } from "../types";
import { CHART_COLORS } from "../ChartColors";
import { getDataKeys, shouldRenderGroupedBars } from "./utils";

interface VerticalBarChartProps {
  data: DataItem[];
  dataKey?: string;
  height: number;
  onItemClick: (data: DataItem) => void;
}

export const VerticalBarChart = ({ 
  data, 
  dataKey = "value", 
  height, 
  onItemClick 
}: VerticalBarChartProps) => {
  // Get data keys for the chart
  const dataKeys = getDataKeys(data, dataKey);
  
  // Standard margins for vertical charts
  const margins = { top: 20, right: 30, left: 20, bottom: 60 };
  
  // If we have multiple data series, render grouped bars
  if (shouldRenderGroupedBars(dataKeys, dataKey)) {
    return (
      <ResponsiveContainer width="100%" height={height} className="animate-fade-in">
        <BarChart
          data={data}
          margin={margins}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
            angle={-45}
            textAnchor="end"
            height={60}
          >
            <Label value="Categoria" offset={-15} position="insideBottom" fill="#6b7280" />
          </XAxis>
          <YAxis 
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
          >
            <Label value="Quantidade" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="#6b7280" />
          </YAxis>
          <Tooltip 
            formatter={(value: any, name: string) => [value, name]} 
            contentStyle={{ 
              borderRadius: '12px', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: 'none'
            }}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            iconType="circle" 
          />
          
          {dataKeys.map((key, index) => (
            <Bar 
              key={key}
              dataKey={key} 
              fill={CHART_COLORS[index % CHART_COLORS.length]} 
              onClick={onItemClick}
              cursor="pointer"
              radius={[4, 4, 0, 0]}
              animationDuration={1200}
              animationBegin={index * 150}
              name={key}
            >
              <LabelList dataKey={key} position="top" style={{ fill: '#6b7280', fontSize: 10 }} />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }
  
  // For a single data series, render bars with individual colors
  return (
    <ResponsiveContainer width="100%" height={height} className="animate-fade-in">
      <BarChart
        data={data}
        margin={margins}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="name" 
          stroke="#6b7280"
          tick={{ fill: '#6b7280' }}
          angle={-45}
          textAnchor="end"
          height={60}
        >
          <Label value="Categoria" offset={-15} position="insideBottom" fill="#6b7280" />
        </XAxis>
        <YAxis 
          stroke="#6b7280"
          tick={{ fill: '#6b7280' }}
        >
          <Label value="Quantidade" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="#6b7280" />
        </YAxis>
        <Tooltip 
          formatter={(value: any) => [value, 'Quantidade']} 
          contentStyle={{ 
            borderRadius: '12px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: 'none'
          }}
        />
        <Legend 
          verticalAlign="top" 
          height={36}
          iconType="circle" 
        />
        <Bar 
          dataKey={dataKey} 
          name="Quantidade"
          onClick={onItemClick}
          cursor="pointer"
          radius={[4, 4, 0, 0]}
          animationDuration={1200}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} 
            />
          ))}
          <LabelList dataKey={dataKey} position="top" style={{ fill: '#6b7280', fontSize: 10 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
