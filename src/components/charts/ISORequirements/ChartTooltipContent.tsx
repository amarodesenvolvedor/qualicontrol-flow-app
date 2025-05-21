
import React from "react";
import { getRequirementLabel, GroupingType } from "./chartUtils";

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: any[];
  groupingType: GroupingType;
}

export const ChartTooltipContent = ({ 
  active, 
  payload, 
  groupingType 
}: ChartTooltipContentProps) => {
  if (!active || !payload || !payload.length) return null;
  
  const item = payload[0].payload;
  const requirementLabel = getRequirementLabel(item.name, groupingType);
  
  return (
    <div className="rounded-lg border bg-background p-2 shadow-md">
      <div className="font-medium">{requirementLabel}</div>
      <div className="text-xs text-muted-foreground mb-1">{item.name}</div>
      {payload.map((p: any) => (
        <div 
          key={p.dataKey} 
          className="flex items-center justify-between gap-2 text-sm"
        >
          <div className="flex items-center gap-1">
            <div 
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span>{p.name}</span>
          </div>
          <span className="font-mono font-medium">{p.value}</span>
        </div>
      ))}
      <div className="mt-1 border-t pt-1 font-medium text-sm flex justify-between">
        <span>Total:</span>
        <span>{item.total}</span>
      </div>
    </div>
  );
};
