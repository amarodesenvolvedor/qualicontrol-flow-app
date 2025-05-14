import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { PieChartComponent, LineChartComponent, BarChartComponent } from "@/components/charts/ChartTypes";
import { DetailDialog } from "@/components/charts/DetailDialog";
import { DataItem } from "@/components/charts/types";

interface InteractiveChartProps {
  title: string;
  description?: string;
  data: DataItem[];
  type: "bar" | "pie" | "line";
  dataKey?: string;
  height?: number;
  layout?: "vertical" | "horizontal";
}

export const InteractiveChart = ({
  title,
  description,
  data,
  type = "bar",
  dataKey = "value",
  height = 300,
  layout = "vertical"
}: InteractiveChartProps) => {
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleChartClick = (data: DataItem) => {
    setSelectedItem(data);
    setDetailOpen(true);
  };

  const renderChart = () => {
    switch (type) {
      case "pie":
        return (
          <PieChartComponent 
            data={data} 
            type={type} 
            dataKey={dataKey} 
            height={height} 
            onItemClick={handleChartClick}
          />
        );
      case "line":
        return (
          <LineChartComponent 
            data={data} 
            type={type} 
            dataKey={dataKey} 
            height={height} 
            onItemClick={handleChartClick}
          />
        );
      case "bar":
      default:
        return (
          <BarChartComponent 
            data={data} 
            type={type} 
            dataKey={dataKey} 
            height={height} 
            layout={layout}
            onItemClick={handleChartClick}
          />
        );
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
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
        <div className="transition-all duration-300">
          {renderChart()}
        </div>
      </CardContent>

      <DetailDialog 
        selectedItem={selectedItem} 
        open={detailOpen} 
        onOpenChange={setDetailOpen} 
      />
    </Card>
  );
};
