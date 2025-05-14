
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, LabelList } from "recharts";
import { DataItem } from "../types";
import { CHART_COLORS } from "../ChartColors";
import { getDataKeys, shouldRenderGroupedBars } from "./utils";

interface HorizontalBarChartProps {
  data: DataItem[];
  dataKey?: string;
  height: number;
  onItemClick: (data: DataItem) => void;
}

export const HorizontalBarChart = ({ 
  data, 
  dataKey = "value", 
  height, 
  onItemClick 
}: HorizontalBarChartProps) => {
  // Get data keys for the chart
  const dataKeys = getDataKeys(data, dataKey);
  
  // Standard margins for horizontal charts - increase left margin for longer department names
  const margins = { top: 20, right: 30, left: 150, bottom: 20 };
  
  // If we have multiple data series, render grouped bars
  if (shouldRenderGroupedBars(dataKeys, dataKey)) {
    return (
      <ResponsiveContainer width="100%" height={height} className="animate-fade-in">
        <BarChart
          layout="vertical"
          data={data}
          margin={margins}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#e5e7eb" />
          <XAxis 
            type="number"
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
          >
            <Label value="Quantidade" offset={-15} position="insideBottom" fill="#6b7280" />
          </XAxis>
          <YAxis 
            type="category"
            dataKey="name" 
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
            width={140}
          />
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
              radius={[0, 4, 4, 0]}
              animationDuration={1200}
              animationBegin={index * 150}
              name={key}
            >
              <LabelList dataKey={key} position="right" style={{ fill: '#6b7280', fontSize: 10 }} />
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
        layout="vertical"
        data={data}
        margin={margins}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#e5e7eb" />
        <XAxis 
          type="number"
          stroke="#6b7280"
          tick={{ fill: '#6b7280' }}
        >
          <Label value="Quantidade" offset={-15} position="insideBottom" fill="#6b7280" />
        </XAxis>
        <YAxis 
          type="category"
          dataKey="name" 
          stroke="#6b7280"
          tick={{ fill: '#6b7280' }}
          width={140} 
        />
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
          radius={[0, 4, 4, 0]}
          animationDuration={1200}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} 
            />
          ))}
          <LabelList dataKey={dataKey} position="right" style={{ fill: '#6b7280', fontSize: 10 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
