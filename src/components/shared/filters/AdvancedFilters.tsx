
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

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
