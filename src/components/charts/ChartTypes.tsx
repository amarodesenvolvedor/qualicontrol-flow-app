
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  BarChart, Bar, Cell, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LabelList, Label
} from "recharts";
import { DataItem } from "./types";
import { COLORS } from "@/components/dashboard/utils/dashboardConstants";

interface ChartProps {
  data: DataItem[];
  type: "bar" | "pie" | "line";
  dataKey?: string;
  height: number;
  layout?: "vertical" | "horizontal";
  onItemClick: (data: DataItem) => void;
}

// Definição de cores modernas para os gráficos
const CHART_COLORS = [
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#10b981", // green-500
  "#f97316", // orange-500
  "#ef4444", // red-500
  "#0ea5e9", // sky-500
  "#6366f1", // indigo-500
  "#ec4899", // pink-500
  "#14b8a6", // teal-500
  "#06b6d4", // cyan-500
];

// Componente de Gráfico de Pizza com animação e estilo moderno
export const PieChartComponent = ({ data, dataKey = "value", height, onItemClick }: ChartProps) => {
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

// Componente de Gráfico de Linha com animação e estilo moderno
export const LineChartComponent = ({ data, dataKey = "value", height, onItemClick }: ChartProps) => {
  // Para LineChart, tratamento do activeDot
  const handleActiveDotClick = (props: any) => {
    if (props && props.payload) {
      onItemClick(props.payload);
    }
  };
  
  // Encontrar todas as chaves de dados exceto "name" para criar múltiplas linhas
  const dataKeys = data.length > 0 
    ? Object.keys(data[0]).filter(key => key !== 'name' && key !== 'id' && key !== 'descriptions' && key !== 'percentage' && key !== 'color')
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

// Componente de Gráfico de Barras com suporte para layout horizontal ou vertical
export const BarChartComponent = ({ data, dataKey = "value", height, layout = "vertical", onItemClick }: ChartProps) => {
  // Lista de propriedades internas que não devem ser exibidas no gráfico
  const excludedKeys = ['name', 'id', 'descriptions', 'percentage', 'color'];
  
  // Encontrar todas as chaves de dados exceto as excluídas para criar múltiplas barras
  const dataKeys = data.length > 0 
    ? Object.keys(data[0]).filter(key => !excludedKeys.includes(key))
    : [dataKey];
  
  // Determinar se é um gráfico de barras horizontais
  const isHorizontal = layout === "horizontal";
  
  // Preparar as margens com base na orientação
  const margins = isHorizontal 
    ? { top: 20, right: 30, left: 100, bottom: 20 }  // Mais espaço à esquerda para nomes longos
    : { top: 20, right: 30, left: 20, bottom: 60 };  // Mais espaço embaixo para nomes longos
  
  // Se tivermos mais de uma série de dados, renderizamos barras agrupadas
  if (dataKeys.length > 1) {
    return (
      <ResponsiveContainer width="100%" height={height} className="animate-fade-in">
        {isHorizontal ? (
          <BarChart
            layout="vertical"
            data={data}
            margin={margins}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={!isHorizontal} vertical={isHorizontal} stroke="#e5e7eb" />
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
              width={90}
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
        ) : (
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
        )}
      </ResponsiveContainer>
    );
  }
  
  // Para uma única série de dados, renderizamos barras com cores individuais
  return (
    <ResponsiveContainer width="100%" height={height} className="animate-fade-in">
      {isHorizontal ? (
        <BarChart
          layout="vertical"
          data={data}
          margin={margins}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={!isHorizontal} vertical={isHorizontal} stroke="#e5e7eb" />
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
            width={100}
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
      ) : (
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
      )}
    </ResponsiveContainer>
  );
};
