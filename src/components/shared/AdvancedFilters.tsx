
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarIcon, ChevronDown, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format, subDays, startOfYear } from "date-fns";

interface FilterOption {
  value: string;
  label: string;
}

interface MultiSelectFilterProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export const MultiSelectFilter = ({
  label,
  options,
  selectedValues,
  onChange,
}: MultiSelectFilterProps) => {
  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex justify-between w-full">
          <span>{label}</span>
          <div className="flex items-center">
            {selectedValues.length > 0 && (
              <Badge className="mr-2" variant="secondary">
                {selectedValues.length}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selectedValues.includes(option.value)}
            onCheckedChange={() => toggleValue(option.value)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

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

interface AdvancedFiltersProps {
  filters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
  showFilterButton?: boolean;
  children?: React.ReactNode;
}

export const AdvancedFilters = ({ 
  filters, 
  onFilterChange,
  showFilterButton = true,
  children
}: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const resetFilters = () => {
    // Reset all filters to their default values
    onFilterChange({});
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => {
      if (Array.isArray(value) && value.length > 0) return true;
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v !== null);
      }
      return !!value;
    });
  };

  return (
    <div className="space-y-4">
      {showFilterButton && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros avançados
            {hasActiveFilters() && (
              <Badge className="ml-2" variant="secondary">
                Ativos
              </Badge>
            )}
          </Button>
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
            >
              Limpar filtros
            </Button>
          )}
        </div>
      )}

      {(isOpen || !showFilterButton) && (
        <div className="bg-card border rounded-md p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
