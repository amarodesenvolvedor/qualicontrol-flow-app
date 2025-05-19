
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CalendarFiltersProps {
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

export const CalendarFilters = ({ 
  activeFilters, 
  onFilterChange 
}: CalendarFiltersProps) => {
  const isMobile = useIsMobile();
  const [showAllFilters, setShowAllFilters] = useState(false);
  
  const filterOptions = [
    { value: 'audit', label: 'Auditorias' },
    { value: 'scheduled', label: 'Auditorias Programadas' },
    { value: 'nonconformance', label: 'Não Conformidades' },
    { value: 'critical', label: 'Críticas' },
    { value: 'pending', label: 'Pendentes' },
    { value: 'dueThisWeek', label: 'Vencendo esta semana' },
  ];

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      onFilterChange(activeFilters.filter(f => f !== filter));
    } else {
      onFilterChange([...activeFilters, filter]);
    }
  };

  // On mobile, show limited filters initially with option to expand
  const displayedFilters = isMobile && !showAllFilters 
    ? filterOptions.slice(0, 3) 
    : filterOptions;

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-2">
        {displayedFilters.map(filter => (
          <Badge
            key={filter.value}
            variant={activeFilters.includes(filter.value) ? "default" : "outline"}
            className="cursor-pointer text-xs sm:text-sm whitespace-nowrap"
            onClick={() => toggleFilter(filter.value)}
          >
            {filter.label}
          </Badge>
        ))}
        
        {isMobile && filterOptions.length > 3 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs flex items-center h-6 px-2"
            onClick={() => setShowAllFilters(!showAllFilters)}
          >
            {showAllFilters ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Menos
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Mais {filterOptions.length - 3}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
