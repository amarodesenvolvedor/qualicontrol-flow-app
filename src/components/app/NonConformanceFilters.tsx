
import { NonConformanceFilter } from "@/types/nonConformance";
import { AdvancedFilters, DateRangeFilter, MultiSelectFilter } from "../shared/AdvancedFilters";
import { useDepartments } from "@/hooks/useDepartments";

interface NonConformanceFiltersProps {
  filters: NonConformanceFilter;
  onFilterChange: (filters: NonConformanceFilter) => void;
  showFilterButton?: boolean;
}

const NonConformanceFilters = ({ 
  filters, 
  onFilterChange,
  showFilterButton = true
}: NonConformanceFiltersProps) => {
  const { departments } = useDepartments();
  
  const statusOptions = [
    { value: 'pending', label: 'Pendente' },
    { value: 'in-progress', label: 'Em Andamento' },
    { value: 'resolved', label: 'Resolvido' },
    { value: 'closed', label: 'Encerrado' }
  ];

  const categoryOptions = [
    { value: 'quality', label: 'Qualidade' },
    { value: 'safety', label: 'Segurança' },
    { value: 'environment', label: 'Meio Ambiente' },
    { value: 'maintenance', label: 'Manutenção' },
    { value: 'operation', label: 'Operação' }
  ];

  const handleStatusChange = (values: string[]) => {
    onFilterChange({
      ...filters,
      status: values.length ? values[0] as NonConformanceFilter['status'] : undefined
    });
  };

  const handleCategoryChange = (values: string[]) => {
    onFilterChange({
      ...filters,
      category: values.length ? values.join(',') : undefined
    });
  };

  const handleDepartmentChange = (values: string[]) => {
    onFilterChange({
      ...filters,
      departmentId: values.length ? values.join(',') : undefined
    });
  };

  const handleDateRangeChange = (range: { from: Date | null; to: Date | null } | null) => {
    onFilterChange({
      ...filters,
      dateRange: range
    });
  };

  return (
    <AdvancedFilters 
      filters={filters} 
      onFilterChange={onFilterChange}
      showFilterButton={showFilterButton}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <MultiSelectFilter
          label="Selecionar status"
          options={statusOptions}
          selectedValues={filters.status ? [filters.status] : []}
          onChange={handleStatusChange}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Categoria</label>
        <MultiSelectFilter
          label="Selecionar categorias"
          options={categoryOptions}
          selectedValues={filters.category ? filters.category.split(',') : []}
          onChange={handleCategoryChange}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Departamento</label>
        <MultiSelectFilter
          label="Selecionar departamentos"
          options={departments.map(dept => ({ value: dept.id, label: dept.name }))}
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
    </AdvancedFilters>
  );
};

export default NonConformanceFilters;
