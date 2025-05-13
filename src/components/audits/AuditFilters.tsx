
import { Input } from '@/components/ui/input';
import { AdvancedFilters, MultiSelectFilter, DateRangeFilter } from '@/components/shared/filters';
import type { Department } from '@/hooks/useDepartments';
import type { AuditFilter } from '@/types/audit';

interface AuditFiltersProps {
  departments: Department[];
  filters: AuditFilter;
  onFilterChange: (filters: AuditFilter) => void;
  showFilterButton?: boolean;
}

export const AuditFilters = ({ 
  departments, 
  filters, 
  onFilterChange,
  showFilterButton = true
}: AuditFiltersProps) => {
  // Generate years for the select dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  const statusOptions = [
    { value: 'pending', label: 'Pendente' },
    { value: 'in_progress', label: 'Em Andamento' },
    { value: 'completed', label: 'Concluído' },
  ];

  const handleYearChange = (values: string[]) => {
    onFilterChange({
      ...filters,
      year: values.length ? values[0] : undefined,
    });
  };

  const handleStatusChange = (values: string[]) => {
    onFilterChange({
      ...filters,
      status: values.length ? values.join(',') : undefined,
    });
  };

  const handleDepartmentChange = (values: string[]) => {
    onFilterChange({
      ...filters,
      departmentId: values.length ? values.join(',') : undefined,
    });
  };

  const handleDateRangeChange = (range: { from: Date | null; to: Date | null } | null) => {
    onFilterChange({
      ...filters,
      dateRange: range,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      searchTerm: e.target.value,
    });
  };

  return (
    <AdvancedFilters 
      filters={filters} 
      onFilterChange={onFilterChange}
      showFilterButton={showFilterButton}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">Ano</label>
        <MultiSelectFilter
          label="Selecionar ano"
          options={years.map(year => ({ value: year, label: year }))}
          selectedValues={filters.year ? [filters.year] : []}
          onChange={handleYearChange}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <MultiSelectFilter
          label="Selecionar status"
          options={statusOptions}
          selectedValues={filters.status ? filters.status.split(',') : []}
          onChange={handleStatusChange}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Departamento</label>
        <MultiSelectFilter
          label="Selecionar departamentos"
          options={departments.map(dept => ({ value: dept.id || '', label: dept.name }))}
          selectedValues={filters.departmentId ? filters.departmentId.split(',') : []}
          onChange={handleDepartmentChange}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium">Intervalo de data</label>
        <DateRangeFilter
          value={filters.dateRange}
          onChange={handleDateRangeChange}
        />
      </div>
      
      <div className="space-y-2 md:col-span-1">
        <label className="text-sm font-medium">Pesquisar</label>
        <Input
          placeholder="Pesquisar por título..."
          value={filters.searchTerm || ''}
          onChange={handleSearchChange}
        />
      </div>
    </AdvancedFilters>
  );
};
