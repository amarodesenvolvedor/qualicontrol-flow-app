
import React from "react";
import { DateRange, GroupingType } from "./chartUtils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarRange, Download } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ChartControlsProps {
  dateRange: DateRange | null;
  setDateRange: (range: DateRange | null) => void;
  groupingType: GroupingType;
  setGroupingType: (type: GroupingType) => void;
  onExport?: (format: string) => void;
}

export const ChartControls = ({
  dateRange,
  setDateRange,
  groupingType,
  setGroupingType,
  onExport
}: ChartControlsProps) => {
  return (
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
  );
};
