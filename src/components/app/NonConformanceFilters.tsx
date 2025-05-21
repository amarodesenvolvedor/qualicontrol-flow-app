
import { NonConformanceFilter } from "@/types/nonConformance";
import { AdvancedFilters, DateRangeFilter, MultiSelectFilter } from "../shared/filters";
import { useDepartments } from "@/hooks/useDepartments";
import { ISO_REQUIREMENTS } from "@/utils/isoRequirements";

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

  const isoRequirementOptions = ISO_REQUIREMENTS.map(req => ({
    value: req.value,
    label: req.label
  }));

  const handleStatusChange = (values: string[]) => {
    onFilterChange({
      ...filters,
      status: values.length ? values[0] as NonConformanceFilter['status'] : undefined
    });
  };

  const handleDepartmentChange = (values: string[]) => {
    onFilterChange({
      ...filters,
      departmentId: values.length ? values.join(',') : undefined
    });
  };

  const handleISORequirementChange = (values: string[]) => {
    onFilterChange({
      ...filters,
      isoRequirement: values.length ? values[0] : undefined
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
        <label className="text-sm font-medium">Departamento</label>
        <MultiSelectFilter
          label="Selecionar departamentos"
          options={departments.map(dept => ({ value: dept.id, label: dept.name }))}
          selectedValues={filters.departmentId ? filters.departmentId.split(',') : []}
          onChange={handleDepartmentChange}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Requisito ISO 9001:2015</label>
        <MultiSelectFilter
          label="Selecionar requisito"
          options={isoRequirementOptions}
          selectedValues={filters.isoRequirement ? [filters.isoRequirement] : []}
          onChange={handleISORequirementChange}
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
