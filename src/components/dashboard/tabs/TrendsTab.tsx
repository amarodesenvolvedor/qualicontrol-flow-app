
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface TrendsTabProps {
  monthlyData: Array<{ 
    name: string; 
    pending: number; 
    inProgress: number; 
    completed: number; 
    total: number;
  }>;
  COLORS: {
    [key: string]: string;
  };
}

const TrendsTab = ({ monthlyData, COLORS }: TrendsTabProps) => {
  return (
    <Card className="card-scale transition-all hover:shadow-lg duration-300">
      <CardHeader>
        <CardTitle>Evolução Mensal de Não Conformidades</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              label={{ value: 'Período', position: 'insideBottomRight', offset: -10 }}
            />
            <YAxis 
              label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value, name) => {
                const labels = {
                  total: 'Total',
                  pending: 'Pendentes',
                  inProgress: 'Em Andamento',
                  completed: 'Concluídas'
                };
                const translatedName = labels[name as keyof typeof labels] || name;
                return [`${value} não conformidade${Number(value) !== 1 ? 's' : ''}`, translatedName];
              }}
              contentStyle={{ 
                borderRadius: '8px',
                padding: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: 'none'
              }}
              labelFormatter={(label) => `${label}`}
            />
            <Legend 
              formatter={(value) => {
                const labels = {
                  total: 'Total',
                  pending: 'Pendentes',
                  inProgress: 'Em Andamento',
                  completed: 'Concluídas'
                };
                return labels[value as keyof typeof labels] || value;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="total" 
              stackId="1" 
              stroke={COLORS.primary} 
              fill={COLORS.primary + "80"}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
              name="total"
            />
            <Area 
              type="monotone" 
              dataKey="pending" 
              stackId="2" 
              stroke={COLORS.pending} 
              fill={COLORS.pending + "80"}
              name="pending"
            />
            <Area 
              type="monotone" 
              dataKey="inProgress" 
              stackId="2" 
              stroke={COLORS.inProgress} 
              fill={COLORS.inProgress + "80"}
              name="inProgress"
            />
            <Area 
              type="monotone" 
              dataKey="completed" 
              stackId="2" 
              stroke={COLORS.completed} 
              fill={COLORS.completed + "80"}
              name="completed"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TrendsTab;
