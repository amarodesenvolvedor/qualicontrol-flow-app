
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  BarChart, Bar, Cell, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { DataItem } from "./types";

interface ChartProps {
  data: DataItem[];
  type: "bar" | "pie" | "line";
  dataKey?: string;
  height: number;
  onItemClick: (data: DataItem) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ff7300', '#a4de6c'];

const chartConfig = {
  primary: { theme: { light: "#0088FE", dark: "#0088FE" } },
  secondary: { theme: { light: "#00C49F", dark: "#00C49F" } },
  tertiary: { theme: { light: "#FFBB28", dark: "#FFBB28" } },
};

// Pie Chart Component
export const PieChartComponent = ({ data, dataKey = "value", height, onItemClick }: ChartProps) => (
  <ChartContainer config={chartConfig} className={`h-[${height}px]`}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={2}
        dataKey={dataKey}
        onClick={onItemClick}
        label={({ name, percent }: { name: string; percent: number }) => 
          `${name}: ${(percent * 100).toFixed(0)}%`
        }
        cursor="pointer"
      >
        {data.map((entry, index) => (
          <Cell 
            key={`cell-${index}`} 
            fill={entry.color || COLORS[index % COLORS.length]} 
          />
        ))}
      </Pie>
      <ChartTooltip />
      <Legend />
    </PieChart>
  </ChartContainer>
);

// Line Chart Component
export const LineChartComponent = ({ data, dataKey = "value", height, onItemClick }: ChartProps) => {
  // For LineChart activeDot handling
  const handleActiveDotClick = (props: any) => {
    if (props && props.payload) {
      onItemClick(props.payload);
    }
  };
  
  return (
    <ChartContainer config={chartConfig} className={`h-[${height}px]`}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke="#0088FE"
          activeDot={{ 
            onClick: handleActiveDotClick, 
            r: 8, 
            cursor: "pointer" 
          }}
        />
      </LineChart>
    </ChartContainer>
  );
};

// Bar Chart Component
export const BarChartComponent = ({ data, dataKey = "value", height, onItemClick }: ChartProps) => (
  <ChartContainer config={chartConfig} className={`h-[${height}px]`}>
    <BarChart
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar 
        dataKey={dataKey} 
        fill="#0088FE" 
        onClick={onItemClick}
        cursor="pointer"
      >
        {data.map((entry, index) => (
          <Cell 
            key={`cell-${index}`} 
            fill={entry.color || COLORS[index % COLORS.length]} 
          />
        ))}
      </Bar>
    </BarChart>
  </ChartContainer>
);
