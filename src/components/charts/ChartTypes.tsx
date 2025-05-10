
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  BarChart, Bar, Cell, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { DataItem } from "./types";

interface ChartProps {
  data: DataItem[];
  type: "bar" | "pie" | "line";
  dataKey?: string;
  height: number;
  onItemClick: (data: DataItem) => void;
}

// Paleta de cores moderna
const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const chartConfig = {
  primary: { theme: { light: "#0ea5e9", dark: "#0ea5e9" } },
  secondary: { theme: { light: "#10b981", dark: "#10b981" } },
  tertiary: { theme: { light: "#f59e0b", dark: "#f59e0b" } },
};

// Componente de Gráfico de Pizza
export const PieChartComponent = ({ data, dataKey = "value", height, onItemClick }: ChartProps) => (
  <ResponsiveContainer width="100%" height={height}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={90}
        fill="#8884d8"
        paddingAngle={3}
        dataKey={dataKey}
        onClick={onItemClick}
        label={({ name, value }: { name: string; value: number }) => 
          `${name}: ${value}`
        }
        cursor="pointer"
        animationBegin={0}
        animationDuration={1000}
      >
        {data.map((entry, index) => (
          <Cell 
            key={`cell-${index}`} 
            fill={entry.color || COLORS[index % COLORS.length]} 
            stroke="#ffffff"
            strokeWidth={2}
          />
        ))}
      </Pie>
      <Tooltip formatter={(value: any) => [`${value}`, 'Quantidade']} />
      <Legend verticalAlign="bottom" height={36} />
    </PieChart>
  </ResponsiveContainer>
);

// Componente de Gráfico de Linha
export const LineChartComponent = ({ data, dataKey = "value", height, onItemClick }: ChartProps) => {
  // Para LineChart, tratamento do activeDot
  const handleActiveDotClick = (props: any) => {
    if (props && props.payload) {
      onItemClick(props.payload);
    }
  };
  
  // Encontrar todas as chaves de dados exceto "name" para criar múltiplas linhas
  const dataKeys = data.length > 0 
    ? Object.keys(data[0]).filter(key => key !== 'name' && key !== 'id' && key !== 'descriptions')
    : [dataKey];
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip formatter={(value: any) => [`${value}`, 'Quantidade']} />
        <Legend verticalAlign="bottom" height={36} />
        
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={COLORS[index % COLORS.length]}
            activeDot={{ 
              onClick: handleActiveDotClick, 
              r: 8, 
              cursor: "pointer",
              stroke: "#fff",
              strokeWidth: 2
            }}
            strokeWidth={2}
            animationDuration={1000}
            animationBegin={index * 150}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

// Componente de Gráfico de Barras
export const BarChartComponent = ({ data, dataKey = "value", height, onItemClick }: ChartProps) => {
  // Encontrar todas as chaves de dados exceto "name" para criar múltiplas barras
  const dataKeys = data.length > 0 
    ? Object.keys(data[0]).filter(key => key !== 'name' && key !== 'id' && key !== 'descriptions')
    : [dataKey];
  
  // Se tivermos mais de uma série de dados, renderizamos barras agrupadas
  if (dataKeys.length > 1) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip formatter={(value: any) => [`${value}`, 'Quantidade']} />
          <Legend verticalAlign="bottom" height={36} />
          
          {dataKeys.map((key, index) => (
            <Bar 
              key={key}
              dataKey={key} 
              fill={COLORS[index % COLORS.length]} 
              onClick={onItemClick}
              cursor="pointer"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
              animationBegin={index * 150}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }
  
  // Para uma única série de dados, renderizamos barras com cores individuais
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip formatter={(value: any) => [`${value}`, 'Quantidade']} />
        <Legend verticalAlign="bottom" height={36} />
        <Bar 
          dataKey={dataKey} 
          fill={COLORS[0]} 
          onClick={onItemClick}
          cursor="pointer"
          radius={[4, 4, 0, 0]}
          animationDuration={1000}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || COLORS[index % COLORS.length]} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
