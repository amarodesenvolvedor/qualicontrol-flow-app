
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LabelList } from "recharts";
import { DataItem } from "./types";
import { CHART_COLORS } from "./ChartColors";

interface PieChartProps {
  data: DataItem[];
  dataKey?: string;
  height: number;
  onItemClick: (data: DataItem) => void;
  type: string; // Keeping this for consistency with the chart component interface
}

export const PieChartComponent = ({ 
  data, 
  dataKey = "value", 
  height, 
  onItemClick 
}: PieChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height} className="animate-fade-in">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          fill="#8884d8"
          paddingAngle={3}
          dataKey={dataKey}
          onClick={onItemClick}
          label={({ name, value }) => `${value}`}
          labelLine={true}
          cursor="pointer"
          animationBegin={0}
          animationDuration={1200}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} 
              stroke="#ffffff"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: any, name: string) => [value, name]} 
          contentStyle={{ 
            borderRadius: '12px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: 'none'
          }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36} 
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
