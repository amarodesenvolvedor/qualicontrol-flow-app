
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, subDays, startOfYear } from "date-fns";

interface DateRangeFilterProps {
  value: { from: Date | null; to: Date | null } | null;
  onChange: (range: { from: Date | null; to: Date | null } | null) => void;
}

export const DateRangeFilter = ({ value, onChange }: DateRangeFilterProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const predefinedRanges = [
    { 
      label: "Últimos 7 dias", 
      range: { from: subDays(new Date(), 7), to: new Date() } 
    },
    { 
      label: "Últimos 30 dias", 
      range: { from: subDays(new Date(), 30), to: new Date() } 
    },
    { 
      label: "Ano atual", 
      range: { from: startOfYear(new Date()), to: new Date() } 
    },
  ];

  const formatDateRange = () => {
    if (!value?.from && !value?.to) return "Selecionar datas";
    
    if (value?.from && value?.to) {
      return `${format(value.from, "dd/MM/yyyy")} - ${format(value.to, "dd/MM/yyyy")}`;
    }
    
    if (value?.from) {
      return `A partir de ${format(value.from, "dd/MM/yyyy")}`;
    }
    
    return `Até ${format(value.to as Date, "dd/MM/yyyy")}`;
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full mr-2">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDateRange()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
            <Calendar
              mode="range"
              defaultMonth={value?.from}
              selected={{ 
                from: value?.from ?? undefined, 
                to: value?.to ?? undefined 
              }}
              onSelect={(range) => {
                onChange(range ? { from: range.from, to: range.to } : null);
                if (range?.to) setIsCalendarOpen(false);
              }}
              initialFocus
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {predefinedRanges.map((preset, idx) => (
          <Button
            key={idx}
            variant="outline"
            size="sm"
            onClick={() => onChange(preset.range)}
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
