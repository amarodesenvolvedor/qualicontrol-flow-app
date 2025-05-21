import { useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ISO_REQUIREMENTS, ISO_REQUIREMENT_GROUPS } from "@/utils/isoRequirements";
import { getDataKeys } from "@/components/charts/BarChart/utils";
import { CalendarRange, Download } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { addDays, format, isBefore, isAfter, isWithinInterval } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ISORequirementsChartProps {
  data: any[];
  isLoading?: boolean;
  onExport?: (format: string) => void;
  height?: number;
}

type DataItem = {
  name: string;
  pending: number;
  inProgress: number;
  closed: number;
  total: number;
  value: number;
};

type DateRange = {
  from: Date | null;
  to: Date | null;
};

type GroupingType = "none" | "chapter";

export function ISORequirementsChart({ 
  data, 
  isLoading = false, 
  onExport,
  height = 400
}: ISORequirementsChartProps) {
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [groupingType, setGroupingType] = useState<GroupingType>("none");
  
  // Filter data by date range
  const filteredByDateData = useMemo(() => {
    if (!dateRange?.from && !dateRange?.to) return data;
    
    return data.filter(item => {
      const itemDate = new Date(item.occurrence_date);
      
      if (dateRange.from && dateRange.to) {
        return isWithinInterval(itemDate, { 
          start: dateRange.from, 
          end: addDays(dateRange.to, 1) // Include end date
        });
      }
      
      if (dateRange.from) {
        return isAfter(itemDate, dateRange.from) || 
               itemDate.toDateString() === dateRange.from.toDateString();
      }
      
      if (dateRange.to) {
        return isBefore(itemDate, addDays(dateRange.to, 1));
      }
      
      return true;
    });
  }, [data, dateRange]);
  
  // Process data for chart
  const chartData = useMemo(() => {
    // Create a map to count occurrences by ISO requirement
    const requirementCounts: Record<string, {
      pending: number;
      inProgress: number;
      closed: number;
      total: number;
      name: string;
      value: number; // Add value property to match DataItem interface
    }> = {};
    
    // Initialize with all ISO requirements
    if (groupingType === "none") {
      ISO_REQUIREMENTS.forEach(req => {
        requirementCounts[req.value] = {
          pending: 0,
          inProgress: 0,
          closed: 0,
          total: 0,
          name: req.value,
          value: 0 // Initialize value to 0
        };
      });
    } else {
      // For chapter grouping, initialize with chapter numbers
      const chapters = new Set<string>();
      
      ISO_REQUIREMENTS.forEach(req => {
        const chapter = req.value.split('.')[0];
        chapters.add(chapter);
      });
      
      chapters.forEach(chapter => {
        requirementCounts[chapter] = {
          pending: 0,
          inProgress: 0,
          closed: 0,
          total: 0,
          name: chapter,
          value: 0 // Initialize value to 0
        };
      });
    }
    
    // Count non-conformances by requirement
    filteredByDateData.forEach(nc => {
      if (!nc.iso_requirement) return;
      
      let key = nc.iso_requirement;
      
      // For chapter grouping, use the chapter number
      if (groupingType === "chapter") {
        key = nc.iso_requirement.split('.')[0];
      }
      
      // Create entry if it doesn't exist (for custom requirements not in the list)
      if (!requirementCounts[key]) {
        requirementCounts[key] = {
          pending: 0,
          inProgress: 0,
          closed: 0,
          total: 0,
          name: key,
          value: 0 // Initialize value to 0
        };
      }
      
      // Increment counts by status
      requirementCounts[key].total += 1;
      requirementCounts[key].value += 1; // Update value property to match total
      
      if (nc.status === "pending") {
        requirementCounts[key].pending += 1;
      } else if (nc.status === "in-progress") {
        requirementCounts[key].inProgress += 1;
      } else if (nc.status === "closed") {
        requirementCounts[key].closed += 1;
      }
    });
    
    // Convert to array and filter out requirements with zero count
    const result = Object.values(requirementCounts)
      .filter(item => item.total > 0)
      .sort((a, b) => {
        // Sort numerically for chapters
        if (groupingType === "chapter") {
          return parseInt(a.name) - parseInt(b.name);
        }
        
        // For regular requirements, sort by requirement value
        const [aMajor, aMinor] = a.name.split('.').map(Number);
        const [bMajor, bMinor] = b.name.split('.').map(Number);
        
        if (aMajor !== bMajor) {
          return aMajor - bMajor;
        }
        
        return aMinor - bMinor;
      });
    
    return result as DataItem[];
  }, [filteredByDateData, groupingType]);
  
  // Get the requirement labels for tooltips
  const getRequirementLabel = (requirement: string) => {
    if (groupingType === "chapter") {
      const group = ISO_REQUIREMENT_GROUPS.find(
        g => g.title.includes(`Capítulo ${requirement}`)
      );
      return group ? group.title.replace('📘 ', '') : `Capítulo ${requirement}`;
    }
    
    const reqDetails = ISO_REQUIREMENTS.find(req => req.value === requirement);
    return reqDetails ? reqDetails.label : requirement;
  };
  
  // Calculate chart width based on data length
  const chartWidth = Math.max(800, chartData.length * 80);
  
  // Chart configuration
  const chartConfig = {
    pending: { 
      label: "Pendentes", 
      theme: { light: "#3b82f6", dark: "#3b82f6" } 
    },
    inProgress: { 
      label: "Em Andamento", 
      theme: { light: "#f59e0b", dark: "#f59e0b" } 
    },
    closed: { 
      label: "Concluídas", 
      theme: { light: "#10b981", dark: "#10b981" } 
    },
  };
  
  // Get data keys for the chart
  const dataKeys = getDataKeys(chartData, "total").filter(key => 
    ["pending", "inProgress", "closed"].includes(key)
  );
  
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">
          Não Conformidades por Requisitos ISO 9001:2015
        </CardTitle>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarRange className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                      {format(dateRange.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy")
                  )
                ) : (
                  "Selecionar período"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <DateRangePicker
                initialDateFrom={dateRange?.from}
                initialDateTo={dateRange?.to}
                onUpdate={(range) => {
                  setDateRange({
                    from: range.from,
                    to: range.to
                  });
                }}
              />
            </PopoverContent>
          </Popover>
          
          <Select 
            value={groupingType}
            onValueChange={(value) => setGroupingType(value as GroupingType)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de agrupamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sem agrupamento</SelectItem>
              <SelectItem value="chapter">Por capítulo</SelectItem>
            </SelectContent>
          </Select>
          
          {onExport && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onExport("png")}
              title="Exportar gráfico"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="text-center text-sm text-muted-foreground mb-4">
          Clique em um item no gráfico para ver detalhes
        </div>
        
        <div className="overflow-x-auto">
          <div style={{ width: chartWidth, minHeight: height }}>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  interval={0}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                >
                  <Label 
                    value="Requisito ISO" 
                    position="insideBottom" 
                    offset={-10} 
                    fill="#6b7280" 
                  />
                </XAxis>
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                >
                  <Label 
                    value="Quantidade" 
                    angle={-90} 
                    position="insideLeft" 
                    style={{ textAnchor: 'middle' }} 
                    fill="#6b7280" 
                  />
                </YAxis>
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      const requirementLabel = getRequirementLabel(item.name);
                      
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
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  formatter={(value: string) => {
                    const valueMap: Record<string, string> = {
                      "pending": "Pendentes",
                      "inProgress": "Em Andamento",
                      "closed": "Concluídas"
                    };
                    return valueMap[value] || value;
                  }}
                />
                
                {dataKeys.map((key, index) => (
                  <Bar 
                    key={key}
                    dataKey={key}
                    name={
                      key === "pending" ? "Pendentes" : 
                      key === "inProgress" ? "Em Andamento" : 
                      "Concluídas"
                    }
                    stackId="stack"
                    fill={
                      key === "pending" ? "#3b82f6" : 
                      key === "inProgress" ? "#f59e0b" : 
                      "#10b981"
                    }
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
