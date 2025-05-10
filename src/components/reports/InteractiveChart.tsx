
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  BarChart, Bar, Cell, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DataItem {
  name: string;
  value: number;
  id?: string[];
  color?: string;
  [key: string]: any;
}

interface InteractiveChartProps {
  title: string;
  description?: string;
  data: DataItem[];
  type: "bar" | "pie" | "line";
  dataKey?: string;
  height?: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ff7300', '#a4de6c'];

export const InteractiveChart = ({
  title,
  description,
  data,
  type = "bar",
  dataKey = "value",
  height = 300
}: InteractiveChartProps) => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleChartClick = (data: DataItem) => {
    setSelectedItem(data);
    setDetailOpen(true);
  };

  const handleViewNonConformance = (id: string) => {
    navigate(`/nao-conformidades/${id}`);
    setDetailOpen(false);
  };

  const chartConfig = {
    primary: { theme: { light: "#0088FE", dark: "#0088FE" } },
    secondary: { theme: { light: "#00C49F", dark: "#00C49F" } },
    tertiary: { theme: { light: "#FFBB28", dark: "#FFBB28" } },
  };

  const renderChart = () => {
    switch (type) {
      case "pie":
        return (
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
                onClick={handleChartClick}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
      case "line":
        return (
          <ChartContainer config={chartConfig} className={`h-[${height}px]`}>
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
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
                activeDot={{ onClick: handleChartClick, r: 8, cursor: "pointer" }}
              />
            </LineChart>
          </ChartContainer>
        );
      case "bar":
      default:
        return (
          <ChartContainer config={chartConfig} className={`h-[${height}px]`}>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey={dataKey} 
                fill="#0088FE" 
                onClick={handleChartClick}
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
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {description && (
            <Badge variant="outline" className="flex items-center">
              <Info className="mr-1 h-3 w-3" />
              {description}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="text-center text-sm text-muted-foreground mb-2">
          Clique em um item no gráfico para ver detalhes
        </div>
        {renderChart()}
      </CardContent>

      {selectedItem && (
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Detalhes: {selectedItem.name}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">
                  Total: {selectedItem.value}
                </h4>
                <Badge>
                  {selectedItem.name}
                </Badge>
              </div>
              
              {selectedItem.id && selectedItem.id.length > 0 ? (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {selectedItem.id.map((id, index) => (
                      <Card key={index} className="p-3 hover:bg-muted/30">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{id}</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedItem.descriptions?.[index] || "Sem descrição disponível"}
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewNonConformance(id)}
                          >
                            Ver
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Sem registros detalhados disponíveis para este item.
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};
