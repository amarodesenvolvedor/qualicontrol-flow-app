
import { Badge } from "@/components/ui/badge";

interface CalendarFiltersProps {
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

export const CalendarFilters = ({ 
  activeFilters, 
  onFilterChange 
}: CalendarFiltersProps) => {
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

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {filterOptions.map(filter => (
        <Badge
          key={filter.value}
          variant={activeFilters.includes(filter.value) ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => toggleFilter(filter.value)}
        >
          {filter.label}
        </Badge>
      ))}
    </div>
  );
};
