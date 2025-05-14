
import { DataItem } from "../types";

// Get the data keys for the chart (excluding internal properties)
export const getDataKeys = (data: DataItem[], defaultKey: string): string[] => {
  const excludedKeys = ['name', 'id', 'descriptions', 'percentage', 'color'];
  
  if (data.length === 0) {
    return [defaultKey];
  }
  
  return Object.keys(data[0]).filter(key => !excludedKeys.includes(key));
};

// Determine if we should render grouped bars (multiple data series)
export const shouldRenderGroupedBars = (dataKeys: string[], defaultKey: string): boolean => {
  return dataKeys.length > 1 && !dataKeys.every(key => key === defaultKey);
};
