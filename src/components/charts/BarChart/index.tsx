
import { DataItem, ChartLayout } from "../types";
import { HorizontalBarChart } from "./HorizontalBarChart";
import { VerticalBarChart } from "./VerticalBarChart";

interface BarChartProps {
  data: DataItem[];
  dataKey?: string;
  height: number;
  layout?: ChartLayout;
  onItemClick: (data: DataItem) => void;
  type: string; // Keeping this for consistency with the chart component interface
}

export const BarChartComponent = ({ 
  data, 
  dataKey = "value", 
  height, 
  layout = "vertical", 
  onItemClick 
}: BarChartProps) => {
  // Determine if we should use horizontal or vertical layout
  const isHorizontal = layout === "horizontal";
  
  if (isHorizontal) {
    return (
      <HorizontalBarChart
        data={data}
        dataKey={dataKey}
        height={height}
        onItemClick={onItemClick}
      />
    );
  }
  
  return (
    <VerticalBarChart
      data={data}
      dataKey={dataKey}
      height={height}
      onItemClick={onItemClick}
    />
  );
};
