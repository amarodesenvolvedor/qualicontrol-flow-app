
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  className?: string;
  initialDateFrom?: Date | null;
  initialDateTo?: Date | null;
  onUpdate?: (dateRange: { from: Date | null; to: Date | null }) => void;
}

export function DateRangePicker({
  className,
  initialDateFrom,
  initialDateTo,
  onUpdate,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    initialDateFrom || initialDateTo
      ? {
          from: initialDateFrom || undefined,
          to: initialDateTo || undefined,
        }
      : undefined
  );

  // Update parent when date changes
  React.useEffect(() => {
    if (onUpdate) {
      onUpdate({
        from: date?.from || null,
        to: date?.to || null,
      });
    }
  }, [date, onUpdate]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        onSelect={setDate}
        numberOfMonths={2}
        locale={pt}
      />
      <div className="flex gap-2 justify-end p-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setDate(undefined)}
        >
          Limpar
        </Button>
        <Button 
          size="sm"
          onClick={() => setDate({
            from: new Date(), 
            to: new Date()
          })}
        >
          Hoje
        </Button>
      </div>
    </div>
  );
}
