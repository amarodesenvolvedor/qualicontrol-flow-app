
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

interface DateRangeSelectorProps {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  setFromDate: (date: Date | undefined) => void;
  setToDate: (date: Date | undefined) => void;
}

export const DateRangeSelector = ({
  fromDate,
  toDate,
  setFromDate,
  setToDate
}: DateRangeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Data Inicial</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fromDate ? (
                format(fromDate, "dd/MM/yyyy")
              ) : (
                <span>Selecionar data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={setFromDate}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <Label>Data Final</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {toDate ? (
                format(toDate, "dd/MM/yyyy")
              ) : (
                <span>Selecionar data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={setToDate}
              locale={ptBR}
              disabled={(date) => 
                fromDate ? date < fromDate : false
              }
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
