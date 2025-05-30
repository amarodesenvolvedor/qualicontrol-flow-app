
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, BarChart, Bar, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface OverviewTabProps {
  statusData: Array<{ name: string; value: number; color: string }>;
  departmentData: Array<{ name: string; total: number }>;
  COLORS: {
    [key: string]: string;
  };
}

const OverviewTab = ({ statusData, departmentData, COLORS }: OverviewTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Status Distribution */}
      <Card className="col-span-1 card-scale transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle>Distribuição por Status</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                cornerRadius={4}
                labelLine={false}
                label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                isAnimationActive={true}
              >
                {statusData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="#ffffff"
                    strokeWidth={2}
                    className="transition-all hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} não conformidade${Number(value) !== 1 ? 's' : ''}`, '']}
                contentStyle={{ 
                  borderRadius: '8px',
                  padding: '10px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: 'none'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                layout="horizontal"
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Department Distribution */}
      <Card className="col-span-1 card-scale transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle>Não Conformidades por Departamento</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <div className="overflow-x-auto" style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer width={departmentData.length > 3 ? Math.max(600, departmentData.length * 120) : '100%'} height="100%">
              <BarChart data={departmentData}>
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end"
                  height={60}
                  interval={0}
                  tick={{ fontSize: 10 }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} não conformidade${Number(value) !== 1 ? 's' : ''}`, '']}
                  contentStyle={{ 
                    borderRadius: '8px',
                    padding: '10px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: 'none'
                  }}
                />
                <Bar 
                  dataKey="total" 
                  fill={COLORS.primary}
                  radius={[4, 4, 0, 0]} 
                  barSize={30}
                  className="transition-all hover:opacity-80"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
