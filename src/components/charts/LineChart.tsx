
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, LabelList } from "recharts";
import { DataItem } from "./types";
import { CHART_COLORS } from "./ChartColors";

interface LineChartProps {
  data: DataItem[];
  dataKey?: string;
  height: number;
  onItemClick: (data: DataItem) => void;
  type: string; // Keeping this for consistency with the chart component interface
}

export const LineChartComponent = ({ 
  data, 
  dataKey = "value", 
  height, 
  onItemClick 
}: LineChartProps) => {
  // Para LineChart, tratamento do activeDot
  const handleActiveDotClick = (props: any) => {
    if (props && props.payload) {
      onItemClick(props.payload);
    }
  };
  
  // Encontrar todas as chaves de dados exceto "name" para criar múltiplas linhas
  const excludedKeys = ['name', 'id', 'descriptions', 'percentage', 'color'];
  const dataKeys = data.length > 0 
    ? Object.keys(data[0]).filter(key => !excludedKeys.includes(key))
    : [dataKey];
  
  return (
    <ResponsiveContainer width="100%" height={height} className="animate-fade-in">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="name" 
          stroke="#6b7280"
          tick={{ fill: '#6b7280' }}
        >
          <Label value="Período" offset={-15} position="insideBottom" fill="#6b7280" />
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
        
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            name={key === dataKey ? "Quantidade" : key}
            stroke={CHART_COLORS[index % CHART_COLORS.length]}
            activeDot={{ 
              onClick: handleActiveDotClick, 
              r: 8, 
              cursor: "pointer",
              stroke: "#fff",
              strokeWidth: 2
            }}
            strokeWidth={2}
            dot={{ stroke: CHART_COLORS[index % CHART_COLORS.length], strokeWidth: 2, fill: '#fff', r: 4 }}
            animationDuration={1200}
            animationBegin={index * 150}
          >
            <LabelList dataKey={key} position="top" style={{ fill: '#6b7280', fontSize: 10 }} />
          </Line>
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
